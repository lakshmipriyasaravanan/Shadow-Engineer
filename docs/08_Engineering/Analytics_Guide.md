# Analytics & Administration Guide

The Shadow Engineer platform now includes robust enterprise-level Analytics, Auditing, and Notifications capabilities.

## Architecture

1. **Database Schema:** 
   - `audit_logs`: Records all destructive or critical actions (e.g., repository syncing, AI requests).
   - `notifications`: Stores user-bound messages and alerts.
   - `analytics_events`: Tracks repository-specific usage metrics (e.g., Token Consumption, PR Reviews performed).

2. **Backend Engine (Spring Boot):** 
   - The `AnalyticsService` performs real-time time-series aggregations directly in PostgreSQL, eliminating the need for a heavy external OLAP database for the prototype phase.
   - `AdminController` exposes global endpoints intended for System Administrators (requires `ADMIN` role).
   - `AnalyticsController` exposes tenant-scoped endpoints for repository owners.

3. **Frontend Views (Next.js):** 
   - **/admin/dashboard**: A globally scoped overview of System Health, Total Users, and Total AI Events.
   - **/admin/audit-logs**: A comprehensive security log viewer.
   - **/dashboard/repositories/[id]/analytics**: A tenant-scoped view showing AI Health Scores, Tokens Consumed, and AI Actions performed on a specific repository.

## Health Score Algorithm
The **Repository AI Health Score** is dynamically calculated based on engagement:
- Base score: 50
- PR Reviews: +2 points each
- Generated Docs: +5 points each
- Generated Tests: +5 points each
*(Max score: 100)*
