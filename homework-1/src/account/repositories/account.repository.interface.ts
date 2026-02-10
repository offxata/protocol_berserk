export interface Balance {
  accountId: string;
  balance: number;
  currency: string;
}

export interface Summary {
  accountId: string;
  totalDeposits: number;
  totalWithdrawals: number;
  transactionCount: number;
  mostRecentDate: Date | null;
}

export interface IAccountRepository {
  getBalance(accountId: string): Promise<Balance>;
  getSummary(accountId: string): Promise<Summary>;
}
