Feature 01: Business Onboarding & Customer Management
Super Admin Dashboard Implementation Specification
Project: AI Sales Assistant
Application: Super Admin Dashboard
Technology: Next.js + TypeScript
Backend: NestJS REST API
API Version: /api/v1

1. Purpose
Feature 01 establishes the foundation of the Super Admin Dashboard.
The Super Admin Dashboard allows the platform administrator to monitor and inspect businesses using the backend's administrative APIs.
The dashboard is primarily for:

Platform monitoring
Business inspection
Customer inspection
Import monitoring
Operational troubleshooting
Basic platform statistics

The dashboard is not intended to function as the business owner's application.
The Super Admin should be able to see what is happening across the platform, while normal business owners remain isolated to their own businesses.

2. Critical Architecture Rule
Backend is the Source of Truth
The Super Admin Dashboard is a client of the backend.
Architecture:
Super Admin Dashboard
        |
        | HTTPS REST API
        |
        v
NestJS Backend
/api/v1
        |
        +---- PostgreSQL
        +---- Redis / BullMQ
        +---- Cloudflare R2
        +---- Gemini API

The dashboard communicates only with the backend API.
The dashboard must NEVER directly communicate with:

PostgreSQL
Redis
BullMQ
Cloudflare R2 using server credentials
Gemini API
OpenAI API

The backend owns:

Authentication
Authorization
Database access
Tenant isolation
Business rules
File storage
Import processing
AI processing
Security


3. Repository Independence
This repository is completely independent from:
backend/
mobile-app/

Do not assume that either repository exists locally.
Do not import backend code.
Do not create filesystem dependencies between repositories.
The API is the integration contract.
The backend API prefix is:
/api/v1


4. Super Admin Role
The backend defines:
SystemRole:
USER
SUPER_ADMIN

The dashboard is exclusively for:
SUPER_ADMIN

Regular business owners must not be able to access Super Admin APIs.
The backend enforces this using:
@Roles(SystemRole.SUPER_ADMIN)

The frontend must still protect the dashboard UI, but frontend protection is only for UX.
Backend authorization remains the security boundary.
Never rely on:
hidden menu
hidden button
frontend route guard

as actual security.

5. Authentication
The backend provides:
POST /api/v1/auth/login

The Super Admin authenticates using:
{
  "phone": "SUPER_ADMIN_PHONE",
  "password": "SUPER_ADMIN_PASSWORD"
}

The backend returns:
user
business
tokens
session

The dashboard must securely handle:
accessToken
refreshToken
session


6. Authentication Token Architecture
Use a centralized API client.
Recommended conceptual flow:
Login Page
    ↓
Auth API
    ↓
Central API Client
    ↓
Backend
    ↓
Tokens
    ↓
Secure Auth State

For authenticated requests:
Authorization: Bearer <accessToken>

When the access token expires:
API Request
     ↓
401
     ↓
Refresh token
     ↓
POST /api/v1/auth/refresh
     ↓
New access token
     ↓
Retry original request

If refresh fails:
Clear authentication state
        ↓
Redirect to login

Do not create infinite refresh loops.
Never log:

Access tokens
Refresh tokens
Passwords


7. Backend Authentication Endpoints
Available authentication endpoints:
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/sessions
DELETE /api/v1/auth/sessions/:id

For Feature 01 Super Admin Dashboard:
Required
POST /auth/login
POST /auth/refresh
POST /auth/logout

Optional
GET /auth/sessions
DELETE /auth/sessions/:id

Registration is NOT part of the Super Admin Dashboard.
Super Admin accounts are seeded/configured by the backend.

8. Super Admin API Contract
The canonical administrative API base is:
/api/v1/admin

All endpoints require:
Authorization: Bearer <accessToken>

and:
SystemRole.SUPER_ADMIN


9. Dashboard Statistics
Endpoint:
GET /api/v1/admin/dashboard

Purpose:
Provide platform-level overview statistics.
Expected information includes metrics such as:
Total Businesses
Total Customers
Total Imports
Active Storage

The frontend should not calculate these metrics by downloading all businesses/customers.
The backend is responsible for aggregation.

10. Business Directory
Endpoint:
GET /api/v1/admin/businesses

Purpose:
Display all registered businesses on the platform.
Expected information includes:
Business
Owner phone
Customer count
Created date

The dashboard should provide:

Search where supported by backend
Pagination
Sorting where supported
Loading state
Empty state
Error state

Do not assume unsupported query parameters.
Use the actual Swagger contract exposed by the backend.

11. Business Details
Endpoint:
GET /api/v1/admin/businesses/:id

Purpose:
Inspect an individual business.
Display appropriate information such as:
Business
Business Name
Business Phone
Address
City
State
Country
Pincode
Email
Website
Instagram
Facebook
Description
Created Date

Business Owner / Membership
Display information returned by the backend.
Operating Hours
Display:
Sunday
Monday
Tuesday
Wednesday
Thursday
Friday
Saturday

Do not expose sensitive backend information unnecessarily.

12. Business Customer Inspection
Endpoint:
GET /api/v1/admin/businesses/:id/customers

Purpose:
Allow the Super Admin to inspect customers belonging to a specific business.
The dashboard should provide:

Customer table
Search if supported
Pagination
Customer details available from API
Gender
City
Source
Communication preference information where returned
Created date
Active/deleted status where appropriate

The Super Admin is intentionally allowed to inspect data across businesses.
This is different from normal business-user access.

13. Global Import Monitoring
Endpoint:
GET /api/v1/admin/imports

Purpose:
Display import activity across the entire platform.
Useful information includes:
Import ID
Business
Import Type
Status
Total Rows
Valid Rows
Invalid Rows
Duplicate Rows
Created At
Completed At

Import types:
CSV
EXCEL
IMAGE

Import states:
PENDING
PARSING
PREVIEW_READY
PROCESSING
COMPLETED
FAILED


14. Import Details
Endpoint:
GET /api/v1/admin/imports/:id

Purpose:
Inspect an individual import.
Display:
Import ID
Business
Import Type
Status
Total Rows
Valid Rows
Invalid Rows
Duplicate Rows
Error Summary
Created At
Completed At

This screen is intended primarily for troubleshooting.

15. Admin Dashboard Navigation
Recommended structure:
Super Admin
│
├── Dashboard
│
├── Businesses
│   ├── Business List
│   └── Business Details
│       └── Customers
│
└── Imports
    ├── Import List
    └── Import Details

Keep Feature 01 navigation simple.
Do not create future sections yet.

16. Dashboard Screen
The main dashboard should provide a high-level platform overview.
Recommended cards:
┌─────────────────┐
│ Total Businesses│
│       125       │
└─────────────────┘

┌─────────────────┐
│ Total Customers │
│     48,250      │
└─────────────────┘

┌─────────────────┐
│ Total Imports   │
│      832        │
└─────────────────┘

┌─────────────────┐
│ Active Storage  │
│    12.4 GB      │
└─────────────────┘

Values must come from:
GET /api/v1/admin/dashboard

Do not calculate platform totals on the frontend.

17. Businesses Screen
Recommended table:
Business Name
Owner Phone
Customer Count
Created Date
Actions

Actions:
View

Do not create arbitrary business-editing capabilities unless explicitly provided by the backend API.
Feature 01 is primarily an inspection/monitoring dashboard.

18. Business Details Screen
Recommended sections:
Business Profile
Name
Phone
Address
City
State
Country
Pincode
Email
Website
Social Links
Description

Operating Hours
Weekly schedule.
Customer Summary
Customer count where provided.
Actions
Navigation to:
View Customers

Do not create unsupported backend mutations.

19. Customer Inspection Screen
Recommended table columns:
Name
Phone
Gender
City
Source
Marketing Preferences
Created Date

Depending on API response, display additional useful fields.
Provide:

Pagination
Loading state
Empty state
Error state
Retry
Search only if supported by the backend API

Do not load all customers into the browser.

20. Import Monitoring Screen
Recommended table:
Import ID
Business
Type
Status
Total Rows
Valid
Invalid
Duplicates
Created
Completed

Status should be visually distinguishable.
Example:
PENDING
PARSING
PREVIEW_READY
PROCESSING
COMPLETED
FAILED


21. Import Details Screen
Display:
Import Information
-------------------
Import ID
Business
Type
Status

Statistics
----------
Total
Valid
Invalid
Duplicates

Timeline
--------
Created
Completed

Errors
------
Error Summary

If the backend provides additional diagnostic information, display it appropriately.

22. API Client Architecture
Do NOT make HTTP requests directly from individual UI components.
Bad:
fetch(...)

inside every page.
Preferred:
Page
 ↓
Hook / Query Layer
 ↓
API Service
 ↓
Central API Client
 ↓
Backend

Recommended conceptual structure:
src/
├── api/
│   ├── client/
│   │   ├── apiClient.ts
│   │   ├── authInterceptor.ts
│   │   └── apiError.ts
│   │
│   ├── services/
│   │   ├── authApi.ts
│   │   └── adminApi.ts
│   │
│   └── types/
│       ├── auth.types.ts
│       └── admin.types.ts

Adapt this structure to the existing repository.
Do not duplicate API logic.

23. API Response Envelope
Backend success response:
{
  "success": true,
  "data": {},
  "meta": {}
}

meta is optional.
Backend error response:
{
  "success": false,
  "statusCode": 403,
  "errorCode": "FORBIDDEN",
  "message": "Forbidden",
  "details": null,
  "timestamp": "...",
  "path": "/api/v1/admin/dashboard"
}

The API client must handle this consistently.

24. Error Handling
Important backend errors:
UNAUTHORIZED
FORBIDDEN
BUSINESS_NOT_FOUND
IMPORT_NOT_FOUND
VALIDATION_ERROR
TOO_MANY_REQUESTS
INTERNAL_SERVER_ERROR

The dashboard should translate these into appropriate UI states.
Example:
403
→ You do not have permission to access this resource.

404
→ The requested business could not be found.

500
→ Something went wrong. Please try again.

Do not expose backend stack traces or internal errors.

25. Route Protection
The dashboard must protect all authenticated pages.
Conceptually:
/admin/login

is public.
Everything else requires authentication.
Example:
/admin/dashboard
/admin/businesses
/admin/businesses/:id
/admin/businesses/:id/customers
/admin/imports
/admin/imports/:id

If the user is not authenticated:
→ redirect to /admin/login

If authenticated but not a Super Admin:
→ deny access
→ clear session if appropriate
→ show unauthorized state

However, remember:
Frontend route protection is not security.
Backend RBAC remains authoritative.

26. Super Admin Login UX
Login page should contain:
Mobile Number
Password
Login

States:
Idle
Loading
Success
Invalid Credentials
Network Error
Unauthorized
Server Error

Do not provide a registration screen.
Do not display the seeded password anywhere.

27. Environment Configuration
The backend API URL must be configurable.
Example:
NEXT_PUBLIC_API_BASE_URL

Development:
http://<development-host>:3000/api/v1

Production:
https://api.example.com/api/v1

Do not hardcode URLs throughout the application.
Never put these backend secrets in Next.js environment variables exposed to the browser:
DATABASE_URL
JWT secrets
R2 credentials
Gemini API key
Redis password
SUPER_ADMIN_PASSWORD

Only public client configuration should use NEXT_PUBLIC_*.

28. Data Fetching
Use a consistent data-fetching approach.
If the existing repository already uses a data-fetching library, reuse it.
Otherwise choose an appropriate approach for:

caching
loading states
retries
request cancellation
stale data
pagination

Do not introduce multiple competing data-fetching systems.

29. Tables & Pagination
Business lists, customer lists, and import lists may grow significantly.
Do not fetch every record.
Use backend pagination.
For example:
page
limit

Only use additional query parameters if they are actually documented by the backend.
UI should support:
Previous
Next
Page indicator
Loading
Empty
Error


30. Dashboard Refresh
Platform statistics and operational data may change.
Provide reasonable refresh behavior.
For example:
Refresh

on:

Dashboard
Businesses
Imports

Do not create aggressive polling unless the backend contract specifically requires it.

31. Import Status Handling
Imports may transition asynchronously:
PENDING
   ↓
PARSING
   ↓
PREVIEW_READY
   ↓
PROCESSING
   ↓
COMPLETED

or:
PARSING → FAILED
PROCESSING → FAILED

The dashboard should display the current state returned by the backend.
Do not attempt to determine import status locally.

32. Loading States
Every API-driven page must have an intentional loading state.
Examples:
Skeleton table
Loading cards
Loading detail sections

Avoid blank screens.

33. Empty States
Examples:
Businesses:
No businesses registered yet.

Customers:
No customers found.

Imports:
No imports found.

Empty states must be different from loading states.

34. Error States
Every API page must support:
Initial request failure
Network failure
401
403
404
429
500

Provide:
Error message
Retry action

where appropriate.

35. Responsive Design
The dashboard is primarily a desktop web application.
Optimize for:
Desktop
Laptop
Tablet

It should remain usable on smaller screens, but do not design it as a mobile-first application.
Use responsive tables/cards appropriately.

36. UI Architecture
Use reusable components.
Conceptual structure:
components/
├── layout/
├── navigation/
├── dashboard/
├── businesses/
├── customers/
├── imports/
├── tables/
├── cards/
├── feedback/
└── ui/

Do not duplicate table, loading, error, modal, or pagination implementations across pages.
Reuse existing UI components in the repository where possible.

37. Suggested Admin Layout
┌──────────────────────────────────────────────────────┐
│ AI Sales Assistant             Super Admin ▼        │
├──────────────┬───────────────────────────────────────┤
│              │                                       │
│ Dashboard    │                                       │
│              │             Page Content              │
│ Businesses   │                                       │
│              │                                       │
│ Imports      │                                       │
│              │                                       │
│              │                                       │
└──────────────┴───────────────────────────────────────┘

Keep navigation focused on platform administration.

38. Security Requirements
The dashboard must:

Never store passwords.
Never log passwords.
Never log access tokens.
Never log refresh tokens.
Never contain Gemini API keys.
Never contain R2 secret credentials.
Never contain database credentials.
Never connect directly to PostgreSQL.
Never connect directly to Redis.
Never connect directly to R2 using server credentials.
Use HTTPS in production.
Protect authenticated routes.
Handle 401/403 correctly.
Avoid exposing unnecessary customer information in logs.


39. Super Admin Data Access
The Super Admin intentionally has cross-tenant inspection capability.
For example:
GET /api/v1/admin/businesses/:id/customers

may inspect customers belonging to any business.
This is intentional.
However, the frontend must NOT:

construct arbitrary SQL
query PostgreSQL
bypass API authorization
access R2 directly
call Gemini directly

All privileged access happens through the backend's /admin APIs.

40. No Business Owner Features
Do not duplicate the entire Business Owner mobile application inside the dashboard.
Do NOT build:
Customer creation
Customer editing
Campaign creation
Voice calling
WhatsApp messaging
AI analyst
Business owner onboarding

unless the backend explicitly adds an administrative endpoint for that operation in a future feature.
Feature 01 Super Admin is primarily:
MONITOR
INSPECT
TROUBLESHOOT


41. Testing Requirements
Test the dashboard at multiple levels.
Authentication
Test:

Login success
Invalid credentials
Token persistence
Token refresh
Logout
Session expiration

Authorization
Test:

Unauthenticated user cannot access dashboard
Authenticated Super Admin can access admin pages
403 is handled correctly

Dashboard
Test:

Statistics load
API failure
Empty response
Retry

Businesses
Test:

Business list
Pagination
Business details
Business not found
API failure

Customers
Test:

Customer list
Pagination
Empty state
API failure

Imports
Test:

Import list
Import details
Status rendering
Failed import
Empty state


42. API Contract Verification
The backend is the source of truth.
Before implementation, verify the actual Swagger/OpenAPI contract exposed by:
/api/docs

The mobile/dashboard code must match:

Endpoint paths
HTTP methods
Request bodies
Query parameters
Response structures
Error structures
Authentication requirements
Enum values

If the backend implementation differs from this document, do not silently invent a frontend workaround.
Identify the discrepancy.

43. Development Rules
Before modifying the repository:

Inspect the existing project.
Understand the existing architecture.
Reuse existing dependencies and patterns.
Do not blindly rewrite existing code.
Do not create duplicate API clients.
Do not invent backend endpoints.
Do not invent backend fields.
Do not add Feature 02 functionality.
Keep TypeScript strict.
Keep secrets out of source control.
Keep UI components reusable.
Keep business logic out of presentation components.
Keep API communication centralized.


44. Definition of Done
Feature 01 Super Admin Dashboard is complete when:
Authentication

[ ] Super Admin login works
[ ] Access token is handled securely
[ ] Refresh token flow works
[ ] Logout works
[ ] Expired sessions redirect to login
[ ] Non-Super Admin users cannot access dashboard

Dashboard

[ ] Platform statistics load
[ ] Loading state exists
[ ] Empty state exists
[ ] Error state exists
[ ] Retry works

Businesses

[ ] Business list works
[ ] Pagination works
[ ] Business details work
[ ] Business profile information displays correctly
[ ] Operating hours display correctly
[ ] Customer navigation works

Customers

[ ] Business customer list works
[ ] Pagination works
[ ] Customer information displays correctly
[ ] Empty/error states work

Imports

[ ] Import list works
[ ] Import pagination works
[ ] Import status displays correctly
[ ] Import details work
[ ] Failed imports display correctly

Security

[ ] Protected routes
[ ] Secure token handling
[ ] No secrets exposed
[ ] No sensitive logging
[ ] Backend RBAC respected

Testing

[ ] Authentication tests
[ ] Route protection tests
[ ] API client tests
[ ] Dashboard tests
[ ] Business tests
[ ] Import tests
[ ] Error-state tests


45. Out of Scope
Do NOT implement:
AI Offer Campaign
Business Analyst Agent
Sales Analytics
WhatsApp AI
WhatsApp Campaign Automation
Voice Call Agent
Automated Calling
Revenue Recovery Automation
Campaign Segmentation
Sales Prediction
Inventory Management
Billing
Accounting
GST
Payroll

These belong to future features.

46. Final Architecture
                ┌──────────────────────────┐
                │   Super Admin Dashboard  │
                │       Next.js            │
                └────────────┬─────────────┘
                             │
                             │ HTTPS
                             ▼
                ┌──────────────────────────┐
                │      NestJS Backend      │
                │        /api/v1            │
                └────────────┬─────────────┘
                             │
             ┌───────────────┼────────────────┐
             ▼               ▼                ▼
        PostgreSQL         Redis             R2
                            │
                          BullMQ
                            │
                          Gemini

The dashboard only knows about the backend API.

47. Implementation Instruction
Before writing code:

Inspect the existing Super Admin repository.
Understand the current Next.js architecture.
Identify existing dependencies.
Identify existing routing.
Identify existing authentication infrastructure.
Identify existing API client/data-fetching architecture.
Identify existing UI component system.
Identify existing state management.
Identify existing table/pagination components.
Identify what can be reused.

Then prepare a production-grade Feature 01 implementation plan covering:

Repository assessment
Folder structure
Authentication architecture
Route protection
API client
API services
TypeScript types
Dashboard page
Business pages
Customer inspection
Import monitoring
Import details
Loading/error/empty states
Pagination
Security
Testing
Required dependencies
Backend API mapping

Do not write implementation code yet.
The backend Feature 01 API is already implemented and verified.
Do not modify or redesign the backend contract from the dashboard.
If something appears missing from the backend API, report it as a dependency/contract gap rather than inventing an endpoint.

48. Golden Rule
        SUPER ADMIN DASHBOARD
                 |
                 | HTTPS REST
                 ▼
          ┌──────────────┐
          │   BACKEND    │
          │   /api/v1    │
          └──────┬───────┘
                 |
        ┌────────┼─────────┐
        ▼        ▼         ▼
    PostgreSQL  Redis      R2
                           |
                         Gemini

The dashboard does not own the data.
The dashboard does not own business logic.
The dashboard does not access infrastructure directly.
The backend owns authorization.
The backend owns the database.
The backend owns AI and file processing.
The dashboard is the Super Admin's operational interface to the backend.
Keep Feature 01 focused, production-grade, secure, and independent from the mobile and backend repositories.
