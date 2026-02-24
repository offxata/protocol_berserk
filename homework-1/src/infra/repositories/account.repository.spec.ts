import { Test, TestingModule } from '@nestjs/testing';
import { AccountRepository } from './account.repository';
import { ITransactionRepository } from '../../transaction/repositories/transaction.repository.interface';
import { Transaction, TransactionType } from '../../transaction/entities/transaction.entity';

describe('AccountRepository', () => {
  let repository: AccountRepository;
  let transactionRepository: jest.Mocked<ITransactionRepository>;

  const mockTransactionRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByAccount: jest.fn(),
    filter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountRepository,
        {
          provide: 'ITransactionRepository',
          useValue: mockTransactionRepository,
        },
      ],
    }).compile();

    repository = module.get<AccountRepository>(AccountRepository);
    transactionRepository = module.get('ITransactionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBalance', () => {
    it('should calculate balance correctly for deposits', async () => {
      const accountId = 'ACC-12345';
      const transactions = [
        new Transaction('ACC-99999', accountId, 100, 'USD', TransactionType.DEPOSIT),
        new Transaction('ACC-88888', accountId, 200, 'USD', TransactionType.DEPOSIT),
      ];

      transactionRepository.findAll.mockResolvedValue(transactions);

      const result = await repository.getBalance(accountId);

      expect(result.balance).toBe(300);
      expect(result.currency).toBe('USD');
    });

    it('should calculate balance correctly for withdrawals', async () => {
      const accountId = 'ACC-12345';
      const transactions = [
        new Transaction(accountId, 'ACC-99999', 100, 'USD', TransactionType.WITHDRAWAL),
        new Transaction(accountId, 'ACC-88888', 50, 'USD', TransactionType.WITHDRAWAL),
      ];

      transactionRepository.findAll.mockResolvedValue(transactions);

      const result = await repository.getBalance(accountId);

      expect(result.balance).toBe(-150);
    });

    it('should calculate balance correctly for transfers', async () => {
      const accountId = 'ACC-12345';
      const transactions = [
        new Transaction(accountId, 'ACC-67890', 100, 'USD', TransactionType.TRANSFER), // Sent
        new Transaction('ACC-11111', accountId, 200, 'USD', TransactionType.TRANSFER), // Received
      ];

      transactionRepository.findAll.mockResolvedValue(transactions);

      const result = await repository.getBalance(accountId);

      expect(result.balance).toBe(100); // 200 received - 100 sent
    });

    it('should calculate balance correctly for mixed transactions', async () => {
      const accountId = 'ACC-12345';
      const transactions = [
        new Transaction('ACC-99999', accountId, 1000, 'USD', TransactionType.DEPOSIT), // +1000
        new Transaction(accountId, 'ACC-88888', 200, 'USD', TransactionType.WITHDRAWAL), // -200
        new Transaction('ACC-11111', accountId, 300, 'USD', TransactionType.TRANSFER), // +300
        new Transaction(accountId, 'ACC-22222', 150, 'USD', TransactionType.TRANSFER), // -150
      ];

      transactionRepository.findAll.mockResolvedValue(transactions);

      const result = await repository.getBalance(accountId);

      expect(result.balance).toBe(950); // 1000 - 200 + 300 - 150
    });

    it('should return zero balance for account with no transactions', async () => {
      const accountId = 'ACC-12345';

      transactionRepository.findAll.mockResolvedValue([]);

      const result = await repository.getBalance(accountId);

      expect(result.balance).toBe(0);
      expect(result.currency).toBe('USD');
    });
  });

  describe('getSummary', () => {
    it('should calculate summary correctly', async () => {
      const accountId = 'ACC-12345';
      const transactions = [
        new Transaction('ACC-99999', accountId, 1000, 'USD', TransactionType.DEPOSIT),
        new Transaction('ACC-88888', accountId, 500, 'USD', TransactionType.DEPOSIT),
        new Transaction(accountId, 'ACC-77777', 200, 'USD', TransactionType.WITHDRAWAL),
        new Transaction(accountId, 'ACC-66666', 100, 'USD', TransactionType.WITHDRAWAL),
        new Transaction('ACC-11111', accountId, 300, 'USD', TransactionType.TRANSFER),
      ];

      transactionRepository.findAll.mockResolvedValue(transactions);

      const result = await repository.getSummary(accountId);

      expect(result.totalDeposits).toBe(1500); // 1000 + 500
      expect(result.totalWithdrawals).toBe(300); // 200 + 100
      expect(result.transactionCount).toBe(5);
      expect(result.mostRecentDate).toBeInstanceOf(Date);
    });

    it('should return zero summary for account with no transactions', async () => {
      const accountId = 'ACC-12345';

      transactionRepository.findAll.mockResolvedValue([]);

      const result = await repository.getSummary(accountId);

      expect(result.totalDeposits).toBe(0);
      expect(result.totalWithdrawals).toBe(0);
      expect(result.transactionCount).toBe(0);
      expect(result.mostRecentDate).toBeNull();
    });

    it('should find most recent date correctly', async () => {
      const accountId = 'ACC-12345';
      const transaction1 = new Transaction('ACC-99999', accountId, 100, 'USD', TransactionType.DEPOSIT);
      transaction1.timestamp = new Date('2024-01-15');

      const transaction2 = new Transaction('ACC-88888', accountId, 200, 'USD', TransactionType.DEPOSIT);
      transaction2.timestamp = new Date('2024-01-20');

      transactionRepository.findAll.mockResolvedValue([transaction1, transaction2]);

      const result = await repository.getSummary(accountId);

      expect(result.mostRecentDate).toEqual(new Date('2024-01-20'));
    });
  });
});
