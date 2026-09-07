create extension if not exists pgcrypto;

create table organisation (id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, created_at timestamptz not null default now());
create table app_user (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  identity_subject text not null, email text not null, display_name text not null, active boolean not null default true,
  created_at timestamptz not null default now(), unique (organisation_id, identity_subject), unique (organisation_id, email)
);
create table customer_organisation (id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade, name text not null, domains text[] not null default '{}', notes text not null default '');
create table requester (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  customer_organisation_id uuid references customer_organisation(id) on delete set null, email text not null, name text not null,
  locale text not null default 'en', created_at timestamptz not null default now(), unique (organisation_id, email)
);
create table support_queue (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  name text not null, slug text not null, inbound_address text not null, active boolean not null default true,
  unique (organisation_id, slug), unique (organisation_id, inbound_address)
);
create table sla_policy (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  name text not null, priority text not null check (priority in ('low','normal','high','urgent')),
  first_response_minutes integer not null check (first_response_minutes > 0), resolution_minutes integer not null check (resolution_minutes > 0),
  business_hours jsonb not null default '{}'::jsonb, unique (organisation_id, name, priority)
);
create table ticket (
  id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade,
  number bigint generated always as identity, queue_id uuid not null references support_queue(id), requester_id uuid not null references requester(id),
  assignee_id uuid references app_user(id), sla_policy_id uuid references sla_policy(id), subject text not null, description text not null default '',
  status text not null default 'open' check (status in ('new','open','pending','on_hold','solved','closed')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  source text not null default 'web' check (source in ('email','web','api','chat')), tags text[] not null default '{}',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), solved_at timestamptz,
  unique (organisation_id, number)
);
create index ticket_queue_status_idx on ticket (queue_id, status, updated_at desc);
create index ticket_search_idx on ticket using gin (to_tsvector('english', subject || ' ' || description));
create table ticket_comment (
  id uuid primary key default gen_random_uuid(), ticket_id uuid not null references ticket(id) on delete cascade,
  author_user_id uuid references app_user(id), author_requester_id uuid references requester(id), body text not null,
  public boolean not null default true, message_id text, in_reply_to text, created_at timestamptz not null default now(),
  check (author_user_id is not null or author_requester_id is not null), unique (message_id)
);
create table sla_clock (
  id uuid primary key default gen_random_uuid(), ticket_id uuid not null references ticket(id) on delete cascade,
  metric text not null check (metric in ('first_response','resolution')), due_at timestamptz not null,
  fulfilled_at timestamptz, breached_at timestamptz, paused_at timestamptz, unique (ticket_id, metric)
);
create table response_macro (id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade, name text not null, body text not null, actions jsonb not null default '{}'::jsonb, active boolean not null default true, unique (organisation_id, name));
create table automation_rule (id uuid primary key default gen_random_uuid(), organisation_id uuid not null references organisation(id) on delete cascade, name text not null, event text not null, conditions jsonb not null default '{}'::jsonb, actions jsonb not null, active boolean not null default true, unique (organisation_id, name));
create table automation_run (id bigint generated always as identity primary key, rule_id uuid not null references automation_rule(id) on delete cascade, ticket_id uuid not null references ticket(id) on delete cascade, result jsonb not null default '{}'::jsonb, ran_at timestamptz not null default now());
create table side_conversation (id uuid primary key default gen_random_uuid(), ticket_id uuid not null references ticket(id) on delete cascade, subject text not null, participants text[] not null, status text not null default 'open' check (status in ('open','closed')), created_at timestamptz not null default now());
create table satisfaction_response (id uuid primary key default gen_random_uuid(), ticket_id uuid not null unique references ticket(id) on delete cascade, score smallint not null check (score between 1 and 5), comment text not null default '', submitted_at timestamptz not null default now());
create table audit_event (id bigint generated always as identity primary key, organisation_id uuid not null references organisation(id) on delete cascade, actor_id text not null, action text not null, entity_type text not null, entity_id text not null, payload jsonb not null default '{}'::jsonb, occurred_at timestamptz not null default now());
create index audit_event_org_time_idx on audit_event (organisation_id, occurred_at desc);
create table role_policy (organisation_id uuid not null references organisation(id) on delete cascade, role_key text not null, permissions text[] not null default '{}', updated_by text not null, updated_at timestamptz not null default now(), primary key (organisation_id, role_key));
