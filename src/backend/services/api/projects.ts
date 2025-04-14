import { supabase } from '@/lib/supabase';
import { Project } from '@/types';

// Helper function to map database types to application types
function mapDbProjectToProject(dbProject: any): Project {
  return {
    id: dbProject.id,
    name: dbProject.name,
    description: dbProject.description,
    startDate: dbProject.start_date,
    endDate: dbProject.end_date || undefined,
    status: dbProject.status as 'planning' | 'active' | 'completed' | 'onHold',
    teamMembers: dbProject.teamMembers || [],
    requiredSkills: dbProject.required_skills || []
  };
}

export const getAll = async (): Promise<Project[]> => {
  try {
    const { data: projectsData, error } = await supabase
      .from('projects')
      .select('*');

    if (error) {
      console.error('Error fetching projects:', error);
      return [];
    }

    return projectsData.map(mapDbProjectToProject);
  } catch (error) {
    console.error('Error in getProjects:', error);
    return [];
  }
};

export const getActive = async (): Promise<Project[]> => {
  try {
    const { data: projectsData, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching active projects:', error);
      return [];
    }
    
    return projectsData.map(mapDbProjectToProject);
  } catch (error) {
    console.error('Error in getActiveProjects:', error);
    return [];
  }
};
