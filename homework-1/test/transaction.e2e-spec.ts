import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/00-app.module';
import { TransactionType } from '../src/transaction/entities/transaction.entity';

describe('TransactionController (e2e)', () => {
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

  describe('POST /transactions', () => {
    it('should create a transaction successfully', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-67890',
          amount: 100.50,
          currency: 'USD',
          type: TransactionType.TRANSFER,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.fromAccount).toBe('ACC-12345');
          expect(res.body.toAccount).toBe('ACC-67890');
          expect(res.body.amount).toBe(100.50);
          expect(res.body.currency).toBe('USD');
          expect(res.body.type).toBe(TransactionType.TRANSFER);
          expect(res.body.status).toBe('completed');
          expect(res.body).toHaveProperty('timestamp');
        });
    });

    it('should return 400 for invalid account format', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'INVALID-123',
          toAccount: 'ACC-67890',
          amount: 100.50,
          currency: 'USD',
          type: TransactionType.TRANSFER,
        })
        .expect(400);
    });

    it('should return 400 for negative amount', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-67890',
          amount: -100,
          currency: 'USD',
          type: TransactionType.TRANSFER,
        })
        .expect(400);
    });

    it('should return 400 for invalid currency', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-67890',
          amount: 100.50,
          currency: 'INVALID',
          type: TransactionType.TRANSFER,
        })
        .expect(400);
    });

    it('should return 400 for amount with more than 2 decimal places', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-67890',
          amount: 100.555,
          currency: 'USD',
          type: TransactionType.TRANSFER,
        })
        .expect(400);
    });

    it('should return 400 for missing required fields', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          // Missing other fields
        })
        .expect(400);
    });

    it('should create a deposit transaction successfully', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-99999',
          toAccount: 'ACC-12345',
          amount: 500.00,
          currency: 'USD',
          type: TransactionType.DEPOSIT,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.type).toBe(TransactionType.DEPOSIT);
          expect(res.body.toAccount).toBe('ACC-12345');
        });
    });

    it('should create a withdrawal transaction successfully', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-88888',
          amount: 200.00,
          currency: 'USD',
          type: TransactionType.WITHDRAWAL,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.type).toBe(TransactionType.WITHDRAWAL);
          expect(res.body.fromAccount).toBe('ACC-12345');
        });
    });

    it('should create transaction with EUR currency', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-33333',
          toAccount: 'ACC-12345',
          amount: 750.00,
          currency: 'EUR',
          type: TransactionType.DEPOSIT,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.currency).toBe('EUR');
        });
    });

    it('should create transaction with case-insensitive currency', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-67890',
          amount: 100.50,
          currency: 'usd', // lowercase
          type: TransactionType.TRANSFER,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.currency).toBe('USD');
        });
    });

    it('should return 400 for zero amount', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-67890',
          amount: 0,
          currency: 'USD',
          type: TransactionType.TRANSFER,
        })
        .expect(400);
    });

    it('should return 400 for invalid transaction type', () => {
      return request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-67890',
          amount: 100.50,
          currency: 'USD',
          type: 'invalid-type',
        })
        .expect(400);
    });
  });

  describe('GET /transactions', () => {
    beforeEach(async () => {
      // Create some test transactions
      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-67890',
          amount: 100,
          currency: 'USD',
          type: TransactionType.TRANSFER,
        });

      await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-11111',
          toAccount: 'ACC-22222',
          amount: 50,
          currency: 'USD',
          type: TransactionType.DEPOSIT,
        });
    });

    it('should return all transactions', () => {
      return request(app.getHttpServer())
        .get('/transactions')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(2);
        });
    });

    it('should filter transactions by accountId', () => {
      return request(app.getHttpServer())
        .get('/transactions')
        .query({ accountId: 'ACC-12345' })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((transaction: any) => {
            expect(
              transaction.fromAccount === 'ACC-12345' ||
                transaction.toAccount === 'ACC-12345',
            ).toBe(true);
          });
        });
    });

    it('should filter transactions by type', () => {
      return request(app.getHttpServer())
        .get('/transactions')
        .query({ type: TransactionType.TRANSFER })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((transaction: any) => {
            expect(transaction.type).toBe(TransactionType.TRANSFER);
          });
        });
    });

    it('should filter transactions by date range', () => {
      return request(app.getHttpServer())
        .get('/transactions')
        .query({
          from: '2024-01-01',
          to: '2024-12-31',
        })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should combine multiple filters (accountId, type, date range)', () => {
      return request(app.getHttpServer())
        .get('/transactions')
        .query({
          accountId: 'ACC-12345',
          type: TransactionType.TRANSFER,
          from: '2024-01-01',
          to: '2024-12-31',
        })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((transaction: any) => {
            expect(
              transaction.fromAccount === 'ACC-12345' ||
                transaction.toAccount === 'ACC-12345',
            ).toBe(true);
            expect(transaction.type).toBe(TransactionType.TRANSFER);
          });
        });
    });

    it('should filter transactions by deposit type', () => {
      return request(app.getHttpServer())
        .get('/transactions')
        .query({ type: TransactionType.DEPOSIT })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((transaction: any) => {
            expect(transaction.type).toBe(TransactionType.DEPOSIT);
          });
        });
    });

    it('should filter transactions by withdrawal type', () => {
      return request(app.getHttpServer())
        .get('/transactions')
        .query({ type: TransactionType.WITHDRAWAL })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          res.body.forEach((transaction: any) => {
            expect(transaction.type).toBe(TransactionType.WITHDRAWAL);
          });
        });
    });

    it('should return empty array when no transactions match filter', () => {
      return request(app.getHttpServer())
        .get('/transactions')
        .query({ accountId: 'ACC-NOEXIST' })
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBe(0);
        });
    });
  });

  describe('GET /transactions/:id', () => {
    let transactionId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/transactions')
        .send({
          fromAccount: 'ACC-12345',
          toAccount: 'ACC-67890',
          amount: 100,
          currency: 'USD',
          type: TransactionType.TRANSFER,
        });
      transactionId = response.body.id;
    });

    it('should return a transaction by id', () => {
      return request(app.getHttpServer())
        .get(`/transactions/${transactionId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(transactionId);
          expect(res.body.fromAccount).toBe('ACC-12345');
        });
    });

    it('should return 404 for non-existent transaction', () => {
      return request(app.getHttpServer())
        .get('/transactions/non-existent-id')
        .expect(404);
    });
  });
});
