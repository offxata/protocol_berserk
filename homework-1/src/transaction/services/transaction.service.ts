import { Injectable, Inject } from '@nestjs/common';
import { ITransactionRepository } from '../repositories/transaction.repository.interface';
import { Transaction, TransactionType } from '../entities/transaction.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionFilterDto } from '../dto/transaction-filter.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';
import { ResourceNotFoundException } from '../../common/exceptions/not-found.exception';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
  ) {}

  async createTransaction(
    dto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    // Normalize currency to uppercase
    const normalizedCurrency = dto.currency.toUpperCase();

    const transaction = Transaction.create(
      dto.fromAccount,
      dto.toAccount,
      dto.amount,
      normalizedCurrency,
      dto.type,
    );

    const savedTransaction = await this.transactionRepository.create(
      transaction,
    );

    return TransactionResponseDto.fromEntity(savedTransaction);
  }

  async getAllTransactions(
    filterDto?: TransactionFilterDto,
  ): Promise<TransactionResponseDto[]> {
    let transactions: Transaction[];

    if (filterDto && Object.keys(filterDto).length > 0) {
      const criteria: any = {};
      if (filterDto.accountId) {
        criteria.accountId = filterDto.accountId;
      }
      if (filterDto.type) {
        criteria.type = filterDto.type;
      }
      if (filterDto.from) {
        criteria.from = new Date(filterDto.from);
      }
      if (filterDto.to) {
        criteria.to = new Date(filterDto.to);
      }
      transactions = await this.transactionRepository.filter(criteria);
    } else {
      transactions = await this.transactionRepository.findAll();
    }

    return transactions.map((transaction) =>
      TransactionResponseDto.fromEntity(transaction),
    );
  }

  async getTransactionById(id: string): Promise<TransactionResponseDto> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new ResourceNotFoundException('Transaction', id);
    }

    return TransactionResponseDto.fromEntity(transaction);
  }
}
