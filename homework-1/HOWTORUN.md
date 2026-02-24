# ▶️ How to Run the Application

## Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js (or use yarn)

## Step-by-Step Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- NestJS framework
- TypeScript
- Swagger/OpenAPI
- Validation libraries
- Testing frameworks

### 2. Start the Development Server

```bash
npm run start:dev
```

The application will:
- Compile TypeScript to JavaScript
- Start the NestJS server
- Enable hot-reload for development
- Display startup messages

You should see:
```
Application is running on: http://localhost:3000
Swagger documentation available at: http://localhost:3000/api
```

### 3. Access the Application

#### API Base URL
```
http://localhost:3000
```

#### Swagger UI (Interactive API Documentation)
```
http://localhost:3000/api
```

The Swagger UI provides:
- 📖 Complete API documentation
- 🧪 Interactive endpoint testing
- 📝 Request/response examples
- 🔍 Schema definitions
- ✅ Try-it-out functionality

### 4. Test the API

#### Option A: Using Swagger UI (Recommended)

1. Open `http://localhost:3000/api` in your browser
2. Navigate to any endpoint (e.g., `POST /transactions`)
3. Click "Try it out"
4. Fill in the request body/parameters
5. Click "Execute"
6. View the response

#### Option B: Using curl

```bash
# Health check
curl http://localhost:3000/health

# Create a transaction
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "fromAccount": "ACC-12345",
    "toAccount": "ACC-67890",
    "amount": 100.50,
    "currency": "USD",
    "type": "transfer"
  }'

# Get all transactions
curl http://localhost:3000/transactions

# Get account balance
curl http://localhost:3000/accounts/ACC-12345/balance

# Get account summary
curl http://localhost:3000/accounts/ACC-12345/summary
```

#### Option C: Using Postman

1. Import the API collection (if available)
2. Or manually create requests using the Swagger documentation
3. Base URL: `http://localhost:3000`

## Available Scripts

```bash
# Development
npm run start:dev      # Start with hot-reload
npm run start:debug    # Start with debug mode

# Production
npm run build          # Build the application
npm run start:prod     # Start production server

# Testing
npm test               # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run test:cov       # Run tests with coverage
npm run test:e2e       # Run E2E tests

# Code Quality
npm run lint           # Lint code
npm run format         # Format code with Prettier
```

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Option 1: Change port via environment variable
PORT=3001 npm run start:dev

# Option 2: Kill the process using port 3000
# On macOS/Linux:
lsof -ti:3000 | xargs kill

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Module Not Found Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Compilation Errors

```bash
# Clean build and rebuild
rm -rf dist
npm run build
```

## Verifying the Installation

1. **Check Node.js version:**
   ```bash
   node --version  # Should be v18 or higher
   ```

2. **Check npm version:**
   ```bash
   npm --version
   ```

3. **Verify installation:**
   ```bash
   npm list --depth=0
   ```

4. **Test health endpoint:**
   ```bash
   curl http://localhost:3000/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

5. **Access Swagger UI:**
   Open `http://localhost:3000/api` in your browser
   You should see the Swagger documentation interface

## Next Steps

1. ✅ Application is running
2. ✅ Swagger UI is accessible at `/api`
3. 📖 Read [API Documentation](.doc/01-api-endpoints.md)
4. 🏗️ Review [Architecture](.doc/02-architecture.md)
5. 🧪 Test endpoints using Swagger UI
6. 💻 Start developing!

---

**Happy Coding! 🚀**
