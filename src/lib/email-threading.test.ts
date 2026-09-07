import { describe, expect, it } from "vitest";
import { resolveTicketThread } from "./email-threading";

describe("email threading", () => {
  const candidates = [{ ticketId: "FD-1042", messageId: "<reply-1@example.test>" }];
  it("matches In-Reply-To before creating a ticket", () => expect(resolveTicketThread("<reply-1@example.test>", [], candidates)).toBe("FD-1042"));
  it("returns null for a new conversation", () => expect(resolveTicketThread(null, ["<unknown@example.test>"], candidates)).toBeNull());
});
