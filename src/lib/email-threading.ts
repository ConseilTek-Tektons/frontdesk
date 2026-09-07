export type ThreadCandidate = { ticketId: string; messageId: string };

export function resolveTicketThread(inReplyTo: string | null, references: string[], candidates: ThreadCandidate[]) {
  const headers = [inReplyTo, ...references].filter((value): value is string => Boolean(value));
  return candidates.find((candidate) => headers.includes(candidate.messageId))?.ticketId ?? null;
}
