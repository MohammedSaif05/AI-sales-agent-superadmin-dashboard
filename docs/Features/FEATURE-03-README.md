# BringBack AI — Feature 03
## Communication Channels — WhatsApp
### Super Admin Dashboard Implementation Specification

**Application:** BringBack AI Super Admin Dashboard  
**Technology:** Next.js + TypeScript  
**Backend:** NestJS REST API  
**API Version:** `/api/v1`  
**Feature:** Feature 03 — Communication Channels  
**Phase:** Phase 1 — WhatsApp  
**Provider:** Meta WhatsApp Business Cloud API  
**Dashboard Role:** `SUPER_ADMIN`

---

# 1. Purpose

Feature 03 introduces WhatsApp communication infrastructure into BringBack AI.

The backend implementation for Feature 03 is already completed and verified.

The purpose of this Super Admin Dashboard implementation is to provide the platform administrator with visibility and operational controls over WhatsApp communication infrastructure across all businesses.

The Super Admin Dashboard must allow the platform administrator to:

1. View all business WhatsApp connections.
2. Inspect connection status and safe connection metadata.
3. Monitor staged WhatsApp webhook events.
4. Inspect webhook processing status.
5. Retry eligible failed/stuck webhook events.
6. Understand the health and operational state of the WhatsApp communication layer.
7. Navigate between WhatsApp connection and webhook monitoring views using the existing dashboard architecture.

The dashboard is an **administrative monitoring and operational interface**.

It is NOT responsible for implementing WhatsApp communication logic.

---

# 2. Important Architecture Rule

The Super Admin Dashboard is an independent frontend application.

It communicates with the backend only through the existing REST API.

```text
┌─────────────────────────────┐
│     Super Admin Dashboard   │
│       Next.js + TypeScript  │
└──────────────┬──────────────┘
               │
               │ HTTPS REST API
               │ Bearer JWT
               ▼
┌─────────────────────────────┐
│       BringBack Backend     │
│          NestJS              │
└──────────────┬──────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
 PostgreSQL           Redis/BullMQ
```

The frontend MUST NOT:

- connect directly to PostgreSQL
- connect directly to Redis
- access BullMQ
- access Cloudflare R2 directly for Feature 03
- communicate directly with Meta WhatsApp Cloud API
- implement webhook processing
- implement WhatsApp message state transitions
- implement provider identity correlation
- implement token encryption/decryption
- implement 24-hour window enforcement
- implement backend business rules

All of these responsibilities remain in the NestJS backend.

---

# 3. Existing Dashboard Architecture Must Be Reused

Before making any changes, inspect the existing Super Admin Dashboard repository.

The implementation MUST reuse the existing:

- authentication flow
- JWT handling
- API client
- route protection
- layout
- sidebar/navigation
- typography
- color system
- cards
- tables
- badges
- pagination
- loading states
- error handling
- toast/notification system
- modal/dialog components
- form components
- responsive behavior
- existing dashboard design language
- existing testing architecture

Do NOT create a second authentication system.

Do NOT create a second API client.

Do NOT introduce a completely different visual design.

Feature 03 should look like a native part of the existing Super Admin Dashboard.

---

# 4. Backend APIs Available to This Dashboard

The Feature 03 backend exposes the following Super Admin APIs.

## 4.1 List WhatsApp Connections

```http
GET /api/v1/admin/whatsapp/connections
```

Authentication:

```text
Bearer JWT
SUPER_ADMIN
```

Purpose:

Returns platform-wide WhatsApp connection information for businesses.

The dashboard should use this API for the main WhatsApp Connections page.

---

# 5. WhatsApp Connection Monitoring

Create a dedicated Super Admin section for:

```text
WhatsApp
```

Recommended navigation:

```text
Dashboard
Businesses
AI Analyst
WhatsApp
    ├── Connections
    └── Webhook Events
```

Reuse the existing sidebar/navigation architecture.

Do not create duplicate navigation systems.

---

# 6. WhatsApp Connections Page

Recommended route:

```text
/whatsapp/connections
```

The exact route may be adjusted to match the existing dashboard routing conventions.

The page should display all businesses that have WhatsApp connection records.

Conceptual layout:

```text
┌─────────────────────────────────────────────────────────────┐
│ WhatsApp Connections                                        │
│ Monitor WhatsApp Business connections across the platform  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Search / Filters                                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ Business │ Phone │ WABA │ Status │ Quality │ Last Sync     │
├─────────────────────────────────────────────────────────────┤
│ ABC      │ ...   │ ...  │ ● Connected │ ... │ ...           │
│ XYZ      │ ...   │ ...  │ ● Disconnected │ ... │ ...       │
└─────────────────────────────────────────────────────────────┘
```

The exact fields displayed must be based on the actual backend response and repository conventions.

Do NOT invent backend fields.

---

# 7. Connection Information

The dashboard should safely display useful operational metadata such as:

- Business identity
- WhatsApp connection status
- Display phone number
- WABA ID
- Phone Number ID
- Verified business name
- Quality rating
- Last synchronization timestamp
- Connection version
- Disconnect status information where exposed by the backend

The dashboard MUST NOT display:

- access tokens
- decrypted access tokens
- Meta App secrets
- encryption keys
- webhook secrets
- other credentials

The backend intentionally sanitizes credentials from API responses.

The frontend must preserve this security boundary.

---

# 8. Connection Status Visualization

Use the existing dashboard badge/status components where available.

Recommended semantic states:

```text
CONNECTED
    → Success / healthy status

DISCONNECTING
    → Warning / transitional status

DISCONNECTED
    → Neutral or error status
```

Do not hard-code a completely new badge system if the project already has reusable status badges.

Status labels should be human-readable while preserving the actual backend status.

Example:

```text
● Connected
● Disconnecting
● Disconnected
```

---

# 9. Connection Detail View

If the existing dashboard architecture supports detail pages/drawers, provide a WhatsApp connection detail view.

Recommended route:

```text
/whatsapp/connections/[id]
```

or the equivalent pattern already used by the dashboard.

The detail view should provide a clear operational summary.

Example:

```text
WhatsApp Connection
────────────────────────────────────

Business
ABC Fashion

Status
● Connected

Display Phone
+91 XXXXX XXXXX

Verified Name
ABC Fashion

WABA ID
...

Phone Number ID
...

Quality Rating
...

Connection Version
2

Last Sync
...

Created
...

Updated
...
```

Again, only show fields actually returned by the backend.

---

# 10. Webhook Events

Create a dedicated page:

```text
/whatsapp/webhook-events
```

Backend API:

```http
GET /api/v1/admin/whatsapp/webhook-events
```

Purpose:

Allow Super Admin to monitor webhook ingestion and processing.

The page should make it easy to identify:

- successfully processed events
- queued events
- received/stuck events
- failed events
- event timestamps
- associated provider phone number
- retry availability

---

# 11. Webhook Event Table

Recommended conceptual layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ WhatsApp Webhook Events                                      │
├──────────────────────────────────────────────────────────────┤
│ Filters                                                      │
│ Status | Phone Number ID | Date                              │
├──────────────────────────────────────────────────────────────┤
│ Event ID │ Phone ID │ Status │ Received │ Processed │ Action │
├──────────────────────────────────────────────────────────────┤
│ ...      │ ...      │ QUEUED │ ...      │ ...       │ ...    │
│ ...      │ ...      │ FAILED │ ...      │ ...       │ Retry  │
└──────────────────────────────────────────────────────────────┘
```

The exact table fields must be derived from the actual API response.

---

# 12. Webhook Statuses

The backend supports:

```text
RECEIVED
QUEUED
PROCESSED
FAILED
```

The dashboard should represent these clearly.

Recommended semantic presentation:

```text
RECEIVED
→ Awaiting queue processing / recovery

QUEUED
→ Successfully staged for processing

PROCESSED
→ Successfully processed

FAILED
→ Processing failed / requires attention
```

Do not change the backend status values.

---

# 13. Webhook Event Detail

Provide a detail view, drawer, or modal using the existing dashboard pattern.

It should allow Super Admin to understand the operational state of an event.

Potential information:

- Event ID
- Idempotency key, if safe and returned
- Provider phone number ID
- Status
- Received timestamp
- Provider event timestamp
- Processed timestamp
- Attempts
- Error message
- Relevant operational metadata

IMPORTANT:

The raw webhook payload may contain sensitive customer/business information.

Do not expose raw webhook payload by default.

If the backend does return raw payload, the frontend must follow existing privacy/security conventions and avoid unnecessarily rendering sensitive information.

Do not add a new endpoint merely to expose raw payload.

---

# 14. Retry Webhook Event

Backend API:

```http
POST /api/v1/admin/whatsapp/webhook-events/:id/retry
```

This is a Super Admin operational action.

The UI should provide a retry action only where appropriate according to the backend response/state.

Example:

```text
FAILED
   ↓
[Retry]
   ↓
Backend retry API
   ↓
QUEUED
```

The frontend MUST NOT implement its own retry logic.

It must call the backend endpoint.

---

# 15. Retry UX

When Super Admin clicks Retry:

1. Show confirmation if this matches existing dashboard conventions.
2. Disable the action while the request is processing.
3. Call the backend retry endpoint.
4. Show success feedback if successful.
5. Refresh the webhook event data.
6. Show backend error message if unsuccessful.
7. Never assume retry succeeded without a successful API response.

Example:

```text
Retry webhook event?

[Cancel] [Retry]
```

After success:

```text
Webhook event re-queued successfully.
```

---

# 16. No Direct WhatsApp Actions

The Super Admin Dashboard should NOT provide:

- Send WhatsApp message
- Reply to customer
- Connect a merchant's WhatsApp manually
- Disconnect a merchant's WhatsApp manually
- Edit Meta credentials
- Change WhatsApp provider settings
- Modify provider message IDs
- Modify message statuses
- Resolve ambiguous messages
- Change customer consent
- Change 24-hour window state

Those operations belong to the appropriate merchant application/backend workflows.

The Super Admin functionality in this phase is primarily:

```text
MONITOR
INSPECT
RETRY WEBHOOK EVENT
```

---

# 17. Security Requirements

Every Super Admin API request must use the existing authenticated API client.

Expected authorization:

```text
Bearer JWT
Role = SUPER_ADMIN
```

Do not implement role checks only in the frontend.

Backend authorization remains authoritative.

The frontend should still hide/disable unauthorized navigation/actions where appropriate.

---

# 18. Tenant and Platform Scope

Unlike merchant APIs, these endpoints are intentionally platform-wide.

The Super Admin should be able to see WhatsApp connection infrastructure across businesses.

Do NOT accidentally attach:

```text
businessId = current merchant
```

to Super Admin requests unless the backend contract explicitly requires it.

The dashboard should use the backend's platform-wide admin API.

---

# 19. API Client Architecture

Reuse the existing centralized API architecture.

Recommended structure if consistent with the existing project:

```text
src/
├── services/
│   └── whatsapp/
│       └── whatsappAdminService.ts
│
├── hooks/
│   └── whatsapp/
│       ├── useWhatsAppConnections.ts
│       └── useWhatsAppWebhookEvents.ts
│
├── types/
│   └── whatsapp/
│       └── whatsapp.types.ts
│
└── app/
    └── whatsapp/
        ├── connections/
        └── webhook-events/
```

IMPORTANT:

These are suggestions only.

First inspect the repository and follow the existing naming and folder conventions.

Do not create this exact structure if the project already has an established equivalent.

---

# 20. Type Safety

All Feature 03 API responses must have TypeScript types.

Do NOT use:

```typescript
any
```

for Feature 03 API data.

Create typed representations for:

- WhatsApp connection
- WhatsApp connection status
- webhook event
- webhook event status
- pagination metadata
- API errors
- retry response

Reuse existing shared API types where available.

---

# 21. Data Fetching

Reuse the project's existing data-fetching mechanism.

If the existing dashboard uses:

```text
TanStack Query
```

continue using it.

Do not introduce another data-fetching library.

The implementation should support:

- loading state
- success state
- empty state
- error state
- refetching
- mutation loading state
- cache invalidation/refetch after retry

---

# 22. Pagination

If the backend returns paginated webhook events, use server-side pagination.

Do NOT fetch the entire webhook event history and paginate locally.

Follow the existing pagination component and API conventions used by Feature 01/02.

---

# 23. Filtering

Where supported by the actual backend contract, provide useful filters such as:

### Webhook Events

```text
Status
Date range
Provider Phone Number ID
```

### Connections

Where supported:

```text
Status
Business/search
```

Do NOT implement filters that the backend does not support.

If a requested filter is not supported by the backend, do not fake client-side behavior unless it is explicitly safe and consistent with the existing dashboard architecture.

---

# 24. Search

If the backend API supports search, use server-side search.

The UI should provide a search field consistent with the existing dashboard.

Potential search target:

```text
Business
Phone Number
WABA ID
Phone Number ID
```

Only implement fields supported by the backend API.

---

# 25. Loading States

Every API-driven page must have a proper loading state.

Do not show an empty table while the API request is still loading.

Use the existing:

- skeleton
- spinner
- table loading
- page loading

components already present in the dashboard.

---

# 26. Empty States

Example:

```text
No WhatsApp connections found.

Businesses with WhatsApp enabled will appear here.
```

Webhook events:

```text
No webhook events found.

Incoming WhatsApp webhook activity will appear here.
```

Use the existing dashboard empty-state design.

---

# 27. Error States

If API requests fail:

```text
Unable to load WhatsApp connections.
[Try Again]
```

or the project's existing error pattern.

Do not expose:

- stack traces
- internal exceptions
- database errors
- access tokens
- Meta credentials
- internal infrastructure information

Use the backend's sanitized error response.

---

# 28. Responsive Design

The dashboard must work on:

- desktop
- laptop
- tablet
- smaller viewport sizes

Large tables should remain usable.

On smaller screens:

- use horizontal table scrolling where appropriate
- avoid destroying important data
- use drawers/details for dense information
- preserve action accessibility

Follow the existing dashboard responsive behavior.

---

# 29. Accessibility

The implementation must maintain the existing accessibility standards.

Requirements:

- keyboard-accessible actions
- visible focus states
- semantic buttons
- accessible dialogs
- meaningful labels
- status information not conveyed by color alone
- adequate contrast
- accessible table structure

Do not introduce inaccessible custom UI elements.

---

# 30. Performance

Avoid unnecessary polling.

Do not continuously refresh all WhatsApp data unless the existing dashboard architecture already has a justified polling mechanism.

Use:

- query caching
- targeted refetching
- pagination
- mutation invalidation

After webhook retry, refresh only the relevant webhook event/query data rather than unnecessarily refreshing unrelated dashboard sections.

---

# 31. Feature 03 Dashboard Navigation

Recommended navigation:

```text
WhatsApp
├── Connections
└── Webhook Events
```

The exact navigation location should follow the existing dashboard's structure.

Do not modify existing Feature 01/02 navigation unnecessarily.

---

# 32. Dashboard Overview / Summary

Do NOT invent a new WhatsApp analytics dashboard unless the backend already provides the necessary aggregate API.

If no dedicated summary API exists, the initial Feature 03 dashboard should focus on:

```text
Connections
Webhook Events
Operational status
```

Do not calculate misleading platform metrics by downloading large datasets merely to create cards.

---

# 33. Feature 01 / Feature 02 Protection

Feature 03 must not break existing functionality.

Existing modules must continue working:

```text
Feature 01
Business Management
Customer Management
Authentication
RBAC

Feature 02
AI Business Analyst
Reports
Questions
Jobs
```

Do not modify existing Feature 01/02 APIs.

Do not modify existing business logic unless absolutely required for integration and clearly documented.

---

# 34. Out of Scope

The following are explicitly OUT OF SCOPE for this dashboard implementation:

### WhatsApp Communication

- Sending WhatsApp messages
- Receiving WhatsApp messages directly
- Customer chat UI
- AI chatbot
- AI-generated replies
- Campaign management
- Marketing automation

### WhatsApp Features

- Image messages
- Audio messages
- Video messages
- PDF messages
- Media management
- Template creation
- Template management
- Interactive buttons
- Interactive lists
- Catalog management

### Meta Management

- Meta Developer App configuration
- Meta Business Manager administration
- Token generation
- Token rotation UI
- Meta credential editing
- Meta webhook configuration UI

### Backend Operations

- Database access
- Redis access
- BullMQ management
- Provider API calls
- Webhook processing
- Message state management
- 24-hour window calculation
- Credential encryption
- Provider identity correlation

These remain backend responsibilities.

---

# 35. Testing Requirements

The coding agent must add/modify tests according to the existing dashboard testing architecture.

At minimum test:

### Connections

- Connections page renders
- API loading state
- API success state
- Empty state
- API error state
- status rendering
- sensitive token data is never rendered

### Webhook Events

- Webhook event list renders
- pagination works
- filters work where supported
- status badges render
- loading state
- empty state
- error state

### Retry

- retry action is available for appropriate events
- retry API is called with correct event ID
- loading state works
- successful retry refreshes data
- failed retry displays error
- duplicate clicks are prevented while request is pending

### Authorization

- unauthenticated users cannot access protected routes
- non-SUPER_ADMIN users cannot access Super Admin pages
- existing authentication behavior remains unchanged

### Regression

All existing dashboard tests must continue to pass.

---

# 36. API Contract Rule

The coding agent MUST NOT invent backend APIs.

Only the following Feature 03 Super Admin APIs are currently confirmed:

```text
GET
/api/v1/admin/whatsapp/connections

GET
/api/v1/admin/whatsapp/webhook-events

POST
/api/v1/admin/whatsapp/webhook-events/:id/retry
```

If the frontend requires information that these APIs do not provide:

1. Do not invent the response field.
2. Do not invent a new endpoint.
3. Do not modify backend code during this task.
4. Report the contract gap clearly in the implementation plan.

The backend Feature 03 implementation is already considered complete.

---

# 37. UI/UX Principle

The UI should feel like an operational enterprise SaaS dashboard.

Prioritize:

```text
Clarity
Consistency
Operational visibility
Fast scanning
Low cognitive load
Safe actions
Clear status
```

Avoid:

- decorative UI that adds no operational value
- excessive animations
- oversized cards
- unnecessary charts
- AI-generated-looking layouts
- duplicated information
- complicated navigation

Reuse the established BringBack AI dashboard design language.

---

# 38. Required Repository Inspection Before Implementation

Before writing code, inspect the existing repository thoroughly.

The coding agent must inspect:

```text
Authentication
API client
Route protection
Dashboard layout
Sidebar
Existing Feature 01 pages
Existing Feature 02 pages
Reusable tables
Reusable cards
Reusable badges
Pagination
Dialogs
Toast system
Loading states
Error handling
Type definitions
API services
Hooks
Testing setup
Environment configuration
```

The agent must understand how Feature 01 and Feature 02 were implemented before designing Feature 03.

---

# 39. Implementation Plan Requirement

IMPORTANT:

Do NOT start implementation immediately.

First inspect the repository and produce an implementation plan.

The plan must contain:

1. Current dashboard architecture discovered.
2. Existing components that will be reused.
3. Existing API client/service architecture.
4. Existing authentication/authorization architecture.
5. Exact files that will be created.
6. Exact files that will be modified.
7. Route structure.
8. Component structure.
9. API integration plan.
10. Type definitions.
11. State/data-fetching approach.
12. Loading/empty/error handling.
13. Retry workflow.
14. Security considerations.
15. Test plan.
16. Potential backend contract gaps.
17. Confirmation that Feature 01/02 remain untouched.
18. Any assumptions made.

Do not code until the plan is reviewed and approved.

---

# 40. Definition of Done

Feature 03 Super Admin Dashboard is complete only when:

### Architecture

- [ ] Existing dashboard architecture reused
- [ ] Existing authentication reused
- [ ] Existing API client reused
- [ ] Existing UI components reused where applicable
- [ ] No direct database/Redis/Meta access from frontend

### Connections

- [ ] WhatsApp Connections page implemented
- [ ] Backend API integrated
- [ ] Connection statuses displayed
- [ ] Connection detail view implemented if consistent with existing architecture
- [ ] Sensitive credentials never displayed

### Webhooks

- [ ] Webhook Events page implemented
- [ ] Backend API integrated
- [ ] Event statuses displayed
- [ ] Pagination implemented where supported
- [ ] Filtering implemented only where supported
- [ ] Event detail implemented using available API data

### Retry

- [ ] Retry action implemented
- [ ] Correct event ID sent
- [ ] Loading state implemented
- [ ] Success feedback implemented
- [ ] Error handling implemented
- [ ] Data refreshed after successful retry

### Security

- [ ] SUPER_ADMIN route protection preserved
- [ ] API authentication reused
- [ ] No credentials rendered
- [ ] No raw sensitive payload unnecessarily exposed
- [ ] No tenant isolation regression

### Quality

- [ ] TypeScript passes
- [ ] ESLint passes
- [ ] Production build passes
- [ ] Feature 03 dashboard tests pass
- [ ] Existing dashboard tests pass
- [ ] Feature 01 remains functional
- [ ] Feature 02 remains functional

---

# 41. Expected Final Report

After implementation and testing, create/update the Feature 03 Super Admin Dashboard implementation report using the existing project reporting convention.

The report must contain:

```text
1. Executive Summary
2. Existing Architecture Reused
3. Files Created
4. Files Modified
5. Routes Added
6. API Integrations
7. UI Components
8. Connection Monitoring
9. Webhook Monitoring
10. Retry Workflow
11. Security
12. Testing
13. Regression Testing
14. Build/Lint Results
15. Known Limitations
16. Contract Gaps
17. Deviations
18. Final Checklist
```

The report must distinguish clearly between:

```text
Implemented
Tested
Verified
Not Tested
```

Do not claim real Meta end-to-end verification from the dashboard implementation alone.

---

# 42. Final Scope

The Feature 03 Super Admin Dashboard should provide:

```text
                SUPER ADMIN
                     │
                     ▼
              WhatsApp Module
                     │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
     Connections          Webhook Events
          │                     │
          │                     ├── RECEIVED
          │                     ├── QUEUED
          │                     ├── PROCESSED
          │                     └── FAILED
          │
          ├── Connected
          ├── Disconnecting
          └── Disconnected
                                │
                                ▼
                             Retry
```

The dashboard is an **administrative visibility and operational-control layer** over the already implemented Feature 03 backend.

It must remain independent from Meta's API and must communicate exclusively through the approved NestJS REST APIs.

---

# 43. Final Instruction to Coding Agent

DO NOT IMPLEMENT YET.

First inspect the repository.

Then provide a detailed implementation plan based on the actual existing codebase.

The plan must follow this README exactly while adapting naming and structure to the existing project conventions.

Do not invent APIs, fields, components, routes, or backend functionality.

Do not modify Feature 01 or Feature 02 unnecessarily.

Do not begin coding until the implementation plan has been reviewed and explicitly approved.