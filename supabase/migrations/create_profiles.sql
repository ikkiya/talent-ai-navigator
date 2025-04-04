
-- Check if the profiles table already exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    -- Create profiles table for user authentication
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
      first_name TEXT,
      last_name TEXT,
      avatar_url TEXT,
      role TEXT DEFAULT 'manager'::TEXT CHECK (role IN ('admin', 'manager', 'mentor'))
    );

    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Users can view their own profile" ON public.profiles
      FOR SELECT USING (auth.uid() = id);
    CREATE POLICY "Users can update their own profile" ON public.profiles
      FOR UPDATE USING (auth.uid() = id);

    -- Function to handle new user creation
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.profiles (id, first_name, last_name, avatar_url, role)
      VALUES (
        NEW.id,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'avatar_url',
        COALESCE(NEW.raw_user_meta_data->>'role', 'manager')
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Trigger to create a profile when a new user is created
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END
$$;
