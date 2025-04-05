
import { supabase } from '@/lib/supabase';
import { TeamRecommendation, Employee } from '@/types';
import { api } from './index';

// Mock implementation for team recommendations
export const getTeamRecommendations = async (projectId: string): Promise<TeamRecommendation> => {
  try {
    // Get the project to find required skills
    const project = await api.projects.getAll().then(projects => 
      projects.find(p => p.id === projectId)
    );
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Get all employees for recommendation
    const allEmployees = await api.employees.getAll();
    
    // Filter employees based on skills match
    const recommendedEmployees = allEmployees.filter(employee => {
      if (!employee.competencyMatrix) return false;
      
      // Check if employee has at least one required skill from the project
      return project.requiredSkills.some(skill => 
        employee.competencyMatrix && 
        employee.competencyMatrix[skill] && 
        employee.competencyMatrix[skill] >= 3
      );
    });
    
    // Find some alternative employees with partial matches
    const alternativeEmployees = allEmployees.filter(employee => {
      if (recommendedEmployees.includes(employee)) return false;
      if (!employee.competencyMatrix) return false;
      
      // Check if employee has at least one required skill but with lower proficiency
      return project.requiredSkills.some(skill => 
        employee.competencyMatrix && 
        employee.competencyMatrix[skill] && 
        employee.competencyMatrix[skill] >= 1 && 
        employee.competencyMatrix[skill] < 3
      );
    }).slice(0, 3);
    
    // Create reasoning for recommendations
    const reasonings: Record<string, string> = {};
    recommendedEmployees.forEach(employee => {
      const matchedSkills = project.requiredSkills.filter(skill => 
        employee.competencyMatrix && 
        employee.competencyMatrix[skill] && 
        employee.competencyMatrix[skill] >= 3
      );
      
      reasonings[employee.id] = `${employee.firstName} has strong proficiency in ${matchedSkills.join(', ')}, which are key skills required for this project.`;
    });
    
    return {
      projectId,
      recommendedEmployees,
      alternativeEmployees,
      reasonings,
      confidenceScore: 85,
    };
  } catch (error) {
    console.error('Error in getTeamRecommendations:', error);
    return {
      projectId,
      recommendedEmployees: [],
      alternativeEmployees: [],
      reasonings: {},
      confidenceScore: 0,
    };
  }
};
