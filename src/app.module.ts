import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './components/auth/auth.module';
import { UsersModule } from './components/users/users.module';
import { AuthController } from './components/auth/auth.controller';
import { DatabaseModule } from './database.module';
import { TransactionsController } from './components/transactions/transactions.controller';
import { TransactionsModule } from './components/transactions/transactions.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    DatabaseModule,
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TransactionsModule,
  ],
  controllers: [AppController, AuthController, TransactionsController],
  providers: [AppService],
})
export class AppModule {}
