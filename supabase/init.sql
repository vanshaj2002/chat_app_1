-- This script initializes the database schema and sets up the necessary tables and permissions

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS public;

-- Run the main migration
\i supabase/migrations/20230521000000_create_tables.sql

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to handle new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create a function to get the current user's chats
CREATE OR REPLACE FUNCTION public.get_user_chats()
RETURNS TABLE (
  id UUID,
  name TEXT,
  is_group BOOLEAN,
  last_message TEXT,
  last_message_at TIMESTAMP WITH TIME ZONE,
  unread_count INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.name,
    c.is_group,
    m.content AS last_message,
    m.created_at AS last_message_at,
    (
      SELECT COUNT(*) 
      FROM public.messages m2
      WHERE m2.chat_id = c.id 
      AND NOT (m2.read_by ? auth.uid()::TEXT)
      AND m2.sender_id != auth.uid()
    ) AS unread_count
  FROM public.chats c
  JOIN public.chat_members cm ON cm.chat_id = c.id
  LEFT JOIN LATERAL (
    SELECT * 
    FROM public.messages m
    WHERE m.chat_id = c.id
    ORDER BY m.created_at DESC
    LIMIT 1
  ) m ON true
  WHERE cm.user_id = auth.uid()
  ORDER BY COALESCE(m.created_at, c.updated_at) DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- Set up realtime for the messages table
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Enable RLS on all tables
ALTER TABLE public.users FORCE ROW LEVEL SECURITY;
ALTER TABLE public.chats FORCE ROW LEVEL SECURITY;
ALTER TABLE public.chat_members FORCE ROW LEVEL SECURITY;
ALTER TABLE public.messages FORCE ROW LEVEL SECURITY;
