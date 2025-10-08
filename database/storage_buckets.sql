insert into storage.buckets (id, name, public)
values
  ('profile_images', 'profile_images', false),
  ('aadhaar_documents', 'aadhaar_documents', false),
  ('pan_documents', 'pan_documents', false),
  ('resumes', 'resumes', false),
  ('bank_documents', 'bank_documents', false);

-- RLS Policies for profile_images bucket
create policy "Allow authenticated users to upload their own profile images"
on storage.objects for insert with check (bucket_id = 'profile_images' and auth.uid() = owner);

create policy "Allow authenticated users to view their own profile images"
on storage.objects for select using (bucket_id = 'profile_images' and auth.uid() = owner);

create policy "Allow authenticated users to update their own profile images"
on storage.objects for update using (bucket_id = 'profile_images' and auth.uid() = owner);

create policy "Allow authenticated users to delete their own profile images"
on storage.objects for delete using (bucket_id = 'profile_images' and auth.uid() = owner);

-- RLS Policies for aadhaar_documents bucket
create policy "Allow authenticated users to upload their own aadhaar documents"
on storage.objects for insert with check (bucket_id = 'aadhaar_documents' and auth.uid() = owner);

create policy "Allow authenticated users to view their own aadhaar documents"
on storage.objects for select using (bucket_id = 'aadhaar_documents' and auth.uid() = owner);

create policy "Allow authenticated users to update their own aadhaar documents"
on storage.objects for update using (bucket_id = 'aadhaar_documents' and auth.uid() = owner);

create policy "Allow authenticated users to delete their own aadhaar documents"
on storage.objects for delete using (bucket_id = 'aadhaar_documents' and auth.uid() = owner);

-- RLS Policies for pan_documents bucket
create policy "Allow authenticated users to upload their own pan documents"
on storage.objects for insert with check (bucket_id = 'pan_documents' and auth.uid() = owner);

create policy "Allow authenticated users to view their own pan documents"
on storage.objects for select using (bucket_id = 'pan_documents' and auth.uid() = owner);

create policy "Allow authenticated users to update their own pan documents"
on storage.objects for update using (bucket_id = 'pan_documents' and auth.uid() = owner);

create policy "Allow authenticated users to delete their own pan documents"
on storage.objects for delete using (bucket_id = 'pan_documents' and auth.uid() = owner);

-- RLS Policies for resumes bucket
create policy "Allow authenticated users to upload their own resumes"
on storage.objects for insert with check (bucket_id = 'resumes' and auth.uid() = owner);

create policy "Allow authenticated users to view their own resumes"
on storage.objects for select using (bucket_id = 'resumes' and auth.uid() = owner);

create policy "Allow authenticated users to update their own resumes"
on storage.objects for update using (bucket_id = 'resumes' and auth.uid() = owner);

create policy "Allow authenticated users to delete their own resumes"
on storage.objects for delete using (bucket_id = 'resumes' and auth.uid() = owner);

-- RLS Policies for bank_documents bucket
create policy "Allow authenticated users to upload their own bank documents"
on storage.objects for insert with check (bucket_id = 'bank_documents' and auth.uid() = owner);

create policy "Allow authenticated users to view their own bank documents"
on storage.objects for select using (bucket_id = 'bank_documents' and auth.uid() = owner);

create policy "Allow authenticated users to update their own bank documents"
on storage.objects for update using (bucket_id = 'bank_documents' and auth.uid() = owner);

create policy "Allow authenticated users to delete their own bank documents"
on storage.objects for delete using (bucket_id = 'bank_documents' and auth.uid() = owner);