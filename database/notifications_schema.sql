-- Create notifications table
create table public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id),
    type text not null,
    content text not null,
    read boolean default false,
    created_at timestamptz default now()
);