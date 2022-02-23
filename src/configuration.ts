export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  secret: process.env.JWT_SECRET,
  stripe_key: process.env.STRIPE_KEY,
  base_url: process.env.BASE_URL,
  frontend_url: process.env.FRONTEND_URL,
  cardano_endpoint: process.env.CARDANO_ENDPOINT,
  cardano_passphrase: process.env.CARDANO_PASSPHRASE,
  cardano_wallet: process.env.CARDANO_WALLET,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
});
