import { Module } from '@nestjs/common';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { DatabaseModule } from '../../database.module';
import { ConfigModule } from '@nestjs/config';
import { CardanoService } from './services/cardano/cardano.service';
import { TransactionsProvider } from './transactions.provider';

@Module({
  imports: [DatabaseModule, ConfigModule],
  controllers: [TransactionsController],
  providers: [TransactionsService, CardanoService, ...TransactionsProvider],
  exports: [TransactionsService, CardanoService],
})
export class TransactionsModule {}
