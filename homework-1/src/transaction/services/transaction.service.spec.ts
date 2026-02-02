import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { ITransactionRepository } from '../repositories/transaction.repository.interface';
import { Transaction, TransactionType, TransactionStatus } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';

describe('TransactionService', () => {
  let service: TransactionService;
  let repository: jest.Mocked<ITransactionRepository>;

  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    findByAccount: jest.fn(),
    filter: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'ITransactionRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get('ITransactionRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createTransaction', () => {
    it('should create a transaction successfully', async () => {
      const dto: CreateTransactionDto = {
        fromAccount: 'ACC-12345',
        toAccount: 'ACC-67890',
        amount: 100.50,
        currency: 'USD',
        type: TransactionType.TRANSFER,
      };

      const mockTransaction = new Transaction(
        dto.fromAccount,
        dto.toAccount,
        dto.amount,
        dto.currency,
        dto.type,
      );

      repository.create.mockResolvedValue(mockTransaction);

      const result = await service.createTransaction(dto);

      expect(repository.create).toHaveBeenCalledTimes(1);
      expect(result).toMatchObject({
        fromAccount: dto.fromAccount,
        toAccount: dto.toAccount,
        amount: dto.amount,
        currency: dto.currency,
        type: dto.type,
        status: TransactionStatus.COMPLETED,
      });
      expect(result.id).toBeDefined();
      expect(result.timestamp).toBeDefined();
    });
  });

  describe('getAllTransactions', () => {
    it('should return all transactions when no filter is provided', async () => {
      const mockTransactions = [
        new Transaction('ACC-12345', 'ACC-67890', 100, 'USD', TransactionType.TRANSFER),
        new Transaction('ACC-11111', 'ACC-22222', 50, 'USD', TransactionType.DEPOSIT),
      ];

      repository.findAll.mockResolvedValue(mockTransactions);

      const result = await service.getAllTransactions();

      expect(repository.findAll).toHaveBeenCalledTimes(1);
      expect(result).toHaveLength(2);
      expect(result[0].fromAccount).toBe('ACC-12345');
    });

    it('should filter transactions by accountId', async () => {
      const filterDto = { accountId: 'ACC-12345' };
      const mockTransactions = [
        new Transaction('ACC-12345', 'ACC-67890', 100, 'USD', TransactionType.TRANSFER),
      ];

      repository.filter.mockResolvedValue(mockTransactions);

      const result = await service.getAllTransactions(filterDto);

      expect(repository.filter).toHaveBeenCalledWith({ accountId: 'ACC-12345' });
      expect(result).toHaveLength(1);
    });

    it('should filter transactions by type', async () => {
      const filterDto = { type: TransactionType.TRANSFER };
      const mockTransactions = [
        new Transaction('ACC-12345', 'ACC-67890', 100, 'USD', TransactionType.TRANSFER),
      ];

      repository.filter.mockResolvedValue(mockTransactions);

      const result = await service.getAllTransactions(filterDto);

      expect(repository.filter).toHaveBeenCalledWith({ type: TransactionType.TRANSFER });
      expect(result).toHaveLength(1);
    });

    it('should filter transactions by date range', async () => {
      const filterDto = {
        from: '2024-01-01',
        to: '2024-01-31',
      };
      const mockTransactions = [
        new Transaction('ACC-12345', 'ACC-67890', 100, 'USD', TransactionType.TRANSFER),
      ];

      repository.filter.mockResolvedValue(mockTransactions);

      const result = await service.getAllTransactions(filterDto);

      expect(repository.filter).toHaveBeenCalledWith({
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31'),
      });
      expect(result).toHaveLength(1);
    });

    it('should combine multiple filters', async () => {
      const filterDto = {
        accountId: 'ACC-12345',
        type: TransactionType.TRANSFER,
        from: '2024-01-01',
        to: '2024-01-31',
      };
      const mockTransactions = [
        new Transaction('ACC-12345', 'ACC-67890', 100, 'USD', TransactionType.TRANSFER),
      ];

      repository.filter.mockResolvedValue(mockTransactions);

      const result = await service.getAllTransactions(filterDto);

      expect(repository.filter).toHaveBeenCalledWith({
        accountId: 'ACC-12345',
        type: TransactionType.TRANSFER,
        from: new Date('2024-01-01'),
        to: new Date('2024-01-31'),
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('getTransactionById', () => {
    it('should return a transaction when found', async () => {
      const transactionId = 'test-id-123';
      const mockTransaction = new Transaction(
        'ACC-12345',
        'ACC-67890',
        100,
        'USD',
        TransactionType.TRANSFER,
      );
      mockTransaction.id = transactionId;

      repository.findById.mockResolvedValue(mockTransaction);

      const result = await service.getTransactionById(transactionId);

      expect(repository.findById).toHaveBeenCalledWith(transactionId);
      expect(result.id).toBe(transactionId);
    });

    it('should throw ResourceNotFoundException when transaction not found', async () => {
      const transactionId = 'non-existent-id';

      repository.findById.mockResolvedValue(null);

      await expect(service.getTransactionById(transactionId)).rejects.toThrow(
        ResourceNotFoundException,
      );
      expect(repository.findById).toHaveBeenCalledWith(transactionId);
    });
  });
});
