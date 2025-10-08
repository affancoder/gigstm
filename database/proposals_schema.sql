-- Create proposals table
create table public.proposals (
    id uuid default uuid_generate_v4() primary key,
    gig_id uuid references public.gigs(id) on delete cascade,
    user_id uuid references public.profiles(id),
    cover_letter text,
    bid_amount numeric not null,
    status text check (status in ('pending', 'accepted', 'rejected')),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);