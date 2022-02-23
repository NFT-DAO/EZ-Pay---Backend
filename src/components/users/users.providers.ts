import { Connection } from 'mongoose';
import { UsersSchema } from './entities/users.entity';

export const usersProviders = [
  {
    provide: 'USER_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('Users', UsersSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
