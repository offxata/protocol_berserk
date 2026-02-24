# Bug Context: API-404

## Bug ID
`API-404`

## Summary
API endpoint returns `404 Not Found` when it should return a valid response.

## Category
`technical_issue` — `bug_report`

## Severity
**High** — The affected endpoint is part of the core data-retrieval flow. Clients that depend on it receive errors instead of data, breaking downstream integrations.

---

## Environment

| Field | Value |
|-------|-------|
| Service | REST API |
| Affected Endpoint | `GET /api/v1/resource/:id` |
| HTTP Status (actual) | `404 Not Found` |
| HTTP Status (expected) | `200 OK` |
| Reported By | offxata |
| Date Reported | 2026-02-24 |

---

## Steps to Reproduce

1. Start the API server locally.
2. Send a GET request to an existing resource:
   ```
   GET /api/v1/resource/123
   ```
3. Observe that the server responds with `404 Not Found`.

**Expected behaviour:** The server should return `200 OK` with the resource payload.

**Actual behaviour:** The server returns `404 Not Found` with an empty or generic error body.

---

## Root Cause Analysis

The route handler was registered with an incorrect path pattern. The router mounted the resource routes under `/api/v1/resources` (plural) while the client requests `/api/v1/resource` (singular), causing every request to fall through to the 404 handler.

```js
// BEFORE (broken) — path mismatch
router.get('/api/v1/resources/:id', resourceController.getById);

// AFTER (fixed) — path aligned with client contract
router.get('/api/v1/resource/:id', resourceController.getById);
```

---

## Fix Applied

- Corrected the route path in `src/routes/resource.routes.js`.
- Added an integration test that asserts `GET /api/v1/resource/:id` returns `200` for an existing record.
- Updated API documentation to reflect the canonical path.

---

## Verification

- [ ] Unit tests pass locally (`npm test`)
- [ ] Integration test for the fixed endpoint added and passing
- [ ] Manual smoke test against the dev environment confirms `200 OK`
- [ ] No regressions in related endpoints

---

## References

- Related issue: #3
- HTTP 404 specification: [RFC 9110 §15.5.5](https://www.rfc-editor.org/rfc/rfc9110#section-15.5.5)
