
-- This file contains all migrations to be run against the Supabase project
\i 'supabase/migrations/create_profiles.sql'

-- Create the User table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the Manager table
CREATE TABLE IF NOT EXISTS public.managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  responsibility TEXT,
  team_name TEXT,
  is_active BOOLEAN DEFAULT true,
  notification_setting TEXT
);

-- Create the Competences table
CREATE TABLE IF NOT EXISTS public.competences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Create the CollaboratorCompetences junction table
CREATE TABLE IF NOT EXISTS public.collaborator_competences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaborator_id UUID NOT NULL,
  competence_id UUID NOT NULL REFERENCES public.competences(id) ON DELETE CASCADE,
  proficiency_level INTEGER CHECK (proficiency_level >= 0 AND proficiency_level <= 5),
  date_acquired TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(collaborator_id, competence_id)
);

-- Create the Collaborators table
CREATE TABLE IF NOT EXISTS public.collaborators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  manager_id UUID REFERENCES public.managers(id) ON DELETE SET NULL,
  date_hired TIMESTAMP WITH TIME ZONE,
  job_title TEXT,
  department TEXT,
  level TEXT,
  years_experience INTEGER,
  is_active BOOLEAN DEFAULT true
);

-- Add foreign key to collaborator_competences after creating the collaborators table
ALTER TABLE public.collaborator_competences
  ADD CONSTRAINT fk_collaborator 
  FOREIGN KEY (collaborator_id) 
  REFERENCES public.collaborators(id) 
  ON DELETE CASCADE;

-- Create the Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT CHECK (status IN ('planning', 'active', 'completed', 'on_hold')),
  manager_id UUID REFERENCES public.managers(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true
);

-- Create the CollaboratorProjects junction table
CREATE TABLE IF NOT EXISTS public.collaborator_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaborator_id UUID NOT NULL REFERENCES public.collaborators(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  role TEXT,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  allocation_percentage INTEGER CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
  UNIQUE(collaborator_id, project_id)
);

-- Create the Mission table
CREATE TABLE IF NOT EXISTS public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  responsibility TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  status TEXT,
  notification_setting TEXT,
  is_active BOOLEAN DEFAULT true
);

-- Create the CollaborationMatrix table
CREATE TABLE IF NOT EXISTS public.collaboration_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collaborator_id UUID NOT NULL REFERENCES public.collaborators(id) ON DELETE CASCADE,
  matrix_data JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_specific TEXT,
  status TEXT
);

-- Add Row Level Security (RLS) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborator_competences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborator_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_matrix ENABLE ROW LEVEL SECURITY;

-- Create policies for Users
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Create policies for Managers
CREATE POLICY "Managers can view" ON public.managers
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin' 
      UNION SELECT user_id FROM public.managers
    )
  );

-- Create policies for Collaborators
CREATE POLICY "Managers can view their collaborators" ON public.collaborators
  FOR SELECT USING (
    auth.uid() IN (
      SELECT id FROM public.users WHERE role = 'admin'
      UNION SELECT user_id FROM public.managers WHERE id = manager_id
    )
  );

-- Create policies for Projects
CREATE POLICY "Anyone can view projects" ON public.projects
  FOR SELECT USING (true);

CREATE POLICY "Managers can update their projects" ON public.projects
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM public.managers WHERE id = manager_id
    )
  );

-- Ensure we have some default data
INSERT INTO public.competences (name, description, category)
VALUES 
  ('JavaScript', 'Programming language for the web', 'Technical'),
  ('React', 'Frontend JavaScript library', 'Technical'),
  ('Node.js', 'JavaScript runtime for server-side applications', 'Technical'),
  ('Project Management', 'Skills related to managing projects', 'Soft Skills'),
  ('Communication', 'Effective communication skills', 'Soft Skills')
ON CONFLICT DO NOTHING;

