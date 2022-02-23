import { Injectable, Logger } from '@nestjs/common';
import { AddressWallet, ShelleyWallet, WalletServer } from 'cardano-wallet-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CardanoService {
  private walletServer: WalletServer;
  private wallets: ShelleyWallet[];
  private wallet: any;
  private holdingAddress: any;

  /**
   * CardanoService
   * @param configService
   */
  constructor(private configService: ConfigService) {
    this.walletServer = WalletServer.init(
      `${this.configService.get('CARDANO_ENDPOINT')}`,
    );
    this.setupCardano().then(() => {
      Logger.log('[✓] CARDANO wallet connection is ready...');
    });
  }

  /**
   * Setup cardano wallets
   */
  async setupCardano() {
    this.wallets = await this.walletServer.wallets();
    if (typeof this.wallets[0] !== 'undefined') {
      this.wallet = await this.walletServer.getShelleyWallet(
        this.wallets[0].id,
      );
      this.holdingAddress = (await this.wallet.getUsedAddresses()).slice(0, 1);
    }
  }

  async sendPayment(address: string, amount: string): Promise<any> {
    const amounts = [parseInt(amount)];
    return await this.wallet.sendPayment(
      this.configService.get('CARDANO_PASSPHRASE'),
      [new AddressWallet(address)],
      amounts,
    );
  }
}
