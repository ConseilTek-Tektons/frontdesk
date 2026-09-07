# Frontdesk role-based access control

Feature policy is explicit and configurable. `src/config/rbac.ts` supplies safe bootstrap grants; PostgreSQL stores approved tenant overrides. Every ticket and administrative API checks effective permissions after validating the signed session.

| Role | Intended access |
|---|---|
| `owner` | Immutable full access and security ownership |
| `admin` | Full support, integration, and access administration |
| `supervisor` | Tickets, queues, SLAs, macros, automation, analytics |
| `agent` | Dashboard, ticket work, assistant |
| `light_agent` | Dashboard and approved assistance without ticket mutation |
| `analyst` | Dashboard, service analytics, assistant |
| `viewer` | Read-only dashboard |

Default groups are `frontdesk-owners`, `frontdesk-admins`, `support-supervisors`, `support-agents`, `support-light-agents`, and `support-analytics`. Unknown groups receive `viewer`.

New functionality requires a named permission, narrow role grants, server enforcement, conditional UI, and allow/deny tests. The owner row cannot be edited. Policy replacement and its audit event are transactional.
