import { ApiProperty } from '@nestjs/swagger';

export class BalanceResponseDto {
  @ApiProperty({ description: 'Account identifier', example: 'ACC-12345' })
  accountId: string;

  @ApiProperty({ description: 'Current account balance', example: 1250.75 })
  balance: number;

  @ApiProperty({ description: 'Currency code', example: 'USD' })
  currency: string;
}
