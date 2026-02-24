import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { TransactionFilterDto } from '../dto/transaction-filter.dto';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: 201,
    description: 'Transaction created successfully',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed',
    schema: {
      example: {
        error: 'Validation failed',
        details: [
          {
            field: 'amount',
            message: 'Amount must be a positive number',
          },
        ],
      },
    },
  })
  async create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<TransactionResponseDto> {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions with optional filtering' })
  @ApiQuery({ name: 'accountId', required: false, description: 'Filter by account ID' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ['deposit', 'withdrawal', 'transfer'],
    description: 'Filter by transaction type',
  })
  @ApiQuery({ name: 'from', required: false, description: 'Start date (ISO 8601)' })
  @ApiQuery({ name: 'to', required: false, description: 'End date (ISO 8601)' })
  @ApiResponse({
    status: 200,
    description: 'List of transactions',
    type: [TransactionResponseDto],
  })
  async findAll(
    @Query() filterDto: TransactionFilterDto,
  ): Promise<TransactionResponseDto[]> {
    return this.transactionService.getAllTransactions(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a transaction by ID' })
  @ApiParam({ name: 'id', description: 'Transaction UUID' })
  @ApiResponse({
    status: 200,
    description: 'Transaction found',
    type: TransactionResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Transaction not found',
    schema: {
      example: {
        error: 'Transaction not found',
        message: 'Transaction with ID 550e8400-e29b-41d4-a716-446655440000 does not exist',
      },
    },
  })
  async findOne(@Param('id') id: string): Promise<TransactionResponseDto> {
    return this.transactionService.getTransactionById(id);
  }
}
