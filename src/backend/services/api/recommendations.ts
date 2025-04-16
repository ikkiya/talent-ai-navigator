
import { TeamRecommendation } from '@/types';

const API_URL = 'http://localhost:8080/api';

// Get all recommendations
export const getAll = async (): Promise<TeamRecommendation[]> => {
  try {
    const response = await fetch(`${API_URL}/recommendations`);
    
    if (!response.ok) {
      throw new Error(`Error fetching recommendations: ${response.statusText}`);
    }
    
    const data = await response.json() as TeamRecommendation[];
    
    return data;
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    return [];
  }
};

// Get team recommendations by project ID
export const getTeamRecommendations = async (projectId: string): Promise<TeamRecommendation> => {
  try {
    const response = await fetch(`${API_URL}/recommendations/project/${projectId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching recommendations: ${response.statusText}`);
    }
    
    const data = await response.json() as TeamRecommendation;
    
    return data;
  } catch (error) {
    console.error('Error in getTeamRecommendations:', error);
    return {
      id: '',
      projectId,
      recommendedEmployees: [],
      alternativeEmployees: [],
      reasonings: {},
      confidenceScore: 0,
    };
  }
};

// Get recommendations by employee ID
export const getByEmployeeId = async (employeeId: string): Promise<TeamRecommendation[]> => {
  try {
    const response = await fetch(`${API_URL}/recommendations/employee/${employeeId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching recommendations: ${response.statusText}`);
    }
    
    const data = await response.json() as TeamRecommendation[];
    
    return data;
  } catch (error) {
    console.error(`Error fetching recommendations for employee ${employeeId}:`, error);
    return [];
  }
};
