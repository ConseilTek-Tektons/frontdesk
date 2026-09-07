# Frontdesk operations

`GET /api/health` reports the web application, PostgreSQL, Redis, enterprise SSO, AI, and RAG readiness without exposing secrets. Managed runtimes use it for replacement decisions.

## Managed-service model

App Runner and App Service Web App for Containers remove VM and orchestrator upkeep. Managed PostgreSQL, Redis, queue, and object services reduce backup, engine-patching, failover, and scaling work. Operators still own mail/channel provider configuration, business calendars, spend, restore drills, and application updates.

## Release sequence

1. Pass `pnpm check`, IaC validation, and a signed/scanned container build.
2. Back up PostgreSQL and apply compatible migrations with a release identity.
3. Verify OIDC, a new ticket, an email reply joined by Message-ID, SLA deadline calculation, RBAC denial, and an agent-reviewed assistant draft.
4. Shift traffic and watch inbound queue age, threading exceptions, SLA risk, API error rate, database connections, and IdP callbacks.

Test point-in-time recovery, attachment restoration, queue replay, and outbound provider failover quarterly. Keep a dead-letter queue and never discard unmatched mail silently.
