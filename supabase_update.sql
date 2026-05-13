-- Run this in Supabase SQL editor to fix the tasks table schema

-- Add missing columns to tasks table (safe to run multiple times)
alter table tasks add column if not exists assignees text[] default array[]::text[];
alter table tasks add column if not exists checklist jsonb default '[]'::jsonb;
alter table tasks add column if not exists comments jsonb default '[]'::jsonb;

-- Drop the old single-value assigned_to column if it exists
alter table tasks drop column if exists assigned_to;
