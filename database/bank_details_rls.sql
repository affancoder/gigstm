-- RLS Policies for public.bank_details
alter table public.bank_details enable row level security;

create policy "Users can view their own bank details"
    on public.bank_details for select
    using ( auth.uid() = id );

create policy "Users can insert their own bank details"
    on public.bank_details for insert
    with check ( auth.uid() = id );

create policy "Users can update their own bank details"
    on public.bank_details for update
    using ( auth.uid() = id );