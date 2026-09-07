import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/auth";
import { database } from "@/lib/db";
import { hasEffectivePermission } from "@/lib/rbac-server";

export const runtime = "nodejs";
const workspaceId = process.env.WORKSPACE_ID ?? "00000000-0000-4000-8000-000000000001";
const ticketSchema = z.object({ queueId: z.string().uuid(), requesterId: z.string().uuid(), subject: z.string().trim().min(3).max(240), description: z.string().trim().min(1).max(20_000), priority: z.enum(["low","normal","high","urgent"]).default("normal"), source: z.enum(["email","web","api","chat"]).default("web") });

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!await hasEffectivePermission(session.user.roles, "dashboard.view")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!process.env.DATABASE_URL && !process.env.PGHOST) return NextResponse.json({ data: [], mode: "demo-ui" });
  const rows = await database()`select t.id,t.number,t.subject,t.status,t.priority,t.updated_at,r.name as requester,q.name as queue,u.display_name as assignee from ticket t join requester r on r.id=t.requester_id join support_queue q on q.id=t.queue_id left join app_user u on u.id=t.assignee_id where t.organisation_id=${workspaceId} order by t.updated_at desc limit 100`;
  return NextResponse.json({ data: rows, mode: "postgres" });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (!await hasEffectivePermission(session.user.roles, "tickets.manage")) return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  if (!process.env.DATABASE_URL && !process.env.PGHOST) return NextResponse.json({ error: "PostgreSQL is required for persistent tickets." }, { status: 503 });
  const parsed = ticketSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid ticket.", details: parsed.error.flatten() }, { status: 400 });
  try {
    const created = await database().begin(async (tx) => {
      const [ticket] = await tx`insert into ticket (organisation_id,queue_id,requester_id,subject,description,priority,source) values (${workspaceId},${parsed.data.queueId},${parsed.data.requesterId},${parsed.data.subject},${parsed.data.description},${parsed.data.priority},${parsed.data.source}) returning *`;
      await tx`insert into audit_event (organisation_id,actor_id,action,entity_type,entity_id,payload) values (${workspaceId},${session.user.id},'ticket.created','ticket',${ticket.id},${tx.json({ priority: parsed.data.priority, source: parsed.data.source })})`;
      return ticket;
    });
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) { console.error("ticket.create_failed", { message: String(error) }); return NextResponse.json({ error: "Ticket could not be created." }, { status: 500 }); }
}
