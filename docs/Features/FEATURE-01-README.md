FEATURE 01
Business Onboarding & Customer Management
Super Admin Dashboard Development Specification
Product: AI Sales Assistant for Clothing Retailers
Feature: Business Onboarding & Customer Management
Application: Super Admin Dashboard
Backend: Independent NestJS REST API
Database: PostgreSQL through backend only
Storage: Cloudflare R2 through backend only
Primary User: Platform Super Admin

1. IMPORTANT CONTEXT
This repository is an independent Super Admin Dashboard project.
This project does NOT have direct access to the backend source code, PostgreSQL database, Redis, Cloudflare R2 or mobile application source code.
The dashboard communicates with the backend through HTTP APIs.
The backend is the source of truth.
Do not attempt to directly connect the dashboard to PostgreSQL.

2. PRODUCT CONTEXT
The overall product is an AI-powered sales assistant for clothing retailers.
Business owners use a separate mobile application.
The platform backend provides APIs and business logic.
The Super Admin Dashboard is an internal platform-management application.
The Super Admin is responsible for managing and monitoring the businesses using the platform.

3. FEATURE 01 PURPOSE
Feature 01 establishes the administrative interface for:

Businesses
Business owners
Customers
Customer imports
Business status
Import troubleshooting

The dashboard is primarily an administrative/support tool.
It is NOT intended to become the business owner's CRM.

4. APPLICATION ECOSYSTEM
The complete platform contains:
Business Owner Mobile App
        |
        v
Backend API
        |
        +---- PostgreSQL
        +---- Redis
        +---- Cloudflare R2
        +---- AI APIs
        |
        ^
        |
Super Admin Dashboard

This project only implements the Super Admin interface.

5. SUPER ADMIN AUTHENTICATION
For the current MVP, Super Admin authentication may be temporarily hardcoded.
However, the UI architecture should represent the authenticated user as:
SUPER_ADMIN

The application must not mix Owner and Super Admin functionality.
Proper authentication can be introduced later.

6. FEATURE 01 NAVIGATION
The Feature 01 dashboard should establish navigation for:
Overview
Businesses
Customers
Imports

Future sections may include:
Campaigns
WhatsApp
Voice
AI Usage
Billing
System Health
Settings

Do not implement future functionality as part of Feature 01.

7. SUPER ADMIN OVERVIEW
The overview should provide high-level platform information.
Feature 01 statistics may include:
Total Businesses
Active Businesses
Total Owners
Total Customers
Recent Businesses
Recent Imports
Failed Imports

The frontend must obtain these through backend APIs.
Do not download large datasets and calculate platform statistics inside the browser.

8. BUSINESSES PAGE
The businesses page should provide:

Paginated list
Search
Status filter
Business details
Owner information

Potential columns:
Business Name
Owner
Business Phone
Customer Count
Status
Created Date

The UI should support:
Loading
Empty
Error
Success
Pagination


9. BUSINESS DETAILS
When the administrator opens a business, display:
Business Information
Business Name
Phone
Email
Address
City
State
Country
Pincode

Owner
Owner Name
Owner Mobile
Account Status

Business Hours
Display configured operating hours.
Customer Statistics
Total Customers
Active Customers

Import Statistics
Total Imports
Successful Imports
Failed Imports


10. CUSTOMER MANAGEMENT
The Super Admin should be able to inspect customer records.
Purpose:

Support
Debugging
Data inspection
Platform administration

Capabilities:

Search
Filter
Pagination
Customer details

Do not build advanced CRM functionality here.

11. CUSTOMER DETAILS
Potential information:
Customer Name
Mobile Number
Email
Gender
Date of Birth
Address
City
Source
Status
Created Date
Updated Date
Communication Preferences

Only display information required for legitimate administrative purposes.
Avoid unnecessary exposure of sensitive information.

12. CUSTOMER IMPORTS
Super Admin should be able to see import history.
Potential columns:
Import ID
Business
File Name
Import Type
Total Rows
Valid Rows
Invalid Rows
Duplicates
Status
Created At

Potential states:
UPLOADED
PROCESSING
READY_FOR_CONFIRMATION
CONFIRMED
COMPLETED
FAILED
CANCELLED

The exact states are determined by the backend API contract.

13. IMPORT DETAILS
The administrator should be able to inspect:
Business
File
Upload time
Uploaded by
Processing status
Total rows
Valid rows
Invalid rows
Duplicate rows
Errors
Completion time

This allows the Super Admin to troubleshoot problems.

14. BUSINESS STATUS
The platform should eventually support states such as:
ACTIVE
SUSPENDED
DISABLED

Feature 01 should display account status.
Any administrative action that modifies status should have an explicit confirmation step.

15. API COMMUNICATION
The dashboard communicates with the backend.
Conceptual:
Super Admin Dashboard
        |
        | HTTPS
        v
Backend API
        |
        v
PostgreSQL

The dashboard must NEVER:
Dashboard → PostgreSQL

The dashboard must NEVER contain:

Database credentials
AI API keys
Cloudflare private credentials
Redis credentials
Backend secrets


16. EXPECTED API GROUPS
Conceptual APIs:
GET /admin/dashboard

GET /admin/businesses
GET /admin/businesses/:id

GET /admin/businesses/:id/customers

GET /admin/customers
GET /admin/customers/:id

GET /admin/imports
GET /admin/imports/:id

These endpoints are conceptual.
The actual backend API contract is authoritative.
Do not invent endpoint names or response structures during implementation.

17. API CLIENT ARCHITECTURE
Create a centralized API client.
It should handle:

Base URL
Authentication
Request headers
Token handling when applicable
Timeouts
Common errors
Response parsing

UI components should not repeatedly implement raw HTTP calls.
Recommended conceptual architecture:
Pages
 ↓
Hooks / Services
 ↓
API Client
 ↓
Backend


18. SEARCH
Search should use backend APIs.
Do NOT download all businesses or customers into the browser.
For example:
GET /admin/customers?search=rahul

The exact API format is defined by the backend.

19. PAGINATION
The dashboard must support pagination for large datasets.
Potential datasets:
1000+ businesses
100,000+ customers

Do not load everything into the browser.
Use the backend's pagination mechanism.

20. UI STATES
Every API-driven screen must support:
Loading
Clear loading state.
Empty
Example:

No customers found.

Error
Human-readable error.
Success
Display data.
Network failure
Allow retry.
Unauthorized
Handle session expiration.
Forbidden
Display an appropriate access message.

21. SECURITY
Frontend security requirements:

Never store secrets in source code
Never expose API keys
Never connect directly to database
Handle authentication state securely
Handle unauthorized responses
Handle forbidden responses
Avoid displaying unnecessary sensitive information

Important:

Hiding a button in the UI is NOT authorization.

Backend authorization remains authoritative.

22. RESPONSIBILITY BOUNDARY
The dashboard is responsible for:
UI
Navigation
Tables
Forms
Filters
Pagination
API integration
Loading states
Error states
Confirmation dialogs

Backend is responsible for:
Authentication
Authorization
Business logic
Validation
Database
Tenant isolation
Storage
AI

Do not move business rules into the dashboard merely because they are convenient to implement there.

23. FEATURE 01 OWNER SUPPORT
The Super Admin should be able to answer questions such as:

What businesses exist?


How many customers does this business have?


What customer import happened today?


Why did this import fail?


Is this business active?


Which owner owns this business?

The dashboard should make these support workflows fast.

24. TESTING
Feature 01 should include:
Component tests
For:

Tables
Forms
Filters
Customer views
Import views

Integration tests
For:

Dashboard loading
Business retrieval
Customer retrieval
Import retrieval

Error tests
For:

Network failure
Unauthorized
Forbidden
Backend error
Empty results

UI tests
Verify important administrator workflows.

25. PERFORMANCE
Avoid:

Rendering huge datasets
Unnecessary API requests
Repeated fetching
Heavy client-side filtering
Unoptimized images

Use:

Pagination
Appropriate caching
Debounced search
Virtualized tables where required
Efficient state management


26. ACCESSIBILITY
Production implementation should consider:

Keyboard navigation
Screen readers
Clear labels
Accessible buttons
Proper focus handling
Sufficient contrast
Clear error messages


27. FEATURE 01 SUCCESS CRITERIA
The dashboard is complete when Super Admin can:

Access the dashboard
View platform overview
View businesses
Search businesses
Filter businesses
View business details
View owner information
View business hours
View customer statistics
View customers
Search customers
Filter customers
View customer details
View communication preferences
View import history
View import details
Understand import failures
View business status
Handle loading/empty/error states correctly


28. OUT OF SCOPE
Do NOT implement:

WhatsApp management
Voice management
Campaign management
AI Business Analyst
Billing
Subscription management
Advanced platform analytics
CRM
Inventory
Accounting

These belong to future features.

29. FINAL AI DEVELOPMENT INSTRUCTION
Before coding:

Inspect the existing dashboard repository.
Understand the current project architecture.
Define navigation.
Define page structure.
Define API client architecture.
Define authentication handling.
Define reusable table components.
Define pagination.
Define search/filtering.
Define loading/empty/error states.
Define business screens.
Define customer screens.
Define import screens.
Define responsive behavior.
Define accessibility.
Define testing strategy.
Define security considerations.
Define production deployment considerations.

Then produce a complete production-grade implementation plan.
Follow enterprise frontend engineering practices.
Prioritize:

Maintainability
Security
Performance
Accessibility
Testability
Reusability
Clean architecture
API contract consistency
Production readiness

Do NOT immediately start coding.
First understand the project, produce the implementation plan, identify architectural decisions and only then begin implementation.
