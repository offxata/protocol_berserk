# 🏦 Banking Transactions API

> **Student Name**: Yaroslavtsev Kostiantyn  
> **Date Submitted**: 01/02/2026  
> **AI Tools Used**: Cursor

---

## 📋 Project Overview

A REST API for banking transactions built with NestJS and TypeScript, following **Clean Architecture** principles and **SOLID** design approaches. The API provides endpoints for creating transactions, querying transaction history, calculating account balances, and generating transaction summaries.

### Key Features

- ✅ Create, retrieve, and filter banking transactions
- ✅ Calculate account balances from transaction history
- ✅ Generate transaction summaries (deposits, withdrawals, counts)
- ✅ Comprehensive input validation (account format, currency, amount)
- ✅ Interactive API documentation with Swagger UI
- ✅ Clean Architecture with SOLID principles
- ✅ In-memory storage (easily migratable to database)

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev
```

The application will start on `http://localhost:3000`

### API Documentation

Access the interactive Swagger UI at:

**http://localhost:3000/api**

The Swagger UI allows you to:
- Browse all available endpoints
- View request/response schemas
- Test endpoints directly from the browser
- See example requests and responses

---

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/transactions` | Create a new transaction |
| `GET` | `/transactions` | List all transactions (with filtering) |
| `GET` | `/transactions/:id` | Get a specific transaction by ID |
| `GET` | `/accounts/:accountId/balance` | Get account balance |
| `GET` | `/accounts/:accountId/summary` | Get transaction summary |
| `GET` | `/health` | Health check endpoint |

For detailed API documentation, see:
- [API Endpoints Documentation](.doc/01-api-endpoints.md)
- [Swagger UI](http://localhost:3000/api) (when running)

---

## 🏗️ Architecture

This project follows **Clean Architecture** principles with strict layer separation:

- **Presentation Layer**: Controllers handling HTTP requests/responses
- **Application Layer**: Services containing business logic
- **Domain Layer**: Entities and repository interfaces
- **Infrastructure Layer**: Concrete implementations (repositories, storage)

### SOLID Principles

- **Single Responsibility**: Each class has one clear responsibility
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Implementations are substitutable
- **Interface Segregation**: Focused, minimal interfaces
- **Dependency Inversion**: Depend on abstractions, not concretions

For detailed architecture documentation, see:
- [Architecture Documentation](.doc/02-architecture.md)
- [Implementation Plan](.doc/README.md)

---

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run E2E tests
npm run test:e2e
```

---

## 📁 Project Structure

```
homework-1/
├── .doc/                    # Documentation
│   ├── README.md           # Implementation plan
│   ├── 01-api-endpoints.md # API documentation
│   ├── 02-architecture.md  # Architecture details
│   └── 03-database-schema.md # Data models
├── src/
│   ├── common/             # Shared utilities
│   ├── transaction/         # Transaction module
│   ├── account/             # Account module
│   ├── infra/               # Infrastructure layer
│   ├── health/              # Health check
│   └── main.ts              # Application entry
├── test/                    # E2E tests
├── package.json
└── README.md
```

---

## 📝 Validation Rules

- **Account Format**: `ACC-XXXXX` where X is alphanumeric
- **Amount**: Positive number with maximum 2 decimal places
- **Currency**: Valid ISO 4217 code (USD, EUR, GBP, etc.)
- **Transaction Type**: `deposit`, `withdrawal`, or `transfer`

---

## 🛠️ Development

```bash
# Development mode with hot reload
npm run start:dev

# Build for production
npm run build

# Start production server
npm run start:prod

# Lint code
npm run lint

# Format code
npm run format
```

---

## 📖 Documentation

- [Implementation Plan](.doc/README.md)
- [API Endpoints](.doc/01-api-endpoints.md)
- [Architecture](.doc/02-architecture.md)
- [Database Schema](.doc/03-database-schema.md)
- [Architecture Review](.doc/ARCHITECTURE_REVIEW.md)

---

## 🎯 Example Usage

### Create a Transaction

```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccount": "ACC-12345",
    "toAccount": "ACC-67890",
    "amount": 100.50,
    "currency": "USD",
    "type": "transfer"
  }'
```

### Get Account Balance

```bash
curl http://localhost:3000/accounts/ACC-12345/balance
```

### Test with Swagger UI

1. Start the application: `npm run start:dev`
2. Open browser: `http://localhost:3000/api`
3. Click "Try it out" on any endpoint
4. Fill in the request parameters
5. Click "Execute" to test

---

<div align="center">

*This project was completed as part of the AI-Assisted Development course.*

</div>
