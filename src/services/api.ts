
import { Employee, Project, CompetencyMatrix, RetentionMatrix, TeamRecommendation } from '@/types';

// This is a mock API service for development - in production this would connect to your Java backend

// Mock data
const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    managerId: '2',
    mentorId: '3',
    hireDate: '2020-01-15',
    status: 'active',
    projectAssignments: [
      {
        id: '1',
        projectId: '1',
        projectName: 'Project Alpha',
        role: 'Frontend Developer',
        startDate: '2022-03-01',
        utilizationPercentage: 80,
      }
    ],
    competencyMatrix: {
      'JavaScript': 4,
      'React': 5,
      'NodeJS': 3,
      'Java': 2,
      'Python': 3,
      'AWS': 4,
    },
    retentionMatrix: {
      'Career Growth': 3,
      'Compensation': 4,
      'Work-Life Balance': 2,
      'Team Dynamics': 4,
      'Job Satisfaction': 3,
    },
    notes: 'Strong performer, interested in architecture role',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Bob',
    lastName: 'Smith',
    email: 'bob.smith@company.com',
    department: 'Engineering',
    position: 'DevOps Engineer',
    managerId: '2',
    hireDate: '2019-06-20',
    status: 'active',
    projectAssignments: [
      {
        id: '2',
        projectId: '1',
        projectName: 'Project Alpha',
        role: 'DevOps Engineer',
        startDate: '2022-01-15',
        utilizationPercentage: 100,
      }
    ],
    competencyMatrix: {
      'AWS': 5,
      'Docker': 5,
      'Kubernetes': 4,
      'Python': 3,
      'Linux': 5,
      'CI/CD': 4,
    },
    retentionMatrix: {
      'Career Growth': 2,
      'Compensation': 3,
      'Work-Life Balance': 4,
      'Team Dynamics': 3,
      'Job Satisfaction': 3,
    },
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Carol',
    lastName: 'Williams',
    email: 'carol.williams@company.com',
    department: 'Engineering',
    position: 'Backend Developer',
    managerId: '2',
    mentorId: '3',
    hireDate: '2021-02-10',
    status: 'active',
    projectAssignments: [
      {
        id: '3',
        projectId: '2',
        projectName: 'Project Beta',
        role: 'Backend Developer',
        startDate: '2022-02-01',
        utilizationPercentage: 90,
      }
    ],
    competencyMatrix: {
      'Java': 5,
      'Spring': 4,
      'SQL': 4,
      'Microservices': 3,
      'Kafka': 2,
      'Docker': 3,
    },
    retentionMatrix: {
      'Career Growth': 4,
      'Compensation': 2,
      'Work-Life Balance': 3,
      'Team Dynamics': 5,
      'Job Satisfaction': 4,
    },
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'David',
    lastName: 'Miller',
    email: 'david.miller@company.com',
    department: 'Engineering',
    position: 'QA Engineer',
    managerId: '2',
    hireDate: '2020-09-05',
    status: 'active',
    expectedDepartureDate: '2023-12-31',
    projectAssignments: [
      {
        id: '4',
        projectId: '2',
        projectName: 'Project Beta',
        role: 'QA Engineer',
        startDate: '2022-01-10',
        utilizationPercentage: 100,
      }
    ],
    competencyMatrix: {
      'Manual Testing': 5,
      'Automation Testing': 4,
      'Selenium': 4,
      'API Testing': 3,
      'Python': 2,
      'JIRA': 5,
    },
    retentionMatrix: {
      'Career Growth': 1,
      'Compensation': 2,
      'Work-Life Balance': 3,
      'Team Dynamics': 4,
      'Job Satisfaction': 2,
    },
    notes: 'Looking for new opportunities outside the company',
  },
  {
    id: '5',
    employeeId: 'EMP005',
    firstName: 'Eve',
    lastName: 'Davis',
    email: 'eve.davis@company.com',
    department: 'Engineering',
    position: 'UX Designer',
    managerId: '2',
    mentorId: '3',
    hireDate: '2021-08-15',
    status: 'active',
    projectAssignments: [
      {
        id: '5',
        projectId: '3',
        projectName: 'Project Gamma',
        role: 'UX Designer',
        startDate: '2022-04-01',
        utilizationPercentage: 75,
      }
    ],
    competencyMatrix: {
      'UI Design': 5,
      'UX Research': 4,
      'Figma': 5,
      'Adobe XD': 3,
      'Sketch': 4,
      'Design Systems': 3,
    },
    retentionMatrix: {
      'Career Growth': 5,
      'Compensation': 3,
      'Work-Life Balance': 4,
      'Team Dynamics': 5,
      'Job Satisfaction': 4,
    },
    notes: 'Strong performer, requesting more UX research opportunities',
  },
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Project Alpha',
    description: 'Customer portal redesign with new features',
    startDate: '2022-01-01',
    endDate: '2023-06-30',
    status: 'active',
    teamMembers: [
      mockEmployees[0],
      mockEmployees[1],
    ],
    requiredSkills: ['JavaScript', 'React', 'Node.js', 'AWS', 'DevOps'],
  },
  {
    id: '2',
    name: 'Project Beta',
    description: 'Internal tools modernization',
    startDate: '2022-02-01',
    endDate: '2023-12-31',
    status: 'active',
    teamMembers: [
      mockEmployees[2],
      mockEmployees[3],
    ],
    requiredSkills: ['Java', 'Spring', 'SQL', 'Testing', 'Microservices'],
  },
  {
    id: '3',
    name: 'Project Gamma',
    description: 'Mobile app redesign',
    startDate: '2022-04-01',
    endDate: '2023-10-31',
    status: 'active',
    teamMembers: [
      mockEmployees[4],
    ],
    requiredSkills: ['UI Design', 'UX Research', 'Figma', 'Mobile Design'],
  },
  {
    id: '4',
    name: 'Project Delta',
    description: 'New AI feature development',
    startDate: '2023-01-01',
    status: 'planning',
    teamMembers: [],
    requiredSkills: ['Machine Learning', 'Python', 'NLP', 'Data Science', 'Frontend Integration'],
  },
];

// API Endpoints
export const api = {
  // Authentication - would be JWT in production
  auth: {
    login: async (username: string, password: string) => {
      // This would be handled by the AuthContext, but included here for completeness
      return { success: true };
    },
    logout: async () => {
      return { success: true };
    },
  },
  
  // Employee endpoints
  employees: {
    getAll: async (): Promise<Employee[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      return [...mockEmployees];
    },
    
    getById: async (id: string): Promise<Employee | null> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockEmployees.find(e => e.id === id) || null;
    },
    
    getByManager: async (managerId: string): Promise<Employee[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockEmployees.filter(e => e.managerId === managerId);
    },
    
    getByMentor: async (mentorId: string): Promise<Employee[]> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockEmployees.filter(e => e.mentorId === mentorId);
    },
    
    update: async (employee: Employee): Promise<Employee> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = mockEmployees.findIndex(e => e.id === employee.id);
      if (index !== -1) {
        mockEmployees[index] = employee;
      }
      return employee;
    },
    
    updateCompetencyMatrix: async (employeeId: string, matrix: Record<string, number>): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const employee = mockEmployees.find(e => e.id === employeeId);
      if (employee) {
        employee.competencyMatrix = matrix;
      }
    },
    
    updateRetentionMatrix: async (employeeId: string, matrix: Record<string, number>): Promise<void> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const employee = mockEmployees.find(e => e.id === employeeId);
      if (employee) {
        employee.retentionMatrix = matrix;
      }
    },
  },
  
  // Project endpoints
  projects: {
    getAll: async (): Promise<Project[]> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      return [...mockProjects];
    },
    
    getById: async (id: string): Promise<Project | null> => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockProjects.find(p => p.id === id) || null;
    },
    
    update: async (project: Project): Promise<Project> => {
      await new Promise(resolve => setTimeout(resolve, 800));
      const index = mockProjects.findIndex(p => p.id === project.id);
      if (index !== -1) {
        mockProjects[index] = project;
      }
      return project;
    },
  },
  
  // AI recommendations
  recommendations: {
    getTeamRecommendations: async (projectId: string): Promise<TeamRecommendation> => {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Longer delay to simulate AI processing
      
      // Find project to get required skills
      const project = mockProjects.find(p => p.id === projectId);
      if (!project) {
        throw new Error('Project not found');
      }
      
      // Find available employees with matching skills
      const availableEmployees = mockEmployees.filter(e => {
        if (!e.competencyMatrix) return false;
        
        // Check if employee has at least some of the required skills
        const hasRequiredSkills = project.requiredSkills.some(skill => 
          e.competencyMatrix && 
          Object.keys(e.competencyMatrix).includes(skill) && 
          e.competencyMatrix[skill] >= 3
        );
        
        // Check if employee is not overallocated
        const notOverallocated = e.projectAssignments.reduce(
          (total, assignment) => total + assignment.utilizationPercentage, 
          0
        ) <= 80;
        
        return hasRequiredSkills && notOverallocated;
      });
      
      // Generate mock recommendation
      const mockRecommendation: TeamRecommendation = {
        projectId,
        recommendedEmployees: availableEmployees.slice(0, 3),
        reasonings: availableEmployees.slice(0, 3).reduce((acc, emp) => {
          acc[emp.id] = `${emp.firstName} ${emp.lastName} has strong skills in ${
            project.requiredSkills.filter(
              skill => emp.competencyMatrix && emp.competencyMatrix[skill] >= 4
            ).join(', ')
          }`;
          return acc;
        }, {} as Record<string, string>),
        alternativeEmployees: availableEmployees.slice(3),
        confidenceScore: 85,
      };
      
      return mockRecommendation;
    },
  },
  
  // File operations
  files: {
    uploadCompetencyMatrix: async (file: File): Promise<{ success: boolean; message: string; }> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, this would parse the Excel file and update the database
      return {
        success: true,
        message: 'Competency matrix uploaded and processed successfully',
      };
    },
    
    uploadRetentionMatrix: async (file: File): Promise<{ success: boolean; message: string; }> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, this would parse the Excel file and update the database
      return {
        success: true,
        message: 'Retention matrix uploaded and processed successfully',
      };
    },
    
    uploadILBAMTalentPool: async (file: File): Promise<{ success: boolean; message: string; }> => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      // In a real app, this would parse the Excel file and update the database
      return {
        success: true,
        message: 'ILBAM talent pool data uploaded and processed successfully',
      };
    },
  },
};
