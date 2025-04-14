
export type UserRole = 'admin' | 'manager' | 'mentor';
export type UserStatus = 'active' | 'inactive' | 'invited';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  lastLogin?: string | null;
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
  location: string; // Add the missing location property
  managerId?: string;
  mentorId?: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'onLeave';
  expectedDepartureDate?: string;
  projectAssignments: ProjectAssignment[];
  competencyMatrix?: Record<string, number>;
  retentionMatrix?: Record<string, number>;
  ilbamMatrix?: IlbamMatrix;
  notes?: string;
}

export interface IlbamMatrix {
  id: string;
  employeeId: string;
  businessUnderstanding: number;
  leadership: number;
  innovationCapability: number;
  teamwork: number;
  adaptability: number;
  motivation: number;
  lastUpdated: string;
  updatedBy: string;
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

// New types for matrix visualization
export interface MatrixColumn {
  key: string;
  label: string;
  category?: string;
}

export interface MatrixLevel {
  value: number;
  label: string;
  color: string;
  description: string;
}

export const MATRIX_LEVELS: MatrixLevel[] = [
  { value: 1, label: 'Notion', color: '#FF6B6B', description: 'Aucune ou très faibles connaissances sur la compétence courante, n\'a jamais ou a peu utilisé la compétence courante sur un projet en production' },
  { value: 2, label: 'Débutant', color: '#FFD166', description: 'Connaissances acquises lors de formations, n\'a jamais ou a peu utilisé la compétance courante sur un projet en production' },
  { value: 3, label: 'Moyen', color: '#F8F9FA', description: 'Connaissances pratiquées, capable de comprendre et d\'intervenir mais avec le support d\'une ressource confirmée' },
  { value: 4, label: 'Autonome', color: '#A0C4FF', description: 'Connaissances confirmées, capable de former d\'autres ressources sur la technologie courante' },
  { value: 5, label: 'Expert', color: '#9BE8A8', description: 'Connaissances pointues, a déjà intervenu dans le cadre d\'architectures complexes faisant appel à la technologie courante' },
];

// Categories for the competency matrix based on the example
export const COMPETENCY_CATEGORIES = {
  devSecOps: 'DevSecOps',
  dataManagement: 'Data Management',
  dataScience: 'Data Science',
  coding: 'Coding styles',
  systems: 'Systèmes'
};

// Risk levels for retention matrix
export const RETENTION_RISK_LEVELS = {
  high: { value: 'high', color: '#FF6B6B', label: 'Risque élevé' },
  medium: { value: 'medium', color: '#FFD166', label: 'Risque moyen' },
  low: { value: 'low', color: '#9BE8A8', label: 'Risque faible' },
};
