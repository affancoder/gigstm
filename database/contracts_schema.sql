-- Create contracts table
create table public.contracts (
    id uuid default uuid_generate_v4() primary key,
    gig_id uuid references public.gigs(id),
    client_id uuid references public.profiles(id),
    freelancer_id uuid references public.profiles(id),
    proposal_id uuid references public.proposals(id),
    status text check (status in ('active', 'completed', 'cancelled')),
    amount numeric not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);