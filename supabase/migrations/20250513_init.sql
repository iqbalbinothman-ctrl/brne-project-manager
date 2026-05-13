-- Create users table
create table if not exists users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  initials text,
  created_at timestamp default now()
);

-- Create projects table
create table if not exists projects (
  id text primary key,
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  client text not null,
  status text default 'Ongoing',
  progress integer default 0,
  due_date text,
  team_members text[] default array[]::text[],
  resource_links jsonb default '[]'::jsonb,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create tasks table
create table if not exists tasks (
  id text primary key,
  user_id uuid not null references users(id) on delete cascade,
  project_id text not null references projects(id) on delete cascade,
  title text not null,
  description text,
  status text default 'Todo',
  priority text,
  deadline text,
  assigned_to text,
  deadline_extensions jsonb default '[]'::jsonb,
  resource_links jsonb default '[]'::jsonb,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Enable RLS on all tables
alter table users enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;

-- Create policies for users table
create policy "Users can view their own profile"
  on users for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on users for update
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on users for insert
  with check (auth.uid() = id);

-- Create policies for projects table
create policy "Users can view their own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can create projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on projects for delete
  using (auth.uid() = user_id);

-- Create policies for tasks table
create policy "Users can view tasks in their projects"
  on tasks for select
  using (auth.uid() = user_id);

create policy "Users can create tasks"
  on tasks for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tasks"
  on tasks for update
  using (auth.uid() = user_id);

create policy "Users can delete their own tasks"
  on tasks for delete
  using (auth.uid() = user_id);
