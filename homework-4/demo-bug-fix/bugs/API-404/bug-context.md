# Bug Context: API-404 — Route Path Mismatch

## Bug Summary

**Bug ID:** API-404
**Severity:** High
**Status:** Fixed
**Reported:** 2026-02-24

A `404 Not Found` error was returned for all requests targeting the resource retrieval endpoint. The API was unreachable despite the server running correctly.

---

## Environment

| Field | Value |
|-------|-------|
| Runtime | Node.js / Express (or equivalent) |
| API Version | v1 |
| Affected Endpoint | `GET /api/v1/resource/:id` |
| HTTP Status Returned | `404 Not Found` |

---

## Steps to Reproduce

1. Start the API server.
2. Send a `GET` request to `/api/v1/resource/123`.
3. Observe a `404 Not Found` response even though the resource with ID `123` exists.

```bash
curl -X GET http://localhost:3000/api/v1/resource/123
# Response: 404 Not Found
```

---

## Root Cause Analysis

The route was registered with a **plural path** (`/resources/:id`) while the client was calling the **singular path** (`/resource/:id`), causing a mismatch.

**Registered route (incorrect):**
```js
router.get('/api/v1/resources/:id', getResourceById);
```

**Client request (expected):**
```
GET /api/v1/resource/:id
```

The server never matched the incoming request, so Express fell through to its default 404 handler.

---

## Fix Applied

Updated the route registration to match the client's expected path:

```js
// Before (incorrect)
router.get('/api/v1/resources/:id', getResourceById);

// After (correct)
router.get('/api/v1/resource/:id', getResourceById);
```

---

## Verification Checklist

- [x] Route path corrected from `/resources/:id` to `/resource/:id`
- [x] `GET /api/v1/resource/123` now returns `200 OK` with the expected resource
- [x] Existing tests updated to reflect the correct route
- [x] No other routes affected by the change
- [x] API documentation updated to reflect the correct endpoint path
