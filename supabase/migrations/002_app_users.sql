-- FieldOps account table. Run after 001_initial_schema.sql.
CREATE TABLE IF NOT EXISTS public.app_users (
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name TEXT NOT NULL,
 email TEXT NOT NULL UNIQUE,
 password_hash TEXT NOT NULL,
 created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
-- Access is performed only by the Express server using the service-role key.
