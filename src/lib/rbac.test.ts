import { describe, expect, it } from "vitest";
import { hasPermission, resolveRolesFromClaims } from "./rbac";

describe("Frontdesk RBAC", () => {
  it("grants wildcard permissions to administrators", () => expect(hasPermission(["admin"], "automations.manage")).toBe(true));
  it("keeps SLA policy away from agents", () => expect(hasPermission(["agent"], "slas.manage")).toBe(false));
  it("maps support groups", () => expect(resolveRolesFromClaims({ groups: ["support-supervisors"] })).toEqual(["supervisor"]));
});
