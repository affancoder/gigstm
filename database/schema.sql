-- Enable RLS
alter table auth.users enable row level security;

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    full_name text,
    avatar_url text,
    website text,
    about text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create categories table
create table public.categories (
    id serial primary key,
    name text not null unique,
    description text,
    created_at timestamptz default now()
);

-- Create skills table
create table public.skills (
    id serial primary key,
    name text not null unique,
    category_id integer references public.categories(id),
    created_at timestamptz default now()
);

-- Create gigs table
create table public.gigs (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    budget numeric not null,
    user_id uuid references public.profiles(id),
    category_id integer references public.categories(id),
    status text check (status in ('draft', 'published', 'in_progress', 'completed', 'cancelled')),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create gig_skills junction table
create table public.gig_skills (
    gig_id uuid references public.gigs(id) on delete cascade,
    skill_id integer references public.skills(id) on delete cascade,
    primary key (gig_id, skill_id)
);

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

-- Create messages table
create table public.messages (
    id uuid default uuid_generate_v4() primary key,
    sender_id uuid references public.profiles(id),
    receiver_id uuid references public.profiles(id),
    content text not null,
    read boolean default false,
    created_at timestamptz default now()
);

-- Create notifications table
create table public.notifications (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id),
    type text not null,
    content text not null,
    read boolean default false,
    created_at timestamptz default now()
);

-- RLS Policies

-- Profiles policies
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
    on public.profiles for select
    using ( true );

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check ( auth.uid() = id );

create policy "Users can update own profile"
    on public.profiles for update
    using ( auth.uid() = id );

-- Gigs policies
alter table public.gigs enable row level security;

create policy "Gigs are viewable by everyone"
    on public.gigs for select
    using ( true );

create policy "Authenticated users can create gigs"
    on public.gigs for insert
    with check ( auth.uid() = user_id );

create policy "Users can update own gigs"
    on public.gigs for update
    using ( auth.uid() = user_id );

-- Proposals policies
alter table public.proposals enable row level security;

create policy "Proposals are viewable by gig owner and proposal creator"
    on public.proposals for select
    using (
        auth.uid() = user_id or 
        auth.uid() in (
            select user_id from public.gigs where id = gig_id
        )
    );

create policy "Authenticated users can create proposals"
    on public.proposals for insert
    with check ( auth.uid() = user_id );

create policy "Users can update own proposals"
    on public.proposals for update
    using ( auth.uid() = user_id );

-- Messages policies
alter table public.messages enable row level security;

create policy "Users can view their own messages"
    on public.messages for select
    using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy "Users can send messages"
    on public.messages for insert
    with check ( auth.uid() = sender_id );

-- Notifications policies
alter table public.notifications enable row level security;

create policy "Users can view own notifications"
    on public.notifications for select
    using ( auth.uid() = user_id );

-- Create indexes for better performance
create index gigs_user_id_index on public.gigs(user_id);
create index gigs_category_id_index on public.gigs(category_id);
create index proposals_gig_id_index on public.proposals(gig_id);
create index proposals_user_id_index on public.proposals(user_id);
create index messages_sender_receiver_index on public.messages(sender_id, receiver_id);
create index notifications_user_id_index on public.notifications(user_id);
