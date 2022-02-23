import { Connection } from 'mongoose';
import { TransactionSchema } from './entities/transaction.entity';

export const TransactionsProvider = [
  {
    provide: 'TRANSACTION_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Transactions', TransactionSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
