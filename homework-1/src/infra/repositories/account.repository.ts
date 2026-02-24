import { Injectable, Inject } from '@nestjs/common';
import {
  IAccountRepository,
  Balance,
  Summary,
} from '../../account/repositories/account.repository.interface';
import { ITransactionRepository } from '../../transaction/repositories/transaction.repository.interface';
import { TransactionType } from '../../transaction/entities/transaction.entity';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async getBalance(accountId: string): Promise<Balance> {
    const transactions = await this.transactionRepository.findAll();
    const accountTransactions = transactions.filter(
      (t) => t.fromAccount === accountId || t.toAccount === accountId,
    );

    if (accountTransactions.length === 0) {
      return {
        accountId,
        balance: 0,
        currency: 'USD', // Default currency
      };
    }

    // Get currency from first transaction (assuming single currency per account for now)
    const currency = accountTransactions[0].currency;

    let balance = 0;

    for (const transaction of accountTransactions) {
      if (transaction.type === TransactionType.DEPOSIT) {
        if (transaction.toAccount === accountId) {
          balance += transaction.amount;
        }
      } else if (transaction.type === TransactionType.WITHDRAWAL) {
        if (transaction.fromAccount === accountId) {
          balance -= transaction.amount;
        }
      } else if (transaction.type === TransactionType.TRANSFER) {
        if (transaction.toAccount === accountId) {
          balance += transaction.amount;
        } else if (transaction.fromAccount === accountId) {
          balance -= transaction.amount;
        }
      }
    }

    return {
      accountId,
      balance,
      currency,
    };
  }

  async getSummary(accountId: string): Promise<Summary> {
    const transactions = await this.transactionRepository.findAll();
    const accountTransactions = transactions.filter(
      (t) => t.fromAccount === accountId || t.toAccount === accountId,
    );

    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let mostRecentDate: Date | null = null;

    for (const transaction of accountTransactions) {
      if (transaction.type === TransactionType.DEPOSIT) {
        if (transaction.toAccount === accountId) {
          totalDeposits += transaction.amount;
        }
      } else if (transaction.type === TransactionType.WITHDRAWAL) {
        if (transaction.fromAccount === accountId) {
          totalWithdrawals += transaction.amount;
        }
      }

      if (!mostRecentDate || transaction.timestamp > mostRecentDate) {
        mostRecentDate = transaction.timestamp;
      }
    }

    return {
      accountId,
      totalDeposits,
      totalWithdrawals,
      transactionCount: accountTransactions.length,
      mostRecentDate,
    };
  }
}
