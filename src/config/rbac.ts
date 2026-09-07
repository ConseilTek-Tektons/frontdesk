export const rbacConfig = {
  roles: {
    owner: { label: "Owner", description: "Full control, including security and workspace policy." },
    admin: { label: "Admin", description: "Manages support operations, integrations, and access." },
    supervisor: { label: "Supervisor", description: "Runs queues, SLAs, and agent performance." },
    agent: { label: "Agent", description: "Creates, assigns, and resolves tickets." },
    light_agent: { label: "Light agent", description: "Adds internal notes and follows tickets." },
    analyst: { label: "Analyst", description: "Reviews service metrics and customer trends." },
    viewer: { label: "Viewer", description: "Read-only support workspace access." },
  },
  permissions: {
    "dashboard.view": "View the support workspace", "tickets.manage": "Create, assign, and resolve tickets",
    "queues.manage": "Configure and operate queues", "slas.manage": "Configure service-level policies",
    "macros.manage": "Create and publish response macros", "automations.manage": "Configure support automation",
    "analytics.view": "View service analytics", "assistant.ask": "Ask the support copilot",
    "access.manage": "Configure roles and identity mappings", "settings.manage": "Manage workspace integrations and settings",
  },
  rolePermissions: {
    owner: ["*"], admin: ["*"],
    supervisor: ["dashboard.view", "tickets.manage", "queues.manage", "slas.manage", "macros.manage", "automations.manage", "analytics.view", "assistant.ask"],
    agent: ["dashboard.view", "tickets.manage", "assistant.ask"], light_agent: ["dashboard.view", "assistant.ask"],
    analyst: ["dashboard.view", "analytics.view", "assistant.ask"], viewer: ["dashboard.view"],
  } as Record<string, readonly string[]>,
  identityGroupMappings: {
    "frontdesk-owners": "owner", "frontdesk-admins": "admin", "support-supervisors": "supervisor",
    "support-agents": "agent", "support-light-agents": "light_agent", "support-analytics": "analyst",
  } as Record<string, string>,
  defaultRole: "viewer",
};
