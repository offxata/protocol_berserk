import { ApiProperty } from '@nestjs/swagger';
import { Transaction, TransactionType, TransactionStatus } from '../entities/transaction.entity';

export class TransactionResponseDto {
  @ApiProperty({ description: 'Transaction UUID', example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ description: 'Source account', example: 'ACC-12345' })
  fromAccount: string;

  @ApiProperty({ description: 'Destination account', example: 'ACC-67890' })
  toAccount: string;

  @ApiProperty({ description: 'Transaction amount', example: 100.50 })
  amount: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Transaction type', enum: TransactionType, example: TransactionType.TRANSFER })
  type: TransactionType;

  @ApiProperty({ description: 'Transaction timestamp (ISO 8601)', example: '2024-01-15T10:30:00.000Z' })
  timestamp: string;

  @ApiProperty({ description: 'Transaction status', enum: TransactionStatus, example: TransactionStatus.COMPLETED })
  status: TransactionStatus;

  static fromEntity(transaction: Transaction): TransactionResponseDto {
    const dto = new TransactionResponseDto();
    dto.id = transaction.id;
    dto.fromAccount = transaction.fromAccount;
    dto.toAccount = transaction.toAccount;
    dto.amount = transaction.amount;
    dto.currency = transaction.currency;
    dto.type = transaction.type;
    dto.timestamp = transaction.timestamp.toISOString();
    dto.status = transaction.status;
    return dto;
  }
}
