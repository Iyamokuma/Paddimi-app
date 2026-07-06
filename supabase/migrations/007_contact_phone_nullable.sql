-- Allow email-only customers (phone optional when email delivery is selected)
alter table service_requests alter column contact_phone drop not null;
