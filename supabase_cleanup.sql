-- Drop all existing policies
drop policy if exists "Users can view their own profile" on users;
drop policy if exists "Users can create their own profile" on users;
drop policy if exists "Users can insert their own profile" on users;
drop policy if exists "Users can update their own profile" on users;

drop policy if exists "Users can view their own projects" on projects;
drop policy if exists "Users can create projects" on projects;
drop policy if exists "Users can update their own projects" on projects;
drop policy if exists "Users can delete their own projects" on projects;

drop policy if exists "Users can view tasks in their projects" on tasks;
drop policy if exists "Users can create tasks" on tasks;
drop policy if exists "Users can update their own tasks" on tasks;
drop policy if exists "Users can delete their own tasks" on tasks;
