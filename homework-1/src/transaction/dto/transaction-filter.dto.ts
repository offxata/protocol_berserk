import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../entities/transaction.entity';

export class TransactionFilterDto {
  @ApiProperty({
    description: 'Filter by account ID (matches fromAccount or toAccount)',
    required: false,
    example: 'ACC-12345',
  })
  @IsOptional()
  @IsString()
  accountId?: string;

  @ApiProperty({
    description: 'Filter by transaction type',
    required: false,
    enum: TransactionType,
  })
  @IsOptional()
  @IsEnum(TransactionType)
  type?: TransactionType;

  @ApiProperty({
    description: 'Start date for date range filter (ISO 8601)',
    required: false,
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  from?: string;

  @ApiProperty({
    description: 'End date for date range filter (ISO 8601)',
    required: false,
    example: '2024-01-31',
  })
  @IsOptional()
  @IsDateString()
  to?: string;
}
