
-- Create profiles table to store user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  role TEXT DEFAULT 'manager',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Set up secure policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profiles"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Create a trigger to create profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (new.id, '', '');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create initial admin user if it doesn't exist
DO $$
BEGIN
  -- Check if we need to create demo accounts
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@company.com') THEN
    -- We need to insert directly into auth.users using a function with proper permissions
    -- This is just a placeholder - you would need to create users through Supabase dashboard 
    -- or through the API with proper password hashing
    NULL;
  END IF;
END
$$;

-- Add sample profiles for our demo accounts if needed
INSERT INTO public.profiles (id, first_name, last_name, role)
SELECT id, 'Admin', 'User', 'admin'
FROM auth.users
WHERE email = 'admin@company.com'
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.users.id);

INSERT INTO public.profiles (id, first_name, last_name, role)
SELECT id, 'Manager', 'User', 'manager'
FROM auth.users
WHERE email = 'manager@company.com'
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.users.id);

INSERT INTO public.profiles (id, first_name, last_name, role)
SELECT id, 'Mentor', 'User', 'mentor'
FROM auth.users
WHERE email = 'mentor@company.com'
AND NOT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.users.id);
