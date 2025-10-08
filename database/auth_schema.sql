-- Enable RLS on auth.users
alter table auth.users enable row level security;

-- Create profiles table
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique,
    full_name text,
    avatar_url text,
    website text,
    about text,
    job_role text,
    gender text,
    dob date,
    aadhaar text,
    pan text,
    address_line1 text,
    address_line2 text,
    city text,
    state text,
    country text,
    pincode text,
    experience_years integer,
    experience_months integer,
    employment_type text,
    occupation text,
    job_requirement text,
    heard_about text,
    interest_type text,
    profile_image_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);