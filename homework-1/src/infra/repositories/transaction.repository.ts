import { Injectable } from '@nestjs/common';
import { ITransactionRepository } from '../../transaction/repositories/transaction.repository.interface';
import { Transaction } from '../../transaction/entities/transaction.entity';
import { InMemoryStorage } from '../storage/in-memory-storage';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(private readonly storage: InMemoryStorage) {}

  async create(transaction: Transaction): Promise<Transaction> {
    this.storage.save(transaction);
    return transaction;
  }

  async findAll(): Promise<Transaction[]> {
    return this.storage.findAll();
  }

  async findById(id: string): Promise<Transaction | null> {
    return this.storage.findById(id);
  }

  async findByAccount(accountId: string): Promise<Transaction[]> {
    return this.storage.findByAccount(accountId);
  }

  async filter(criteria: {
    accountId?: string;
    type?: string;
    from?: Date;
    to?: Date;
  }): Promise<Transaction[]> {
    return this.storage.filter(criteria);
  }
}
