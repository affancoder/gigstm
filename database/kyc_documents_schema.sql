-- Create kyc_documents table
create table public.kyc_documents (
    id uuid references public.profiles(id) on delete cascade primary key,
    aadhaar_front_url text,
    aadhaar_back_url text,
    pan_card_url text,
    passbook_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);