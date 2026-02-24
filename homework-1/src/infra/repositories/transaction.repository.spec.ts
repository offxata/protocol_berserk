import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepository } from './transaction.repository';
import { InMemoryStorage } from '../storage/in-memory-storage';
import { Transaction, TransactionType } from '../../transaction/entities/transaction.entity';

describe('TransactionRepository', () => {
  let repository: TransactionRepository;
  let storage: InMemoryStorage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepository,
        InMemoryStorage,
      ],
    }).compile();

    repository = module.get<TransactionRepository>(TransactionRepository);
    storage = module.get<InMemoryStorage>(InMemoryStorage);
    storage.clear(); // Clear storage before each test
  });

  afterEach(() => {
    storage.clear();
  });

  describe('create', () => {
    it('should save and return a transaction', async () => {
      const transaction = new Transaction(
        'ACC-12345',
        'ACC-67890',
        100,
        'USD',
        TransactionType.TRANSFER,
      );

      const result = await repository.create(transaction);

      expect(result).toBe(transaction);
      const saved = await repository.findById(transaction.id);
      expect(saved).toEqual(transaction);
    });
  });

  describe('findAll', () => {
    it('should return all transactions', async () => {
      const transaction1 = new Transaction('ACC-12345', 'ACC-67890', 100, 'USD', TransactionType.TRANSFER);
      const transaction2 = new Transaction('ACC-11111', 'ACC-22222', 50, 'USD', TransactionType.DEPOSIT);

      await repository.create(transaction1);
      await repository.create(transaction2);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(transaction1);
      expect(result).toContainEqual(transaction2);
    });

    it('should return empty array when no transactions', async () => {
      const result = await repository.findAll();

      expect(result).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should return transaction when found', async () => {
      const transaction = new Transaction('ACC-12345', 'ACC-67890', 100, 'USD', TransactionType.TRANSFER);
      await repository.create(transaction);

      const result = await repository.findById(transaction.id);

      expect(result).toEqual(transaction);
    });

    it('should return null when transaction not found', async () => {
      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('findByAccount', () => {
    it('should return transactions for account as fromAccount', async () => {
      const accountId = 'ACC-12345';
      const transaction1 = new Transaction(accountId, 'ACC-67890', 100, 'USD', TransactionType.TRANSFER);
      const transaction2 = new Transaction('ACC-99999', accountId, 50, 'USD', TransactionType.TRANSFER);
      const transaction3 = new Transaction('ACC-11111', 'ACC-22222', 200, 'USD', TransactionType.TRANSFER);

      await repository.create(transaction1);
      await repository.create(transaction2);
      await repository.create(transaction3);

      const result = await repository.findByAccount(accountId);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual(transaction1);
      expect(result).toContainEqual(transaction2);
      expect(result).not.toContainEqual(transaction3);
    });

    it('should return transactions for account as toAccount', async () => {
      const accountId = 'ACC-67890';
      const transaction1 = new Transaction('ACC-12345', accountId, 100, 'USD', TransactionType.TRANSFER);

      await repository.create(transaction1);

      const result = await repository.findByAccount(accountId);

      expect(result).toHaveLength(1);
      expect(result).toContainEqual(transaction1);
    });
  });

  describe('filter', () => {
    it('should filter by accountId', async () => {
      const accountId = 'ACC-12345';
      const transaction1 = new Transaction(accountId, 'ACC-67890', 100, 'USD', TransactionType.TRANSFER);
      const transaction2 = new Transaction('ACC-99999', 'ACC-88888', 50, 'USD', TransactionType.TRANSFER);

      await repository.create(transaction1);
      await repository.create(transaction2);

      const result = await repository.filter({ accountId });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(transaction1);
    });

    it('should filter by type', async () => {
      const transaction1 = new Transaction('ACC-12345', 'ACC-67890', 100, 'USD', TransactionType.TRANSFER);
      const transaction2 = new Transaction('ACC-11111', 'ACC-22222', 50, 'USD', TransactionType.DEPOSIT);

      await repository.create(transaction1);
      await repository.create(transaction2);

      const result = await repository.filter({ type: TransactionType.TRANSFER });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(transaction1);
    });

    it('should filter by date range', async () => {
      const transaction1 = new Transaction('ACC-12345', 'ACC-67890', 100, 'USD', TransactionType.TRANSFER);
      transaction1.timestamp = new Date('2024-01-15');

      const transaction2 = new Transaction('ACC-11111', 'ACC-22222', 50, 'USD', TransactionType.DEPOSIT);
      transaction2.timestamp = new Date('2024-02-15');

      await repository.create(transaction1);
      await repository.create(transaction2);

      const result = await repository.filter({
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31'),
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(transaction1);
    });

    it('should combine multiple filters', async () => {
      const accountId = 'ACC-12345';
      const transaction1 = new Transaction(accountId, 'ACC-67890', 100, 'USD', TransactionType.TRANSFER);
      transaction1.timestamp = new Date('2024-01-15');

      const transaction2 = new Transaction(accountId, 'ACC-99999', 50, 'USD', TransactionType.DEPOSIT);
      transaction2.timestamp = new Date('2024-01-20');

      await repository.create(transaction1);
      await repository.create(transaction2);

      const result = await repository.filter({
        accountId,
        type: TransactionType.TRANSFER,
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31'),
      });

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(transaction1);
    });
  });
});
