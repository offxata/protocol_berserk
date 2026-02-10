import { Transaction } from '../entities/transaction.entity';

export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
  findByAccount(accountId: string): Promise<Transaction[]>;
  filter(criteria: {
    accountId?: string;
    type?: string;
    from?: Date;
    to?: Date;
  }): Promise<Transaction[]>;
}
