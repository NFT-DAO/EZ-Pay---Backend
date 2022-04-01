import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { TransactionsService } from './transactions.service';
import {
  OrderPayPalRequestDto,
  OrderRequestDto,
} from './dto/order-request.dto';
import { CardanoService } from './services/cardano/cardano.service';

@ApiTags('Transactions')
@Controller('api/transactions')
export class TransactionsController {
  constructor(
    private transactionService: TransactionsService,
    private cardanoService: CardanoService,
  ) {}

  @ApiOkResponse({
    status: 200,
    description: 'Successful request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized request',
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Get('/')
  async transactions(@Req() req): Promise<any> {
    return await this.transactionService.getTransactions(req.user);
  }

  /**
   * Get current CARDANO price
   */
  @Get('coin-price')
  async price(): Promise<any> {
    return await this.transactionService.getPrice();
  }

  /**
   * Get transaction details
   * @param req
   */
  @ApiOkResponse({
    status: 200,
    description: 'Successful request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized request',
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Get('/:id')
  async transaction(@Req() req, @Param() params): Promise<any> {
    return await this.transactionService.getTransactionDetails(params.id);
  }

  /**
   * Create buy order
   */
  @ApiOkResponse({
    status: 200,
    description: 'Successful request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized request',
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Post('create')
  async transfer(@Req() req, @Body() orderDto: OrderRequestDto): Promise<any> {
    return await this.transactionService.create(orderDto, req.user);
  }

  /**
   * Create PayPal buy order
   */
  @ApiOkResponse({
    status: 200,
    description: 'Successful request',
  })
  @ApiUnauthorizedResponse({
    status: 401,
    description: 'Unauthorized request',
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  @Post('paypal-order')
  async paypalOrder(
    @Req() req,
    @Body() orderDto: OrderPayPalRequestDto,
  ): Promise<any> {
    return await this.transactionService.createPayPalOrder(orderDto, req.user);
  }

  /**
   * Create buy order
   */
  @ApiOkResponse({
    status: 200,
    description: 'Successful request',
  })
  @Post('webhook')
  async webhook(@Req() req, @Body() hookData): Promise<any> {
    // PayPal Capture hook
    if (
      typeof hookData.event_type !== 'undefined' &&
      hookData.event_type === 'PAYMENT.CAPTURE.COMPLETED'
    ) {
      const order_id =
        hookData.resource?.supplementary_data?.related_ids?.order_id;
      return order_id
        ? await this.transactionService.changeTransactionStatus(order_id)
        : {
            status: 500,
            message: 'Unable to process',
          };
    }

    // Stripe Capture hook
    if (
      typeof hookData.type !== 'undefined' &&
      hookData.type === 'checkout.session.completed'
    ) {
      if (typeof hookData.data.object.id !== 'undefined') {
        return await this.transactionService.changeTransactionStatus(
          hookData.data.object.id,
        );
      }
    }
  }
}
