-- RLS Policies for public.gigs
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