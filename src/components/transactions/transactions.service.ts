import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import {
  OrderPayPalRequestDto,
  OrderRequestDto,
} from './dto/order-request.dto';
import { Model } from 'mongoose';
import { Transactions } from './entities/transaction.entity';
import { CardanoService } from './services/cardano/cardano.service';

@Injectable()
export class TransactionsService {
  private stripe: Stripe;
  private readonly frontendUrl: string;
  constructor(
    @Inject('TRANSACTION_MODEL')
    public transactionsModel: Model<Transactions>,
    private cardanoService: CardanoService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(configService.get('STRIPE_KEY'), {
      apiVersion: '2020-08-27',
    });
    this.frontendUrl = configService.get('FRONTEND_URL');
  }

  async getTransactions(user) {
    return this.transactionsModel.find({
      user_id: user.user_id,
    });
  }

  /**
   * Get transaction details
   * @param user
   */
  async getTransactionDetails(id) {
    return this.transactionsModel.findOne({
      _id: id,
    });
  }

  /**
   * Change status for transaction
   * @param transactionId
   */
  async changeTransactionStatus(transactionId) {
    const transaction = await this.transactionsModel.findOne({
      payment_id: transactionId,
    });

    const transactionInfo = await this.cardanoService.sendPayment(
      transaction.ada_address,
      parseFloat(transaction.quantity).toFixed(6).split('.').join(''),
    );

    transaction.cardanoTransactionId = transactionInfo.id;
    transaction.transactionStatus = 'success';
    return await transaction.save();
  }

  async createPayPalOrder(orderDto: OrderPayPalRequestDto, user) {
    // Re-calculating price to avoid manually forcing API to charge less
    const fiatAmount = (
      parseFloat(String(orderDto.cardanoAmount)) *
      parseFloat(<string>await this.getPrice())
    ).toFixed(2);

    // Creating transaction record
    const transaction = new this.transactionsModel({
      payment_id: orderDto.payPalTransactionId,
      ada_address: orderDto.cardanoAddress,
      quantity: orderDto.cardanoAmount,
      fiat_amount: fiatAmount,
      user_id: user.user_id,
    });
    try {
      await transaction.save();
      return {
        redirect_url: `${this.frontendUrl}/transaction/${transaction._id}`,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(orderDto: OrderRequestDto, user) {
    // Re-calculating price to avoid manually forcing API to charge less
    const fiatAmount = (
      parseFloat(String(orderDto.cardanoAmount)) *
      parseFloat(<string>await this.getPrice())
    ).toFixed(2);

    // Creating transaction record
    const transaction = new this.transactionsModel({
      ada_address: orderDto.cardanoAddress,
      quantity: orderDto.cardanoAmount,
      fiat_amount: fiatAmount,
      user_id: user.user_id,
    });

    const session = await this.stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Purchase ${orderDto.cardanoAmount} ADA`,
            },
            unit_amount: parseInt(String(fiatAmount).split('.').join('')),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${this.frontendUrl}/transaction/${transaction._id}`,
      cancel_url: `${this.frontendUrl}/canceled`,
    });

    try {
      transaction.payment_id = session.id;
      const transactionResult = await transaction.save();
      return {
        redirect_url: session.url,
        transaction_result: transactionResult,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getPrice() {
    if (this.configService.get('CARDANO_PRICE_STATIC') === 'false') {
      const price = await axios.get(
        this.configService.get('CARDANO_PRICE_ENDPOINT'),
        {
          headers: {
            'X-CoinAPI-Key': this.configService.get('CARDANO_PRICE_API_KEY'),
          },
        },
      );
      return parseFloat(price.data.rate).toFixed(2);
    } else {
      return 0.95;
    }
  }
}
