import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TransactionModule } from './transaction/01-transaction.module';
import { AccountModule } from './account/02-account.module';
import { HealthModule } from './health/03-health.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [TransactionModule, AccountModule, HealthModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
