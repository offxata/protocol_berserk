import { ApiProperty } from '@nestjs/swagger';

export class SummaryResponseDto {
  @ApiProperty({ description: 'Account identifier', example: 'ACC-12345' })
  accountId: string;

  @ApiProperty({ description: 'Total deposits amount', example: 5000.00 })
  totalDeposits: number;

  @ApiProperty({ description: 'Total withdrawals amount', example: 2500.00 })
  totalWithdrawals: number;

  @ApiProperty({ description: 'Total number of transactions', example: 15 })
  transactionCount: number;

  @ApiProperty({
    description: 'Most recent transaction date (ISO 8601)',
    example: '2024-01-20T14:20:00.000Z',
    nullable: true,
  })
  mostRecentDate: string | null;
}
