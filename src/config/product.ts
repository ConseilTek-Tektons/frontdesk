import type { ProductConfig } from "./types";

export const product: ProductConfig = {
  id: "frontdesk",
  name: "Frontdesk",
  category: "Service & Support",
  tagline: "Ticketing that does not bill you per agent.",
  description: "A self-hosted support desk for reliable email threading, queue routing, business-hour SLAs, macros, and CSAT.",
  repositoryUrl: "https://github.com/ConseilTek-Tektons/frontdesk",
  nav: [{ label: "Tickets", badge: "12" }, { label: "Queues" }, { label: "Customers" }, { label: "Analytics" }],
  demoUsers: [
    { id: "demo-admin", name: "Maya Chen", email: "maya@northstar.example", role: "admin", label: "Support admin" },
    { id: "demo-manager", name: "Jon Bell", email: "jon@northstar.example", role: "supervisor", label: "Queue supervisor" },
    { id: "demo-host", name: "Priya Rao", email: "priya@northstar.example", role: "agent", label: "Support agent" },
  ],
  ai: {
    name: "Support copilot",
    description: "Ask about queue pressure, SLA risk, related cases, approved macros, or a grounded reply draft.",
    systemPrompt: "You are Frontdesk's support copilot. Answer only from the supplied ticket context and approved knowledge. Cite sources, minimize customer data, never send a reply, and never change ticket state.",
    suggestedQuestions: ["Which tickets are likely to breach?", "How does email threading work?", "Suggest an approved response for this pattern."],
  },
};
