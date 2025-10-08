-- RLS Policies for public.kyc_documents
alter table public.kyc_documents enable row level security;

create policy "Users can view their own KYC documents"
    on public.kyc_documents for select
    using ( auth.uid() = id );

create policy "Users can insert their own KYC documents"
    on public.kyc_documents for insert
    with check ( auth.uid() = id );

create policy "Users can update their own KYC documents"
    on public.kyc_documents for update
    using ( auth.uid() = id );