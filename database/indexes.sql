-- Create indexes for better performance
create index gigs_user_id_index on public.gigs(user_id);
create index gigs_category_id_index on public.gigs(category_id);
create index proposals_gig_id_index on public.proposals(gig_id);
create index proposals_user_id_index on public.proposals(user_id);
create index messages_sender_receiver_index on public.messages(sender_id, receiver_id);
create index notifications_user_id_index on public.notifications(user_id);