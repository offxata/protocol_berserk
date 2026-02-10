import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/00-app.module';
import { TransactionType } from '../src/transaction/entities/transaction.entity';

describe('AccountController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /accounts/:accountId/balance', () => {
    beforeEach(async () => {
      // Create test transactions for ACC-12345
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-99999',
          toAccount: 'ACC-12345',
          amount: 1000,
          currency: 'USD',
          type: TransactionType.DEPOSIT,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-88888',
          amount: 200,
          currency: 'USD',
          type: TransactionType.WITHDRAWAL,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-11111',
          toAccount: 'ACC-12345',
          amount: 300,
          currency: 'USD',
          type: TransactionType.TRANSFER,
        });
    });

    it('should return account balance', () => {
      return request(app.getHttpServer())
        .get('/accounts/ACC-12345/balance')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accountId', 'ACC-12345');
          expect(res.body).toHaveProperty('balance');
          expect(res.body).toHaveProperty('currency', 'USD');
          expect(res.body.balance).toBe(1100); // 1000 deposit - 200 withdrawal + 300 transfer received
        });
    });

    it('should return zero balance for account with no transactions', () => {
      return request(app.getHttpServer())
        .get('/accounts/ACC-NEW01/balance')
        .expect(200)
        .expect((res) => {
          expect(res.body.balance).toBe(0);
        });
    });

    it('should return 400 for invalid account format', () => {
      return request(app.getHttpServer())
        .get('/accounts/INVALID-123/balance')
        .expect(400);
    });

    it('should return 400 for account without ACC- prefix', () => {
      return request(app.getHttpServer())
        .get('/accounts/12345/balance')
        .expect(400);
    });

    it('should return 400 for account with wrong suffix length', () => {
      return request(app.getHttpServer())
        .get('/accounts/ACC-1234/balance')
        .expect(400);
    });

    it('should calculate balance correctly for multiple transactions', async () => {
      // Create multiple transactions
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-99999',
          toAccount: 'ACC-67890',
          amount: 1000,
          currency: 'USD',
          type: TransactionType.DEPOSIT,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-88888',
          toAccount: 'ACC-67890',
          amount: 500,
          currency: 'USD',
          type: TransactionType.DEPOSIT,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-67890',
          toAccount: 'ACC-77777',
          amount: 200,
          currency: 'USD',
          type: TransactionType.WITHDRAWAL,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-11111',
          toAccount: 'ACC-67890',
          amount: 300,
          currency: 'USD',
          type: TransactionType.TRANSFER,
        });

      return request(app.getHttpServer())
        .get('/accounts/ACC-67890/balance')
        .expect(200)
        .expect((res) => {
          expect(res.body.balance).toBe(1600); // 1000 + 500 - 200 + 300
        });
    });
  });

  describe('GET /accounts/:accountId/summary', () => {
    beforeEach(async () => {
      // Create test transactions for ACC-12345
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-99999',
          toAccount: 'ACC-12345',
          amount: 1000,
          currency: 'USD',
          type: TransactionType.DEPOSIT,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-88888',
          toAccount: 'ACC-12345',
          amount: 500,
          currency: 'USD',
          type: TransactionType.DEPOSIT,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-77777',
          amount: 200,
          currency: 'USD',
          type: TransactionType.WITHDRAWAL,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-66666',
          amount: 100,
          currency: 'USD',
          type: TransactionType.WITHDRAWAL,
        });
    });

    it('should return account summary', () => {
      return request(app.getHttpServer())
        .get('/accounts/ACC-12345/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('accountId', 'ACC-12345');
          expect(res.body).toHaveProperty('totalDeposits', 1500); // 1000 + 500
          expect(res.body).toHaveProperty('totalWithdrawals', 300); // 200 + 100
          expect(res.body).toHaveProperty('transactionCount');
          expect(res.body).toHaveProperty('mostRecentDate');
          expect(res.body.transactionCount).toBeGreaterThanOrEqual(4);
        });
    });

    it('should return zero summary for account with no transactions', () => {
      return request(app.getHttpServer())
        .get('/accounts/ACC-NEW01/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body.totalDeposits).toBe(0);
          expect(res.body.totalWithdrawals).toBe(0);
          expect(res.body.transactionCount).toBe(0);
          expect(res.body.mostRecentDate).toBeNull();
        });
    });

    it('should return 400 for invalid account format', () => {
      return request(app.getHttpServer())
        .get('/accounts/INVALID-123/summary')
        .expect(400);
    });

    it('should calculate summary correctly for multiple transactions', async () => {
      // Create transactions for a new account
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-99999',
          toAccount: 'ACC-NEW01',
          amount: 1000,
          currency: 'USD',
          type: TransactionType.DEPOSIT,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-88888',
          toAccount: 'ACC-NEW01',
          amount: 500,
          currency: 'USD',
          type: TransactionType.DEPOSIT,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-NEW01',
          toAccount: 'ACC-77777',
          amount: 200,
          currency: 'USD',
          type: TransactionType.WITHDRAWAL,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-NEW01',
          toAccount: 'ACC-66666',
          amount: 100,
          currency: 'USD',
          type: TransactionType.WITHDRAWAL,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-11111',
          toAccount: 'ACC-NEW01',
          amount: 300,
          currency: 'USD',
          type: TransactionType.TRANSFER,
        });

      return request(app.getHttpServer())
        .get('/accounts/ACC-NEW01/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body.totalDeposits).toBe(1500); // 1000 + 500
          expect(res.body.totalWithdrawals).toBe(300); // 200 + 100
          expect(res.body.transactionCount).toBe(5);
          expect(res.body.mostRecentDate).toBeTruthy();
        });
    });

    it('should return summary for another account', async () => {
      // Create transactions for ACC-67890
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-99999',
          toAccount: 'ACC-67890',
          amount: 750,
          currency: 'EUR',
          type: TransactionType.DEPOSIT,
        });

      return request(app.getHttpServer())
        .get('/accounts/ACC-67890/summary')
        .expect(200)
        .expect((res) => {
          expect(res.body.accountId).toBe('ACC-67890');
          expect(res.body.transactionCount).toBeGreaterThanOrEqual(1);
        });
    });
  });
});
