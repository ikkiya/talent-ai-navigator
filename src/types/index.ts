
export type UserRole = 'admin' | 'manager' | 'mentor';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  managerId?: string;
  mentorId?: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'onLeave';
  expectedDepartureDate?: string;
  projectAssignments: ProjectAssignment[];
  competencyMatrix?: Record<string, number>;
  retentionMatrix?: Record<string, number>;
  notes?: string;
}

export interface ProjectAssignment {
  id: string;
  projectId: string;
  projectName: string;
  role: string;
  startDate: string;
  endDate?: string;
  utilizationPercentage: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: 'planning' | 'active' | 'completed' | 'onHold';
  teamMembers: Employee[];
  requiredSkills: string[];
}

export interface CompetencyMatrix {
  employeeId: string;
  skills: Record<string, number>; // skill name -> rating (0-5)
  lastUpdated: string;
}

export interface RetentionMatrix {
  employeeId: string;
  factors: Record<string, number>; // factor name -> rating (0-5)
  riskScore: number; // 0-100
  lastUpdated: string;
}

export interface TeamRecommendation {
  projectId: string;
  recommendedEmployees: Employee[];
  reasonings: Record<string, string>; // employeeId -> reasoning
  alternativeEmployees: Employee[];
  confidenceScore: number; // 0-100
}
