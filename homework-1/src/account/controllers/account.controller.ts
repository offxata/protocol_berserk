import { Controller, Get, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { AccountService } from '../services/account.service';
import { BalanceResponseDto } from '../dto/balance-response.dto';
import { SummaryResponseDto } from '../dto/summary-response.dto';

@ApiTags('accounts')
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get(':accountId/balance')
  @ApiOperation({ summary: 'Get account balance' })
  @ApiParam({
    name: 'accountId',
    description: 'Account ID (format: ACC-XXXXX)',
    example: 'ACC-12345',
  })
  @ApiResponse({
    status: 200,
    description: 'Account balance retrieved successfully',
    type: BalanceResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid account format',
    schema: {
      example: {
        error: 'Account must follow format ACC-XXXXX (where X is alphanumeric)',
      },
    },
  })
  async getBalance(
    @Param('accountId') accountId: string,
  ): Promise<BalanceResponseDto> {
    return this.accountService.getBalance(accountId);
  }

  @Get(':accountId/summary')
  @ApiOperation({ summary: 'Get account transaction summary' })
  @ApiParam({
    name: 'accountId',
    description: 'Account ID (format: ACC-XXXXX)',
    example: 'ACC-12345',
  })
  @ApiResponse({
    status: 200,
    description: 'Account summary retrieved successfully',
    type: SummaryResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid account format',
    schema: {
      example: {
        error: 'Account must follow format ACC-XXXXX (where X is alphanumeric)',
      },
    },
  })
  async getSummary(
    @Param('accountId') accountId: string,
  ): Promise<SummaryResponseDto> {
    return this.accountService.getSummary(accountId);
  }
}
