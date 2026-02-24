# Architecture Documentation

This document describes the architecture decisions, SOLID principles implementation, and design patterns used in the Banking Transactions API.

## Clean Architecture Overview

The application follows **Clean Architecture** principles with strict separation of concerns across four main layers:

1. **Presentation Layer** - Controllers handling HTTP requests/responses
2. **Application Layer** - Services containing business logic
3. **Domain Layer** - Entities and repository interfaces
4. **Infrastructure Layer** - Concrete implementations (repositories, storage)

## Architecture Layers

```mermaid
graph TB
    subgraph Presentation["Presentation Layer"]
        Controllers["Controllers<br/>TransactionController<br/>AccountController"]
        DTOs["DTOs<br/>Request/Response DTOs"]
    end
    
    subgraph Application["Application Layer"]
        Services["Services<br/>TransactionService<br/>AccountService"]
        BusinessLogic["Business Logic<br/>Validation<br/>Calculations"]
    end
    
    subgraph Domain["Domain Layer"]
        Entities["Entities<br/>Transaction<br/>Account"]
        RepoInterfaces["Repository Interfaces<br/>ITransactionRepository<br/>IAccountRepository"]
        DomainRules["Domain Rules<br/>Business Rules"]
    end
    
    subgraph Infrastructure["Infrastructure Layer"]
        RepoImpl["Repository Implementations<br/>TransactionRepository<br/>AccountRepository"]
        Storage["Storage<br/>InMemoryStorage"]
    end
    
    Controllers -->|"uses"| DTOs
    Controllers -->|"depends on"| Services
    Services -->|"depends on"| RepoInterfaces
    Services -->|"uses"| Entities
    Services -->|"contains"| BusinessLogic
    Entities -->|"contains"| DomainRules
    RepoImpl -->|"implements"| RepoInterfaces
    RepoImpl -->|"uses"| Storage
    Storage -->|"stores"| Entities
```

## SOLID Principles Implementation

### Single Responsibility Principle (SRP)

Each class has a single, well-defined responsibility:

#### Controllers
- **Responsibility**: Handle HTTP requests and responses only
- **Location**: `src/transaction/controllers/`, `src/account/controllers/`
- **Example**: `TransactionController` only handles HTTP routing, validation, and response formatting

```typescript
// TransactionController - Only HTTP concerns
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  
  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.transactionService.createTransaction(dto);
  }
}
```

#### Services
- **Responsibility**: Contain business logic for specific domain
- **Location**: `src/transaction/services/`, `src/account/services/`
- **Example**: `TransactionService` handles transaction business logic only

```typescript
// TransactionService - Only business logic
@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
  ) {}
  
  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    // Business logic here
  }
}
```

#### Repositories
- **Responsibility**: Handle data access operations only
- **Location**: `src/infra/repositories/`
- **Example**: `TransactionRepository` handles CRUD operations only

```typescript
// TransactionRepository - Only data access
@Injectable()
export class TransactionRepository implements ITransactionRepository {
  async create(transaction: Transaction): Promise<Transaction> {
    // Data access logic here
  }
}
```

### Open/Closed Principle (OCP)

The system is open for extension but closed for modification:

#### Repository Pattern
- Repository interfaces allow extension without modification
- New repository implementations can be added without changing service layer

```mermaid
graph TB
    Interface[ITransactionRepository<br/>Interface]
    Impl1[InMemoryRepository<br/>implements]
    Impl2[PostgreSQLRepository<br/>can extend]
    Impl3[MongoDBRepository<br/>can extend]
    
    Interface -->|"defines contract"| Impl1
    Interface -.->|"extendable"| Impl2
    Interface -.->|"extendable"| Impl3
    
    Service[TransactionService] -->|"depends on"| Interface
```

**Example:**
```typescript
// Interface - Closed for modification
export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
}

// Implementation - Open for extension
@Injectable()
export class InMemoryTransactionRepository implements ITransactionRepository {
  // Implementation
}

// New implementation - Can be added without modifying service
@Injectable()
export class PostgreSQLTransactionRepository implements ITransactionRepository {
  // New implementation
}
```

### Liskov Substitution Principle (LSP)

Any repository implementation can replace the interface without breaking functionality:

```mermaid
sequenceDiagram
    participant Service as TransactionService
    participant Interface as ITransactionRepository
    participant Impl1 as InMemoryRepository
    participant Impl2 as PostgreSQLRepository
    
    Service -->|"depends on"| Interface
    Interface <|--|"implements"| Impl1
    Interface <|--|"implements"| Impl2
    
    Note over Service,Impl1: Can swap implementations<br/>without breaking Service
    Note over Service,Impl2: Service works with<br/>any implementation
```

**Example:**
```typescript
// Service works with any implementation
@Injectable()
export class TransactionService {
  constructor(
    // Can inject InMemoryRepository or PostgreSQLRepository
    private readonly repository: ITransactionRepository,
  ) {}
}
```

### Interface Segregation Principle (ISP)

Interfaces are focused and clients only depend on what they need:

```mermaid
graph TB
    ITransactionRepo[ITransactionRepository<br/>Transaction methods only]
    IAccountRepo[IAccountRepository<br/>Account methods only]
    
    TransactionService[TransactionService] -->|"uses only"| ITransactionRepo
    AccountService[AccountService] -->|"uses only"| IAccountRepo
    
    Note1["No fat interfaces<br/>No unused methods"]
```

**Example:**
```typescript
// Segregated interfaces - No fat interfaces
export interface ITransactionRepository {
  create(transaction: Transaction): Promise<Transaction>;
  findAll(): Promise<Transaction[]>;
  findById(id: string): Promise<Transaction | null>;
}

export interface IAccountRepository {
  getBalance(accountId: string): Promise<Balance>;
  getSummary(accountId: string): Promise<Summary>;
}

// Services only depend on what they need
@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepo: ITransactionRepository, // Only transaction methods
  ) {}
}

@Injectable()
export class AccountService {
  constructor(
    private readonly accountRepo: IAccountRepository, // Only account methods
  ) {}
}
```

### Dependency Inversion Principle (DIP)

High-level modules depend on abstractions, not concrete implementations:

```mermaid
graph TB
    HighLevel[TransactionService<br/>High-level module]
    Abstraction[ITransactionRepository<br/>Abstraction Interface]
    LowLevel1[InMemoryRepository<br/>Low-level module]
    LowLevel2[PostgreSQLRepository<br/>Low-level module]
    
    HighLevel -->|"depends on"| Abstraction
    LowLevel1 -->|"implements"| Abstraction
    LowLevel2 -->|"implements"| Abstraction
    
    Note1["Dependencies point inward<br/>toward abstractions"]
```

**Implementation:**
```typescript
// High-level module depends on abstraction
@Injectable()
export class TransactionService {
  constructor(
    // Depends on interface, not concrete class
    private readonly repository: ITransactionRepository,
  ) {}
}

// Low-level module implements abstraction
@Injectable()
export class InMemoryTransactionRepository implements ITransactionRepository {
  // Implementation
}

// Dependency injection in module
@Module({
  providers: [
    TransactionService,
    {
      provide: 'ITransactionRepository',
      useClass: InMemoryTransactionRepository, // Can swap implementation here
    },
  ],
})
export class TransactionModule {}
```

## Request Flow Architecture

### Complete Request Flow

```mermaid
sequenceDiagram
    participant Client
    participant Controller as TransactionController
    participant DTO as CreateTransactionDto
    participant Service as TransactionService
    participant Entity as Transaction Entity
    participant Repo as ITransactionRepository
    participant Storage as InMemoryStorage
    
    Client->>Controller: POST /transactions<br/>{fromAccount, toAccount, amount, currency, type}
    Controller->>DTO: Validate request body
    alt Validation Failed
        DTO-->>Controller: ValidationError
        Controller-->>Client: HTTP 400 Bad Request
    else Validation Passed
        Controller->>Service: createTransaction(dto)
        Service->>Service: Apply business rules<br/>- Validate account format<br/>- Validate amount > 0<br/>- Set timestamp<br/>- Set status
        Service->>Entity: Create Transaction entity
        Service->>Repo: create(transaction)
        Repo->>Storage: save(transaction)
        Storage-->>Repo: Transaction Entity
        Repo-->>Service: Transaction Entity
        Service->>Service: Map to ResponseDTO
        Service-->>Controller: TransactionResponseDTO
        Controller-->>Client: HTTP 201 Created
    end
```

## Module Dependencies

```mermaid
graph TB
    AppModule["00-app.module.ts<br/>Root Module"]
    TransactionModule["01-transaction.module.ts<br/>Transaction Module"]
    AccountModule["02-account.module.ts<br/>Account Module"]
    HealthModule["03-health.module.ts<br/>Health Module"]
    CommonModule["Common Module<br/>Shared Utilities"]
    
    AppModule -->|"imports"| TransactionModule
    AppModule -->|"imports"| AccountModule
    AppModule -->|"imports"| HealthModule
    TransactionModule -->|"uses"| CommonModule
    AccountModule -->|"uses"| CommonModule
    AccountModule -->|"depends on"| TransactionModule
    
    Note1["Dependencies flow inward<br/>toward domain layer"]
```

## Data Flow Architecture

### Account Balance Calculation Flow

```mermaid
flowchart TD
    Start([GET /accounts/:id/balance]) --> Controller[AccountController]
    Controller --> Service[AccountService.getBalance]
    Service --> Repo[AccountRepository.getBalance]
    Repo --> TransactionRepo[TransactionRepository.findAll]
    TransactionRepo --> Storage[InMemoryStorage.getAll]
    Storage --> Filter[Filter by accountId<br/>fromAccount OR toAccount]
    Filter --> Calc[Calculate Balance:<br/>deposits - withdrawals<br/>+ transfers received<br/>- transfers sent]
    Calc --> Response[BalanceResponseDTO]
    Response --> End([HTTP 200 OK])
```

## Dependency Injection

NestJS IoC container manages dependencies:

```mermaid
graph LR
    Module[Module Definition]
    Provider[Provider Registration]
    Container[IoC Container]
    Service[Service Instance]
    
    Module -->|"declares"| Provider
    Provider -->|"registers"| Container
    Container -->|"injects"| Service
    
    Note1["Automatic dependency resolution<br/>Type-safe injection"]
```

**Example:**
```typescript
@Module({
  providers: [
    TransactionService,
    {
      provide: 'ITransactionRepository',
      useClass: InMemoryTransactionRepository,
    },
  ],
})
export class TransactionModule {}
```

## Error Handling Architecture

```mermaid
graph TB
    Request[HTTP Request] --> Controller[Controller]
    Controller --> Service[Service]
    Service --> Repo[Repository]
    
    Repo -->|"throws"| NotFoundException
    Service -->|"throws"| ValidationException
    Controller -->|"throws"| BadRequestException
    
    ExceptionFilter[Exception Filter] -->|"catches"| AllExceptions
    ExceptionFilter -->|"formats"| ErrorResponse[Formatted Error Response]
    ErrorResponse --> Client[HTTP Response]
```

## Testing Architecture

```mermaid
graph TB
    E2ETests[E2E Tests<br/>Full Stack]
    IntegrationTests[Integration Tests<br/>Controller + Service + Repository]
    UnitTests[Unit Tests<br/>Service Only]
    
    E2ETests --> Controller
    IntegrationTests --> Service
    UnitTests --> Service
    
    MockRepo[Mock Repository] --> UnitTests
    MockService[Mock Service] --> IntegrationTests
```

## Future Enhancements

### PostgreSQL Migration Path

The architecture supports easy migration to PostgreSQL:

```mermaid
graph LR
    Current[Current: InMemoryStorage]
    Future[Future: PostgreSQL]
    
    Interface[ITransactionRepository<br/>Interface]
    
    Current -->|"implements"| Interface
    Future -->|"implements"| Interface
    
    Service[TransactionService] -->|"depends on"| Interface
    
    Note1["Only infrastructure layer changes<br/>Service layer unchanged"]
```

**Migration Steps:**
1. Create PostgreSQL repository implementation
2. Update module provider configuration
3. Add TypeORM entities (matching current entities)
4. Update docker-compose.yml for PostgreSQL connection
5. No changes needed in service or controller layers

## Key Design Decisions

1. **In-Memory Storage First**: Start simple, migrate to database later
2. **Repository Pattern**: Abstract data access for easy swapping
3. **DTO Pattern**: Separate request/response models from entities
4. **Exception Filters**: Centralized error handling
5. **Module Organization**: Feature-based modules with numbered prefixes
6. **Validation**: Custom validators for domain-specific rules

## Benefits of This Architecture

- **Testability**: Each layer can be tested independently
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features without breaking existing code
- **Flexibility**: Can swap implementations (storage, validation) easily
- **SOLID Compliance**: All five principles are followed throughout
