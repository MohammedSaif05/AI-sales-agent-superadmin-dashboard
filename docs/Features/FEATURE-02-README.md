
# Feature 02: AI Business Analyst Agent
## Super Admin Dashboard

## 1. Project Overview

This feature adds the **AI Business Analyst Agent** section to the existing Bringback AI Super Admin Dashboard.

The Super Admin Dashboard allows platform administrators to inspect the AI Business Analyst data and activity of any registered business.

This feature is intended for **Super Admin users only**. Regular business owners and staff members must not be able to access these administrative APIs or dashboard screens.

The backend APIs for this feature are already implemented, tested, and verified.

The frontend implementation must integrate with the existing Super Admin Dashboard architecture created for Feature 01.

---

## 2. Project Context

Bringback AI is a multi-tenant AI Sales Assistant platform for SMBs.

The project is divided into independent applications:

```text
Bringback AI
├── Backend
├── Owner Mobile App
└── Super Admin Dashboard
```

This README applies only to:

```text
Super Admin Dashboard
└── Feature 02: AI Business Analyst Agent
```

The Super Admin Dashboard is a separate frontend project.

Do not assume that the frontend has direct access to the backend source code. Use the verified API contracts provided in this document and inspect the existing dashboard API client and types.

---

## 3. Feature Objective

The objective is to provide Super Admin users with a complete administrative view of the AI Business Analyst activity of a selected business.

The Super Admin must be able to:

1. Open a business from the existing business management section.
2. Navigate to the Business Analyst section.
3. View the business's latest analyst summary.
4. View customer-related analytics metrics.
5. View AI-generated insights.
6. View AI-generated recommendations.
7. View data limitations.
8. View historical analysis records.
9. Open an individual analysis report.
10. View the history of natural-language questions asked by the business.
11. View the AI answers associated with those questions.
12. Handle loading, empty, error, pagination, and authentication states correctly.

---

## 4. Existing Backend APIs

The following APIs are implemented and verified.

All APIs require:

```text
Authorization: Bearer <super-admin-access-token>
```

All APIs are protected by:

```text
JwtAuthGuard
RolesGuard
SUPER_ADMIN role
```

Regular owners and staff members must receive `403 Forbidden`.

Unauthenticated requests must receive `401 Unauthorized`.

---

## 5. API 1: Latest Analyst Summary

### Endpoint

```http
GET /api/v1/admin/businesses/:id/analyst-summary
```

### Path Parameter

```text
id: Business UUID
```

### Purpose

Returns the latest trailing 30-day AI Business Analyst summary for the selected business.

### Expected Response

The global response interceptor wraps the response in:

```json
{
  "success": true,
  "data": {}
}
```

The `data` object follows the verified backend response contract:

```json
{
  "period": {
    "from": "2026-08-17T18:08:34.000Z",
    "to": "2026-09-16T18:08:34.000Z"
  },
  "summary": "Store performance summary...",
  "metrics": [
    {
      "key": "totalActiveCustomers",
      "name": "Total Active Customers",
      "value": 150,
      "unit": "count",
      "description": "Total non-deleted registered customer profiles in store directory"
    }
  ],
  "insights": [
    {
      "title": "Strong WhatsApp Opt-In",
      "description": "80% of active customers have opted into WhatsApp outreach.",
      "category": "CUSTOMER_ACQUISITION",
      "referencedMetricKey": "whatsappMarketingOptInPercentage",
      "referencedMetricValue": 80,
      "severity": "POSITIVE"
    }
  ],
  "recommendations": [
    {
      "title": "Launch Broadcast Campaign",
      "action": "Initiate WhatsApp broadcast to opted-in cohort.",
      "rationale": "High opt-in rate allows low-friction direct outreach.",
      "referencedMetricKey": "effectiveWhatsappEligibleCount",
      "referencedMetricValue": 120,
      "priority": "HIGH"
    }
  ],
  "dataLimitations": []
}
```

### Frontend Requirements

Build the following UI:

- Period display.
- Summary section.
- Metrics cards or responsive metric grid.
- Insights section.
- Recommendations section.
- Data limitations section.
- Empty state when there are no insights or recommendations.
- Error state when the API fails.
- Loading skeleton while the API is loading.

### Metric Rendering Rules

Do not hardcode metric names or values.

Render the `metrics` array dynamically.

The frontend must support:

- Count values.
- Percentage values.
- Null values.
- Unknown future metric keys.
- Long descriptions.
- Responsive layouts.

Use the `unit` field to format values appropriately.

Examples:

```text
unit: count
unit: percentage
unit: rate
unit: currency
```

Do not assume that every future metric will use the same unit.

---

## 6. API 2: Analysis History

### Endpoint

```http
GET /api/v1/admin/businesses/:id/analyses
```

### Query Parameters

Use the existing backend DTO contract:

```text
analysisType
status
page
limit
```

Example:

```http
GET /api/v1/admin/businesses/business-id/analyses?page=1&limit=20&status=COMPLETED
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "analysis-uuid-1",
        "analysisType": "CUSTOMER_ANALYSIS",
        "status": "COMPLETED",
        "summary": "AI summary text...",
        "result": {},
        "errorMessage": null,
        "createdAt": "2026-09-16T12:00:00.000Z",
        "completedAt": "2026-09-16T12:00:04.000Z"
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1,
      "hasNextPage": false
    }
  }
}
```

### Frontend Requirements

Build a paginated analysis history table or responsive list.

Display:

- Analysis ID.
- Analysis type.
- Status.
- Summary.
- Created date.
- Completed date.
- Error message when applicable.
- View details action.

### Supported Analysis Types

Use the actual backend enum values:

```text
BUSINESS_SUMMARY
CUSTOMER_ANALYSIS
SALES_ANALYSIS
PRODUCT_ANALYSIS
CAMPAIGN_ANALYSIS
TREND_ANALYSIS
```

Do not invent additional values.

### Supported Analysis Statuses

Use the actual backend enum values:

```text
QUEUED
PROCESSING
COMPLETED
FAILED
```

### Status UI

Use clear visual status indicators:

| Status | Meaning |
|---|---|
| QUEUED | Analysis is waiting to be processed |
| PROCESSING | Analysis is currently being processed |
| COMPLETED | Analysis completed successfully |
| FAILED | Analysis failed |

Do not use unsupported statuses such as:

```text
PENDING
SUCCESS
CANCELLED
IN_PROGRESS
```

unless the backend contract is updated and verified.

### Pagination Requirements

Implement:

- Current page.
- Total records.
- Page size.
- Next page.
- Previous page.
- Disabled previous button on the first page.
- Disabled next button on the last page.
- Empty state when no records exist.
- Loading state when changing pages.
- Error state.

Do not implement frontend pagination by loading all records and filtering locally.

Use backend pagination.

---

## 7. API 3: Analysis Detail

### Endpoint

```http
GET /api/v1/admin/businesses/:id/analyses/:analysisId
```

### Purpose

Displays the complete validated result of one analysis.

### Frontend Requirements

When an administrator selects an analysis, open either:

- A detail page.
- A drawer.
- A modal with sufficient space.

Use the existing dashboard design pattern from Feature 01.

Display:

- Analysis ID.
- Analysis type.
- Status.
- Summary.
- Validated analysis result.
- Created date.
- Completed date.
- Error message when applicable.
- Data limitations when included in the result.

### Security Requirements

The frontend must always request the detail using both identifiers:

```text
businessId
analysisId
```

Example:

```http
GET /api/v1/admin/businesses/business-A/analyses/analysis-A
```

Do not attempt to access an analysis using only the analysis ID.

If the backend returns:

```text
404 ANALYSIS_NOT_FOUND
```

display a suitable not-found state.

Do not expose raw internal fields such as:

```text
dataSnapshotJson
contextJson
```

unless the backend explicitly adds them to the verified public response contract.

---

## 8. API 4: Question History

### Endpoint

```http
GET /api/v1/admin/businesses/:id/questions
```

### Query Parameters

Use the existing backend DTO contract:

```text
status
page
limit
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "question-uuid-1",
        "question": "How many customers opted into WhatsApp?",
        "answer": "80% of active customers opted into WhatsApp.",
        "status": "COMPLETED",
        "createdAt": "2026-09-16T12:00:00.000Z"
      }
    ],
    "meta": {
      "total": 1,
      "page": 1,
      "limit": 20,
      "totalPages": 1,
      "hasNextPage": false
    }
  }
}
```

### Frontend Requirements

Build a paginated question history section.

Display:

- Question.
- Answer.
- Status.
- Created date.
- Error state where applicable.
- Pagination controls.

Use a readable layout such as:

```text
Question
└── Answer
    └── Status and date
```

Avoid displaying very long answers inside a cramped table cell. Use expandable rows, cards, or a detail drawer when appropriate.

### Supported Question Statuses

Use the actual backend enum values:

```text
PROCESSING
COMPLETED
FAILED
```

Do not invent unsupported statuses.

### Privacy Requirements

Do not expose or render:

```text
contextJson
```

Do not display internal provider responses or hidden system data.

The backend is responsible for excluding raw customer PII. The frontend must not add any additional PII display or logging.

Do not log API responses to the browser console in production.

---

## 9. Navigation and Integration

Integrate Feature 02 into the existing Feature 01 Super Admin Dashboard.

Do not create a separate application.

Do not duplicate:

- Authentication.
- Sidebar.
- Header.
- Business selection.
- API client.
- Token refresh logic.
- Theme system.
- Toast system.
- Error handling.
- Shared UI components.

Recommended navigation:

```text
Super Admin Dashboard
└── Businesses
    └── Business Details
        └── Business Analyst
            ├── Summary
            ├── Analysis History
            └── Question History
```

The exact route structure must follow the existing dashboard conventions.

Before implementation, inspect the current Feature 01 routes and components.

---

## 10. Recommended Page Structure

A possible page layout:

```text
Business Analyst
├── Header
│   ├── Business name
│   ├── Selected period
│   └── Refresh action
│
├── Summary Section
│   ├── Summary text
│   ├── Metrics grid
│   └── Data limitations
│
├── Insights Section
│   ├── Insight cards
│   └── Empty state
│
├── Recommendations Section
│   ├── Recommendation cards
│   └── Empty state
│
├── Analysis History Section
│   ├── Filters
│   ├── Paginated table
│   └── Analysis detail view
│
└── Question History Section
    ├── Status filter
    ├── Paginated list
    └── Question and answer display
```

This structure is a recommendation. The implementation agent must inspect the existing dashboard design and provide a final UI structure in its implementation plan.

---

## 11. Loading, Empty, Error, and Permission States

### Loading State

Display skeletons or loading indicators for:

- Summary.
- Metrics.
- Insights.
- Recommendations.
- Analysis history.
- Analysis detail.
- Question history.

Avoid blank screens during loading.

### Empty State

Handle:

- No customers.
- No summary insights.
- No recommendations.
- No analysis records.
- No question records.
- No completed analysis.
- No failed analysis.

Use clear messages such as:

```text
No analyst insights are available for this business yet.
```

Do not treat an empty result as a frontend error.

### Error State

Handle:

```text
401 Unauthorized
403 Forbidden
404 Business Not Found
404 Analysis Not Found
500 Internal Server Error
Network Error
```

Use the existing global error handling pattern.

### Authentication State

If the Super Admin token expires:

1. Use the existing refresh-token flow.
2. Retry the request only according to the existing API client behavior.
3. Redirect to login only when the existing authentication system requires it.

Do not create a second authentication system.

---

## 12. TypeScript Requirements

Create strongly typed frontend models for:

- Analyst summary.
- Metric fact item.
- Insight item.
- Recommendation item.
- Analysis history item.
- Analysis detail.
- Question history item.
- Pagination metadata.
- API success response.
- API error response.

Do not use `any` for API response data.

Do not duplicate types unnecessarily if shared types already exist.

Use the actual backend contract.

If a response field is uncertain, inspect the backend contract or clearly mark it as an implementation dependency in the plan. Do not silently guess.

---

## 13. API Client Requirements

Use the existing API client used by Feature 01.

The API client must support:

- Access token handling.
- Refresh token handling.
- Base URL configuration.
- Standard headers.
- Error transformation.
- Request cancellation where supported.
- Query parameter serialization.

Do not create a separate Axios or fetch instance unless the existing architecture requires it.

Recommended API methods:

```typescript
getBusinessAnalystSummary(businessId: string)

getBusinessAnalyses(
  businessId: string,
  query: AnalysisQuery
)

getBusinessAnalysisDetail(
  businessId: string,
  analysisId: string
)

getBusinessQuestions(
  businessId: string,
  query: QuestionQuery
)
```

The exact naming must follow the existing dashboard conventions.

---

## 14. State Management Requirements

Inspect the existing state management architecture before implementation.

Use the existing approach, such as:

- React Query.
- TanStack Query.
- Redux Toolkit.
- Zustand.
- Context.
- Local component state.

Do not introduce a new state management library for this feature without a clear reason.

Recommended query keys should include the business ID:

```text
business-analyst-summary:{businessId}
business-analyses:{businessId}:{query}
business-analysis-detail:{businessId}:{analysisId}
business-questions:{businessId}:{query}
```

This prevents data from one business being displayed while viewing another business.

When switching businesses:

- Clear or invalidate the previous business's queries.
- Load the selected business's data.
- Prevent stale business data from appearing under the new business.

---

## 15. Security Requirements

The frontend must:

- Restrict the feature to Super Admin routes.
- Use the existing authenticated API client.
- Never store access tokens in insecure new storage locations.
- Never expose secret API keys.
- Never expose Gemini keys.
- Never expose database credentials.
- Never log customer PII.
- Never render internal snapshot data.
- Never bypass backend authorization.
- Never use an owner-level endpoint for Super Admin inspection.
- Always include the selected business ID in business-specific requests.

Backend authorization remains the final security boundary.

Frontend route protection alone is not sufficient.

---

## 16. Performance Requirements

The implementation must:

- Use server-side pagination.
- Avoid loading all analysis records at once.
- Avoid unnecessary duplicate API calls.
- Cache summary data according to the existing state-management strategy.
- Avoid refetch loops.
- Avoid rendering huge analysis results unnecessarily.
- Use lazy loading for heavy detail views if appropriate.
- Use skeletons instead of blocking the entire page.
- Cancel outdated requests where supported.

The Phase 2 platform overview API is not part of this feature implementation.

---

## 17. Accessibility Requirements

The UI must support:

- Keyboard navigation.
- Visible focus states.
- Accessible buttons.
- Accessible tables.
- Proper heading hierarchy.
- Screen-reader-friendly status labels.
- Sufficient color contrast.
- Responsive behavior.
- Mobile and tablet layouts.
- Clear error messages.
- Accessible expandable content.

Do not communicate status using color alone.

---

## 18. Responsive Design Requirements

The dashboard must work on:

- Desktop.
- Laptop.
- Tablet.
- Smaller browser widths.

For smaller screens:

- Convert tables into cards or horizontally scrollable tables where appropriate.
- Keep important information visible.
- Prevent text overflow.
- Wrap long summaries and answers.
- Keep action buttons usable.
- Avoid page-level horizontal overflow.

Follow the existing Feature 01 responsive design system.

---

## 19. Out of Scope

The following items are not part of Feature 02 Super Admin Dashboard Phase 1:

- Phase 2 platform-wide analyst overview.
- BullMQ queue monitoring.
- Platform-wide analysis totals.
- Platform-wide completion rate.
- Business activation or deactivation.
- Editing customer data.
- Editing analysis results.
- Deleting analysis records.
- Creating or triggering new analyses unless explicitly supported by an existing verified API.
- Creating AI campaigns.
- Sending WhatsApp messages.
- Making voice calls.
- Modifying Gemini configuration.
- Database schema changes.
- Backend API changes.
- Owner Mobile App implementation.
- New authentication system.
- New dashboard application.

---

## 20. Definition of Done

Feature 02 Super Admin Dashboard Phase 1 is complete only when:

### UI

- [ ] Business Analyst section is integrated into the existing dashboard.
- [ ] Summary is displayed.
- [ ] Metrics are displayed dynamically.
- [ ] Insights are displayed.
- [ ] Recommendations are displayed.
- [ ] Data limitations are displayed.
- [ ] Analysis history is displayed.
- [ ] Analysis detail is accessible.
- [ ] Question history is displayed.
- [ ] Pagination works.
- [ ] Loading states work.
- [ ] Empty states work.
- [ ] Error states work.
- [ ] Responsive layouts work.
- [ ] Accessibility requirements are met.

### API

- [ ] Summary API is integrated.
- [ ] Analysis history API is integrated.
- [ ] Analysis detail API is integrated.
- [ ] Question history API is integrated.
- [ ] Correct business ID is included in every request.
- [ ] Correct query parameters are sent.
- [ ] API response envelopes are handled correctly.
- [ ] API errors are handled correctly.

### Security

- [ ] Only Super Admin users can access the feature.
- [ ] Owners cannot access the feature.
- [ ] Staff cannot access the feature.
- [ ] Cross-business data is not displayed.
- [ ] No raw customer PII is displayed.
- [ ] No internal snapshot or context data is displayed.
- [ ] No secret keys are exposed.
- [ ] No sensitive API response logging exists.

### Regression

- [ ] Feature 01 dashboard functionality remains unchanged.
- [ ] Existing authentication remains unchanged.
- [ ] Existing business management remains unchanged.
- [ ] Existing API client remains compatible.
- [ ] Existing tests continue to pass.
- [ ] No unrelated files are modified unnecessarily.

---

## 21. Required Implementation Workflow

The implementation agent must follow this workflow.

### Step 1: Inspect the Existing Dashboard

Inspect:

- Folder structure.
- Routing.
- Layout.
- Authentication.
- API client.
- Token refresh logic.
- Business management pages.
- Business detail page.
- Existing reusable components.
- State management.
- Styling system.
- Testing setup.
- Environment variables.

### Step 2: Inspect Existing Feature 01 Patterns

Identify and reuse:

- Business detail navigation.
- Page layouts.
- Tables.
- Cards.
- Filters.
- Pagination.
- Loading components.
- Empty states.
- Error states.
- Toasts.
- Modal or drawer patterns.
- API service patterns.
- Type definitions.

### Step 3: Verify API Contracts

Before coding, confirm:

- Actual endpoint paths.
- Actual response envelope.
- Actual response field names.
- Actual enum values.
- Actual pagination fields.
- Actual error format.
- Actual authentication behavior.

Do not invent fields.

### Step 4: Create an Implementation Plan

The agent must provide a detailed implementation plan before modifying code.

The plan must include:

1. Files to create.
2. Files to modify.
3. Route changes.
4. Component structure.
5. API client changes.
6. Type definitions.
7. State management changes.
8. Query and cache strategy.
9. Loading and error handling.
10. Responsive design approach.
11. Accessibility approach.
12. Testing strategy.
13. Regression risk.
14. Out-of-scope items.

### Step 5: Wait for Approval

The agent must not modify code until the implementation plan is reviewed and explicitly approved.

### Step 6: Implement in Small Phases

Recommended implementation order:

```text
Phase A: API types and API client
Phase B: Business Analyst route and page shell
Phase C: Summary, metrics, insights, recommendations
Phase D: Analysis history and pagination
Phase E: Analysis detail
Phase F: Question history and pagination
Phase G: Loading, empty, error, and permission states
Phase H: Responsive and accessibility improvements
Phase I: Tests and regression verification
```

### Step 7: Verify the Implementation

Run the existing project verification commands.

The agent must inspect the actual `package.json` scripts before choosing commands.

At minimum, verify:

- TypeScript compilation.
- Linting.
- Unit tests.
- Component tests.
- E2E tests if available.
- Production build.

### Step 8: Report Completion

The final report must include:

- Files created.
- Files modified.
- Routes added.
- Components created.
- API methods added.
- Tests added.
- Commands executed.
- Exact test results.
- Build result.
- Known limitations.
- Remaining work.
- Confirmation that Feature 01 remains unaffected.

---

## 22. Implementation Agent Prompt

Use the following prompt after copying this README:

> Read this entire README carefully.
>
> You are implementing **Feature 02: AI Business Analyst Agent, Super Admin Dashboard, Phase 1** for Bringback AI.
>
> First inspect the existing Super Admin Dashboard project and the completed Feature 01 implementation.
>
> Do not start coding immediately.
>
> First provide a detailed implementation plan covering:
>
> - Existing architecture.
> - Files to create.
> - Files to modify.
> - Route integration.
> - API client integration.
> - Type definitions.
> - State management.
> - Query keys and cache behavior.
> - Component structure.
> - Summary UI.
> - Metrics UI.
> - Insights UI.
> - Recommendations UI.
> - Analysis history.
> - Analysis detail.
> - Question history.
> - Pagination.
> - Loading states.
> - Empty states.
> - Error states.
> - Permission handling.
> - Responsive design.
> - Accessibility.
> - Testing.
> - Regression risks.
>
> Use only the four verified Phase 1 APIs:
>
> ```text
> GET /api/v1/admin/businesses/:id/analyst-summary
> GET /api/v1/admin/businesses/:id/analyses
> GET /api/v1/admin/businesses/:id/analyses/:analysisId
> GET /api/v1/admin/businesses/:id/questions
> ```
>
> Do not implement the Phase 2 platform overview API.
>
> Do not invent API response fields, enum values, routes, or authentication behavior.
>
> Reuse the existing Feature 01 dashboard architecture wherever possible.
>
> Do not modify backend code.
>
> Do not modify the Owner Mobile App.
>
> Do not modify Feature 01 functionality.
>
> Do not create a new authentication system or state-management system without justification.
>
> Wait for explicit approval of the implementation plan before making any code changes.
