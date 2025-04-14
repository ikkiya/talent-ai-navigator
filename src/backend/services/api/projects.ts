
import { Project } from '@/types';

const API_URL = 'http://localhost:8080/api';

export const getAll = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_URL}/projects`);
    
    if (!response.ok) {
      throw new Error(`Error fetching projects: ${response.statusText}`);
    }
    
    const data = await response.json() as Project[];
    
    return data;
  } catch (error) {
    console.error('Error in getProjects:', error);
    return [];
  }
};

export const getActive = async (): Promise<Project[]> => {
  try {
    const response = await fetch(`${API_URL}/projects/active`);
    
    if (!response.ok) {
      throw new Error(`Error fetching active projects: ${response.statusText}`);
    }
    
    const data = await response.json() as Project[];
    
    return data;
  } catch (error) {
    console.error('Error in getActiveProjects:', error);
    return [];
  }
};
