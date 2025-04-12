
-- Create function to get all users from profiles table
CREATE OR REPLACE FUNCTION public.get_all_users()
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    json_build_object(
      'id', p.id,
      'email', a.email,
      'first_name', p.first_name,
      'last_name', p.last_name,
      'role', p.role,
      'is_active', true,
      'last_login', a.last_sign_in_at
    )
  FROM auth.users a
  LEFT JOIN public.profiles p ON a.id = p.id;
END;
$$;

-- Create function to get pending users
CREATE OR REPLACE FUNCTION public.get_pending_users()
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    json_build_object(
      'id', p.id,
      'email', a.email,
      'first_name', p.first_name,
      'last_name', p.last_name,
      'role', p.role,
      'is_active', false,
      'last_login', a.last_sign_in_at
    )
  FROM auth.users a
  LEFT JOIN public.profiles p ON a.id = p.id
  WHERE a.confirmed_at IS NULL OR p.role IS NULL;
END;
$$;

-- Create function to approve a user
CREATE OR REPLACE FUNCTION public.approve_user(user_id UUID, user_role TEXT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the user's role in the profiles table
  UPDATE public.profiles
  SET role = user_role
  WHERE id = user_id;
END;
$$;

-- Create function to assign mentor role
CREATE OR REPLACE FUNCTION public.assign_mentor_role(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the user's role to mentor in the profiles table
  UPDATE public.profiles
  SET role = 'mentor'
  WHERE id = user_id;
END;
$$;
