-- RLS Policies for public.proposals
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