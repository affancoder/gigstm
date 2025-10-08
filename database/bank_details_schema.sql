-- Create bank_details table
create table public.bank_details (
    id uuid references public.profiles(id) on delete cascade primary key,
    bank_name text not null,
    account_number text not null,
    ifsc_code text not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);