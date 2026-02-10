import { v4 as uuidv4 } from 'uuid';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export class Transaction {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  type: TransactionType;
  timestamp: Date;
  status: TransactionStatus;

  constructor(
    fromAccount: string,
    toAccount: string,
    amount: number,
    currency: string,
    type: TransactionType,
  ) {
    this.id = uuidv4();
    this.fromAccount = fromAccount;
    this.toAccount = toAccount;
    this.amount = amount;
    this.currency = currency;
    this.type = type;
    this.timestamp = new Date();
    this.status = TransactionStatus.COMPLETED;
  }

  static create(
    fromAccount: string,
    toAccount: string,
    amount: number,
    currency: string,
    type: TransactionType,
  ): Transaction {
    return new Transaction(fromAccount, toAccount, amount, currency, type);
  }
}
