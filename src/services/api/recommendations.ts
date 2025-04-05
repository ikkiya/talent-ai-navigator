
import { TeamRecommendation } from '@/types';
import { getAll as getAllEmployees } from './employees';
import { getById as getProjectById } from './projects';

// This is a mock implementation, would be replaced by real API calls
export const getTeamRecommendations = async (projectId: string): Promise<TeamRecommendation> => {
  // In a real implementation, this would call a backend API or service
  // For now, we're creating mock data
  const employees = await getAllEmployees();
  
  // Randomly select some employees as recommended and some as alternatives
  const shuffled = [...employees].sort(() => 0.5 - Math.random());
  const recommendedEmployees = shuffled.slice(0, 3);
  const alternativeEmployees = shuffled.slice(3, 6);
  
  // Create mock reasonings
  const reasonings: Record<string, string> = {};
  recommendedEmployees.forEach(emp => {
    reasonings[emp.id] = `${emp.firstName} has the required skills and experience for this project.`;
  });
  
  return {
    projectId,
    recommendedEmployees,
    alternativeEmployees,
    reasonings,
    confidenceScore: Math.floor(Math.random() * 30) + 70, // Random score between 70-99
  };
};
