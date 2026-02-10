import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { IAccountRepository } from '../repositories/account.repository.interface';
import { BalanceResponseDto } from '../dto/balance-response.dto';
import { SummaryResponseDto } from '../dto/summary-response.dto';
import { IsAccountFormat } from '../../common/pipes/account-format.validator';
import { IsAccountFormatConstraint } from '../../common/pipes/account-format.validator';

@Injectable()
export class AccountService {
  constructor(
    @Inject('IAccountRepository')
    private readonly accountRepository: IAccountRepository,
  ) {}

  async getBalance(accountId: string): Promise<BalanceResponseDto> {
    // Validate account format
    const validator = new IsAccountFormatConstraint();
    if (!validator.validate(accountId, {} as any)) {
      throw new BadRequestException(
        validator.defaultMessage({} as any),
      );
    }

    const balance = await this.accountRepository.getBalance(accountId);
    return {
      accountId: balance.accountId,
      balance: balance.balance,
      currency: balance.currency,
    };
  }

  async getSummary(accountId: string): Promise<SummaryResponseDto> {
    // Validate account format
    const validator = new IsAccountFormatConstraint();
    if (!validator.validate(accountId, {} as any)) {
      throw new BadRequestException(
        validator.defaultMessage({} as any),
      );
    }

    const summary = await this.accountRepository.getSummary(accountId);
    return {
      accountId: summary.accountId,
      totalDeposits: summary.totalDeposits,
      totalWithdrawals: summary.totalWithdrawals,
      transactionCount: summary.transactionCount,
      mostRecentDate: summary.mostRecentDate
        ? summary.mostRecentDate.toISOString()
        : null,
    };
  }
}
