import { Module } from '@nestjs/common';
import { AccountController } from './controllers/account.controller';
import { AccountService } from './services/account.service';
import { AccountRepository } from '../infra/repositories/account.repository';
import { IAccountRepository } from './repositories/account.repository.interface';
import { TransactionModule } from '../transaction/01-transaction.module';

@Module({
  imports: [TransactionModule],
  controllers: [AccountController],
  providers: [
    AccountService,
    {
      provide: 'IAccountRepository',
      useClass: AccountRepository,
    },
    AccountRepository,
  ],
  exports: [AccountService, 'IAccountRepository'],
})
export class AccountModule {}
