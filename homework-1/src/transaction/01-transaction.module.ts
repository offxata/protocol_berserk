import { Module } from '@nestjs/common';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { TransactionRepository } from '../infra/repositories/transaction.repository';
import { ITransactionRepository } from './repositories/transaction.repository.interface';
import { InMemoryStorage } from '../infra/storage/in-memory-storage';

@Module({
  controllers: [TransactionController],
  providers: [
    TransactionService,
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
    TransactionRepository,
    InMemoryStorage,
  ],
  exports: [TransactionService, 'ITransactionRepository', InMemoryStorage],
})
export class TransactionModule {}
