-- Create messages table
create table public.messages (
    id uuid default uuid_generate_v4() primary key,
    sender_id uuid references public.profiles(id),
    receiver_id uuid references public.profiles(id),
    content text not null,
    read boolean default false,
    created_at timestamptz default now()
);