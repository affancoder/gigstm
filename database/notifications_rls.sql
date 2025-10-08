-- RLS Policies for public.notifications
alter table public.notifications enable row level security;

create policy "Users can view own notifications"
    on public.notifications for select
    using ( auth.uid() = user_id );