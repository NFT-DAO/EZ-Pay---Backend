const { Seed, WalletServer } = require('cardano-wallet-js');

let walletServer = WalletServer.init('http://:8090/v2');
let recoveryPhrase = Seed.generateRecoveryPhrase();
let mnemonic_sentence = Seed.toMnemonicList(recoveryPhrase);
let passphrase = 'cardanopasskey';
let name = 'cardano-wallet';

(async () => {
  let parameters = await walletServer.getNetworkParameters();
  let information = await walletServer.getNetworkInformation();

  /**
   * Create Wallet
   * @type {ShelleyWallet[]}
   */
  //let createWallet = await walletServer.createOrRestoreShelleyWallet(name, mnemonic_sentence, passphrase);

  /**
   * Get wallet
   * @type {ShelleyWallet[]}
   */
  let wallets = await walletServer.wallets();
  let id = wallets[0].id;
  let wallet = await walletServer.getShelleyWallet(id);


  /**
   * Get addresses
   * @type {AddressWallet[]}
   */
  let addresses = await wallet.getAddresses();

  /**
   * Get unused addresses
   * @type {AddressWallet[]}
   */
  let unusedAddresses = await wallet.getUnusedAddresses();

  /**
   * Get used addresses
   * @type {AddressWallet[]}
   */
  let usedAddresses = await wallet.getUsedAddresses();

  /**
   * Get available balance
   * @type {number}
   */
  let availableBalance = wallet.getAvailableBalance();

  console.log(usedAddresses);
})();
