import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsAccountFormat } from '../../common/pipes/account-format.validator';
import { IsValidCurrency } from '../../common/pipes/currency.validator';
import { IsValidAmount } from '../../common/pipes/amount.validator';
import { TransactionType } from '../entities/transaction.entity';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Source account identifier',
    example: 'ACC-12345',
    pattern: '^ACC-[A-Za-z0-9]{5}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsAccountFormat()
  fromAccount: string;

  @ApiProperty({
    description: 'Destination account identifier',
    example: 'ACC-67890',
    pattern: '^ACC-[A-Za-z0-9]{5}$',
  })
  @IsNotEmpty()
  @IsString()
  @IsAccountFormat()
  toAccount: string;

  @ApiProperty({
    description: 'Transaction amount (positive number, max 2 decimal places)',
    example: 100.50,
    minimum: 0.01,
  })
  @IsNotEmpty()
  @IsNumber()
  @IsValidAmount()
  amount: number;

  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'],
  })
  @IsNotEmpty()
  @IsString()
  @IsValidCurrency()
  currency: string;

  @ApiProperty({
    description: 'Transaction type',
    enum: TransactionType,
    example: TransactionType.TRANSFER,
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;
}
