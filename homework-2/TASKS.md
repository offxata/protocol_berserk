# 🎧 Homework 2: Intelligent Customer Support System

## 📋 Overview

Build a customer support ticket management system that imports tickets from multiple file formats, automatically categorizes issues, and assigns priorities. Focus on applying the **Context-Model-Prompt framework** while generating comprehensive tests and documentation using AI tools.

---

## 🎯 Learning Objectives

- ✅ Master the **Context-Model-Prompt framework** in practice
- ✅ Select appropriate AI models for different tasks
- ✅ Generate comprehensive test suites with AI (>85% coverage)
- ✅ Create multi-level documentation for different audiences
- ✅ Compare AI tools and document your decision-making process

---

## 🛠️ Requirements

**Tools:** Use at least 2 AI coding tools (Claude Code, GitHub Copilot, Cursor, Aider)

**Tech Stack:** Choose one - Node.js/Express, Python/Flask/FastAPI, or Java/Spring Boot

---

## 📝 Tasks

### Task 1: Multi-Format Ticket Import API *(20 points)*

Create a REST API for support tickets with these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/tickets` | Create a new support ticket |
| `POST` | `/tickets/import` | Bulk import from CSV/JSON/XML |
| `GET` | `/tickets` | List all tickets (with filtering) |
| `GET` | `/tickets/:id` | Get specific ticket |
| `PUT` | `/tickets/:id` | Update ticket |
| `DELETE` | `/tickets/:id` | Delete ticket |

**Ticket Model:**
```json
{
  "id": "UUID",
  "customer_id": "string",
  "customer_email": "email",
  "customer_name": "string",
  "subject": "string (1-200 chars)",
  "description": "string (10-2000 chars)",
  "category": "account_access | technical_issue | billing_question | feature_request | bug_report | other",
  "priority": "urgent | high | medium | low",
  "status": "new | in_progress | waiting_customer | resolved | closed",
  "created_at": "datetime",
  "updated_at": "datetime",
  "resolved_at": "datetime (nullable)",
  "assigned_to": "string (nullable)",
  "tags": ["array"],
  "metadata": {
    "source": "web_form | email | api | chat | phone",
    "browser": "string",
    "device_type": "desktop | mobile | tablet"
  }
}
```

**Requirements:**
- Parse CSV, JSON, and XML file formats
- Validate all required fields (email format, string lengths, enums)
- Return bulk import summary: total records, successful, failed with error details
- Handle malformed files gracefully with meaningful error messages
- Use appropriate HTTP status codes (201, 400, 404, etc.)

**Context-Model-Prompt Application:**
Document which AI model you used for each format and why:
- Small model (GPT-4o-mini/Haiku) for simple CSV parsing
- Reasoning model (Claude Sonnet/o3-mini) for complex XML with namespaces

---

### Task 2: Auto-Classification *(15 points)*

Implement automatic ticket categorization and priority assignment.

**Categories:**
- `account_access` - login, password, 2FA issues
- `technical_issue` - bugs, errors, crashes
- `billing_question` - payments, invoices, refunds
- `feature_request` - enhancements, suggestions
- `bug_report` - defects with reproduction steps
- `other` - uncategorizable

**Priority Rules:**
- **Urgent**: "can't access", "critical", "production down", "security"
- **High**: "important", "blocking", "asap"
- **Medium**: default
- **Low**: "minor", "cosmetic", "suggestion"

**Endpoint:**
```
POST /tickets/:id/auto-classify
```

**Response includes:** category, priority, confidence score (0-1), reasoning, keywords found

**Requirements:**
- Auto-run on ticket creation (optional flag)
- Store classification confidence
- Allow manual override
- Log all decisions

---

### Task 3: AI-Generated Test Suite *(25 points)*

Generate comprehensive tests achieving **>85% code coverage**.

**Required Test Files:**

```
tests/
├── test_ticket_api.py          # API endpoints (11 tests)
├── test_ticket_model.py        # Data validation (9 tests)
├── test_import_csv.py          # CSV parsing (6 tests)
├── test_import_json.py         # JSON parsing (5 tests)
├── test_import_xml.py          # XML parsing (5 tests)
├── test_categorization.py      # Classification (10 tests)
├── test_integration.py         # End-to-end workflows (5 tests)
├── test_performance.py         # Benchmarks (5 tests)
└── fixtures/                   # Sample data files
```

**Test Coverage Requirements:**
- Overall: >85%
- Critical paths (create, import): >95%
- Edge cases and error handling: >80%

**Must Test:**
- Valid and invalid inputs for all endpoints
- All three file format imports (including malformed files)
- Classification accuracy for each category
- Priority assignment for keyword combinations
- Full ticket lifecycle (create → classify → update → resolve)
- Bulk import with auto-classification
- Concurrent ticket creation (20+ tickets)
- Performance: 1000 ticket import in <5 seconds
- Performance: Classification in <200ms

**AI Requirements:**
- Use at least 2 different AI tools for test generation
- Document which tool worked better and why
- Include your prompting strategy in AI_WORKFLOW_JOURNAL.md

---

### Task 4: Multi-Level Documentation *(20 points)*

Generate 5 documentation files for different audiences:

**1. README.md** (Developers)
- Project overview and features
- Architecture diagram (Mermaid)
- Installation and setup instructions
- How to run tests
- Project structure

**2. API_REFERENCE.md** (API Consumers)
- All endpoints with request/response examples
- Data models and schemas
- Error response formats
- cURL examples for each endpoint

**3. ARCHITECTURE.md** (Technical Leads)
- High-level architecture diagram (Mermaid)
- Component descriptions
- Data flow diagrams (Mermaid sequence diagrams)
- Design decisions and trade-offs
- Security and performance considerations

**4. TESTING_GUIDE.md** (QA Engineers)
- Test pyramid diagram (Mermaid)
- How to run tests
- Sample test data locations
- Manual testing checklist
- Performance benchmarks table

**5. AI_WORKFLOW_JOURNAL.md** (Learning Documentation)
- Context-Model-Prompt examples for 3+ major tasks
- Prompt iterations showing refinement
- Model comparison table (small vs reasoning models)
- Tools comparison (Claude Code vs Copilot, etc.)
- Reusable prompt library (5-10 templates)
- Lessons learned
- Time tracking comparison (manual vs AI-assisted)

**Requirements:**
- Use different AI models for different doc types
- Include at least 3 Mermaid diagrams across documents
- Document which model generated each doc and why

---

### Task 5: Integration & Performance Tests *(10 points)*

Implement end-to-end tests.

**Integration Tests:**
- Complete ticket lifecycle workflow
- Bulk import with auto-classification verification
- Concurrent operations (20+ simultaneous requests)
- Combined filtering by category and priority

---

## 📦 Deliverables

### 1️⃣ Source Code

### 2️⃣ Test Coverage Report
- Coverage report showing >85%
- Screenshot in `docs/screenshots/test_coverage.png`

### 3️⃣ Sample Data
- `sample_tickets.csv` (50 tickets)
- `sample_tickets.json` (20 tickets)
- `sample_tickets.xml` (30 tickets)
- Invalid data files for negative tests

---

## 📊 Grading Rubric

| Criteria | Points |
|----------|--------|
| **Task 1:** Multi-Format Import | 20 |
| **Task 2:** Auto-Classification | 15 |
| **Task 3:** Test Suite (>85% coverage) | 25 |
| **Task 4:** Documentation (5 files) | 20 |
| **Task 5:** Integration & Performance | 10 |
| **AI Workflow Journal** | 10 |
| **Code Quality** | 5 |
| **Total** | **100** |


<div align="center">

**Good luck! 🍀**

</div>
