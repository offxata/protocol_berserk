import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AccountService } from './account.service';
import { IAccountRepository } from '../repositories/account.repository.interface';

describe('AccountService', () => {
  let service: AccountService;
  let repository: jest.Mocked<IAccountRepository>;

  const mockRepository = {
    getBalance: jest.fn(),
    getSummary: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: 'IAccountRepository',
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    repository = module.get('IAccountRepository');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBalance', () => {
    it('should return balance for valid account', async () => {
      const accountId = 'ACC-12345';
      const mockBalance = {
        accountId,
        balance: 1250.75,
        currency: 'USD',
      };

      repository.getBalance.mockResolvedValue(mockBalance);

      const result = await service.getBalance(accountId);

      expect(repository.getBalance).toHaveBeenCalledWith(accountId);
      expect(result).toEqual(mockBalance);
    });

    it('should throw BadRequestException for invalid account format', async () => {
      const invalidAccountId = 'INVALID-123';

      await expect(service.getBalance(invalidAccountId)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.getBalance).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for account without ACC- prefix', async () => {
      const invalidAccountId = '12345';

      await expect(service.getBalance(invalidAccountId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException for account with wrong suffix length', async () => {
      const invalidAccountId = 'ACC-1234'; // Only 4 characters

      await expect(service.getBalance(invalidAccountId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getSummary', () => {
    it('should return summary for valid account', async () => {
      const accountId = 'ACC-12345';
      const mockSummary = {
        accountId,
        totalDeposits: 5000.00,
        totalWithdrawals: 2500.00,
        transactionCount: 15,
        mostRecentDate: new Date('2024-01-20T14:20:00.000Z'),
      };

      repository.getSummary.mockResolvedValue(mockSummary);

      const result = await service.getSummary(accountId);

      expect(repository.getSummary).toHaveBeenCalledWith(accountId);
      expect(result.accountId).toBe(accountId);
      expect(result.totalDeposits).toBe(5000.00);
      expect(result.totalWithdrawals).toBe(2500.00);
      expect(result.transactionCount).toBe(15);
      expect(result.mostRecentDate).toBe('2024-01-20T14:20:00.000Z');
    });

    it('should return null for mostRecentDate when no transactions', async () => {
      const accountId = 'ACC-12345';
      const mockSummary = {
        accountId,
        totalDeposits: 0,
        totalWithdrawals: 0,
        transactionCount: 0,
        mostRecentDate: null,
      };

      repository.getSummary.mockResolvedValue(mockSummary);

      const result = await service.getSummary(accountId);

      expect(result.mostRecentDate).toBeNull();
    });

    it('should throw BadRequestException for invalid account format', async () => {
      const invalidAccountId = 'INVALID-123';

      await expect(service.getSummary(invalidAccountId)).rejects.toThrow(
        BadRequestException,
      );
      expect(repository.getSummary).not.toHaveBeenCalled();
    });
  });
});
