import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsProvider } from './transactions.provider';

describe('Transactions', () => {
  let provider: TransactionsProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionsProvider],
    }).compile();

    provider = module.get<TransactionsProvider>(TransactionsProvider);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
