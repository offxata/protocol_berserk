import { Transaction } from '../../transaction/entities/transaction.entity';

export class InMemoryStorage {
  private transactions: Map<string, Transaction>;

  constructor() {
    this.transactions = new Map<string, Transaction>();
  }

  save(transaction: Transaction): void {
    this.transactions.set(transaction.id, transaction);
  }

  findById(id: string): Transaction | null {
    return this.transactions.get(id) || null;
  }

  findAll(): Transaction[] {
    return Array.from(this.transactions.values());
  }

  findByAccount(accountId: string): Transaction[] {
    return this.findAll().filter(
      (transaction) =>
        transaction.fromAccount === accountId ||
        transaction.toAccount === accountId,
    );
  }

  filter(criteria: {
    accountId?: string;
    type?: string;
    from?: Date;
    to?: Date;
  }): Transaction[] {
    let filtered = this.findAll();

    if (criteria.accountId) {
      filtered = filtered.filter(
        (transaction) =>
          transaction.fromAccount === criteria.accountId ||
          transaction.toAccount === criteria.accountId,
      );
    }

    if (criteria.type) {
      filtered = filtered.filter(
        (transaction) => transaction.type === criteria.type,
      );
    }

    if (criteria.from) {
      filtered = filtered.filter(
        (transaction) => transaction.timestamp >= criteria.from!,
      );
    }

    if (criteria.to) {
      filtered = filtered.filter(
        (transaction) => transaction.timestamp <= criteria.to!,
      );
    }

    return filtered;
  }

  clear(): void {
    this.transactions.clear();
  }
}
