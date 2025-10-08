-- RLS Policies for public.messages
alter table public.messages enable row level security;

create policy "Users can view their own messages"
    on public.messages for select
    using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy "Users can send messages"
    on public.messages for insert
    with check ( auth.uid() = sender_id );