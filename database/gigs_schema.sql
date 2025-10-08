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