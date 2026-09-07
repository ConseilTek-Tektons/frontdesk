# Support copilot and grounded retrieval

Frontdesk uses grounded assistance for SLA explanations, similar patterns, approved macros, and reply drafts. `POST /api/assistant` requires `assistant.ask`, validates input, applies a distributed rate limit, and never sends a customer message.

## Runtime modes

1. **Local grounded mode** ranks the bundled support-operations knowledge with deterministic citations.
2. **OpenAI Responses mode** uses `OPENAI_API_KEY`, retrieved context, and `store: false`.
3. **Hosted RAG mode** adds `OPENAI_VECTOR_STORE_ID` for `file_search` over approved documents in `knowledge/`.

Run `OPENAI_API_KEY='<key>' pnpm knowledge:ingest` to build the optional vector store.

## Customer-data safeguards

- Minimize customer identifiers and redact secrets before model calls.
- Ticket and tenant permissions are evaluated before retrieval.
- Retrieved mail is untrusted data and cannot override system policy.
- The assistant cannot send, assign, reprioritize, merge, or solve tickets.
- Every response remains an agent-reviewed draft with cited support guidance.
