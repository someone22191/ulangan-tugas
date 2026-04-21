# Supabase Database Schema - SMK Prima Unggul CBT

Copy and paste these SQL commands into your Supabase SQL Editor.

## 1. Tables Creation

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Table: users (Public profile linked to auth.users)
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  role text check (role in ('admin', 'guru', 'siswa')) default 'siswa',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: questions
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  question text not null,
  option_a text not null,
  option_b text not null,
  option_c text not null,
  option_d text not null,
  correct_answer text check (correct_answer in ('A', 'B', 'C', 'D')) not null,
  created_by uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: exams
create table public.exams (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  duration integer not null, -- in minutes
  created_by uuid references public.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Table: exam_questions (Many-to-Many junction)
create table public.exam_questions (
  id uuid default uuid_generate_v4() primary key,
  exam_id uuid references public.exams(id) on delete cascade,
  question_id uuid references public.questions(id) on delete cascade
);

-- Table: results (Final scores)
create table public.results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  exam_id uuid references public.exams(id) on delete cascade,
  score decimal not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## 2. Row Level Security (RLS) Settings

```sql
-- Enable RLS
alter table public.users enable row level security;
alter table public.questions enable row level security;
alter table public.exams enable row level security;
alter table public.exam_questions enable row level security;
alter table public.results enable row level security;

-- Policies for public.users
create policy "Users can view their own profile" on public.users for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.users for select using (
  exists (select 1 from public.users where id = auth.uid() and role = 'admin')
);

-- Policies for questions
create policy "Teachers can manage their own questions" on public.questions for all using (auth.uid() = created_by);
create policy "Students can see questions through exams" on public.questions for select using (true);

-- Policies for exams
create policy "Everyone can see exams" on public.exams for select using (true);
create policy "Teachers can manage their own exams" on public.exams for all using (auth.uid() = created_by);

-- Policies for results
create policy "Students can see their own results" on public.results for select using (auth.uid() = user_id);
create policy "Teachers can see all results" on public.results for select using (
  exists (select 1 from public.users where id = auth.uid() and role in ('admin', 'guru'))
);
```

## 3. Trigger for New User Profile

Allows automatic profile creation in `public.users` when someone signs up via `auth.users`.

```sql
-- Function to handle new user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', 'siswa');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```
