import { supabase } from '@/lib/supabase';
import { Employee, Project, TeamRecommendation } from '@/types';

// Real API service that connects to Supabase
export const api = {
  // Authentication is handled by AuthContext
  auth: {
    login: async (username: string, password: string) => {
      return { success: true };
    },
    logout: async () => {
      return { success: true };
    },
  },
  
  // Employee endpoints
  employees: {
    getAll: async (): Promise<Employee[]> => {
      try {
        const { data: employees, error } = await supabase
          .from('employees')
          .select('*');
          
        if (error) {
          console.error('Error fetching employees:', error);
          throw error;
        }
        
        if (!employees) {
          return [];
        }
        
        // Fetch project assignments for each employee
        const employeesWithAssignments = await Promise.all(
          employees.map(async (employee) => {
            try {
              const { data: assignments, error: assignmentsError } = await supabase
                .from('project_assignments')
                .select(`
                  id,
                  project_id,
                  role,
                  start_date,
                  end_date,
                  utilization_percentage,
                  projects:project_id(name)
                `)
                .eq('employee_id', employee.id);
                
              if (assignmentsError) {
                console.error('Error fetching assignments:', assignmentsError);
                return {
                  ...employee,
                  projectAssignments: [],
                };
              }
              
              // Format assignments
              const formattedAssignments = assignments ? assignments.map(assignment => ({
                id: assignment.id,
                projectId: assignment.project_id,
                projectName: assignment.projects?.name || 'Unknown Project',
                role: assignment.role,
                startDate: assignment.start_date,
                endDate: assignment.end_date || undefined,
                utilizationPercentage: assignment.utilization_percentage,
              })) : [];
              
              // Get competency matrix
              const { data: competencyData, error: competencyError } = await supabase
                .from('competency_matrices')
                .select('skills')
                .eq('employee_id', employee.id)
                .single();
                
              const competencyMatrix = competencyError ? undefined : competencyData?.skills as Record<string, number>;
              
              // Get retention matrix
              const { data: retentionData, error: retentionError } = await supabase
                .from('retention_matrices')
                .select('factors')
                .eq('employee_id', employee.id)
                .single();
                
              const retentionMatrix = retentionError ? undefined : retentionData?.factors as Record<string, number>;
              
              // Map to our application's Employee type
              return {
                id: employee.id,
                employeeId: employee.employee_id,
                firstName: employee.first_name,
                lastName: employee.last_name,
                email: employee.email,
                department: employee.department,
                position: employee.position,
                managerId: employee.manager_id || undefined,
                mentorId: employee.mentor_id || undefined,
                hireDate: employee.hire_date,
                status: employee.status,
                expectedDepartureDate: employee.expected_departure_date || undefined,
                projectAssignments: formattedAssignments,
                competencyMatrix,
                retentionMatrix,
                notes: employee.notes || undefined,
              };
            } catch (error) {
              console.error('Error processing employee data:', error);
              return {
                id: employee.id,
                employeeId: employee.employee_id,
                firstName: employee.first_name,
                lastName: employee.last_name,
                email: employee.email,
                department: employee.department,
                position: employee.position,
                managerId: employee.manager_id || undefined,
                mentorId: employee.mentor_id || undefined,
                hireDate: employee.hire_date,
                status: employee.status,
                projectAssignments: [],
              };
            }
          })
        );
        
        return employeesWithAssignments;
      } catch (error) {
        console.error('Error in getAll employees:', error);
        return [];
      }
    },
    
    getById: async (id: string): Promise<Employee | null> => {
      const { data: employee, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching employee:', error);
        return null;
      }
      
      // Fetch project assignments
      const { data: assignments, error: assignmentsError } = await supabase
        .from('project_assignments')
        .select(`
          id,
          project_id,
          role,
          start_date,
          end_date,
          utilization_percentage,
          projects(name)
        `)
        .eq('employee_id', employee.id);
        
      const formattedAssignments = !assignmentsError
        ? assignments.map(assignment => ({
            id: assignment.id,
            projectId: assignment.project_id,
            projectName: assignment.projects?.name || 'Unknown Project',
            role: assignment.role,
            startDate: assignment.start_date,
            endDate: assignment.end_date || undefined,
            utilizationPercentage: assignment.utilization_percentage,
          }))
        : [];
        
      // Get competency matrix
      const { data: competencyData, error: competencyError } = await supabase
        .from('competency_matrices')
        .select('skills')
        .eq('employee_id', employee.id)
        .single();
        
      const competencyMatrix = competencyError ? undefined : competencyData?.skills as Record<string, number>;
      
      // Get retention matrix
      const { data: retentionData, error: retentionError } = await supabase
        .from('retention_matrices')
        .select('factors')
        .eq('employee_id', employee.id)
        .single();
        
      const retentionMatrix = retentionError ? undefined : retentionData?.factors as Record<string, number>;
      
      return {
        id: employee.id,
        employeeId: employee.employee_id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        managerId: employee.manager_id || undefined,
        mentorId: employee.mentor_id || undefined,
        hireDate: employee.hire_date,
        status: employee.status,
        expectedDepartureDate: employee.expected_departure_date || undefined,
        projectAssignments: formattedAssignments,
        competencyMatrix,
        retentionMatrix,
        notes: employee.notes || undefined,
      };
    },
    
    getByManager: async (managerId: string): Promise<Employee[]> => {
      const { data: employees, error } = await supabase
        .from('employees')
        .select('*')
        .eq('manager_id', managerId);
        
      if (error) {
        console.error('Error fetching employees by manager:', error);
        return [];
      }
      
      // Use the same pattern as getAll to fetch all related data
      const employeesWithData = await Promise.all(
        employees.map(async (employee) => {
          // This code is similar to getAll, simplified for brevity
          const { data: assignments } = await supabase
            .from('project_assignments')
            .select(`
              id,
              project_id,
              role,
              start_date,
              end_date,
              utilization_percentage,
              projects(name)
            `)
            .eq('employee_id', employee.id);
            
          const formattedAssignments = assignments?.map(assignment => ({
            id: assignment.id,
            projectId: assignment.project_id,
            projectName: assignment.projects?.name || 'Unknown Project',
            role: assignment.role,
            startDate: assignment.start_date,
            endDate: assignment.end_date || undefined,
            utilizationPercentage: assignment.utilization_percentage,
          })) || [];
          
          return {
            id: employee.id,
            employeeId: employee.employee_id,
            firstName: employee.first_name,
            lastName: employee.last_name,
            email: employee.email,
            department: employee.department,
            position: employee.position,
            managerId: employee.manager_id || undefined,
            mentorId: employee.mentor_id || undefined,
            hireDate: employee.hire_date,
            status: employee.status,
            expectedDepartureDate: employee.expected_departure_date || undefined,
            projectAssignments: formattedAssignments,
            notes: employee.notes || undefined,
          };
        })
      );
      
      return employeesWithData;
    },
    
    getByMentor: async (mentorId: string): Promise<Employee[]> => {
      const { data: employees, error } = await supabase
        .from('employees')
        .select('*')
        .eq('mentor_id', mentorId);
        
      if (error) {
        console.error('Error fetching employees by mentor:', error);
        return [];
      }
      
      // Similar implementation as getByManager
      // Simplified for brevity
      return employees.map(employee => ({
        id: employee.id,
        employeeId: employee.employee_id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        managerId: employee.manager_id || undefined,
        mentorId: employee.mentor_id || undefined,
        hireDate: employee.hire_date,
        status: employee.status,
        projectAssignments: [],
      }));
    },
    
    update: async (employee: Employee): Promise<Employee> => {
      // Update the main employee record
      const { error } = await supabase
        .from('employees')
        .update({
          employee_id: employee.employeeId,
          first_name: employee.firstName,
          last_name: employee.lastName,
          email: employee.email,
          department: employee.department,
          position: employee.position,
          manager_id: employee.managerId || null,
          mentor_id: employee.mentorId || null,
          hire_date: employee.hireDate,
          status: employee.status,
          expected_departure_date: employee.expectedDepartureDate || null,
          notes: employee.notes || null,
        })
        .eq('id', employee.id);
        
      if (error) {
        console.error('Error updating employee:', error);
        throw error;
      }
      
      return employee;
    },
    
    updateCompetencyMatrix: async (employeeId: string, matrix: Record<string, number>): Promise<void> => {
      const { error } = await supabase
        .from('competency_matrices')
        .upsert({
          employee_id: employeeId,
          skills: matrix,
          last_updated: new Date().toISOString(),
        }, {
          onConflict: 'employee_id'
        });
        
      if (error) {
        console.error('Error updating competency matrix:', error);
        throw error;
      }
    },
    
    updateRetentionMatrix: async (employeeId: string, matrix: Record<string, number>): Promise<void> => {
      // Calculate risk score (simple average for this example)
      const values = Object.values(matrix);
      const riskScore = values.length > 0 
        ? (values.reduce((sum, value) => sum + value, 0) / values.length) * 20 // Scale to 0-100
        : 0;
        
      const { error } = await supabase
        .from('retention_matrices')
        .upsert({
          employee_id: employeeId,
          factors: matrix,
          risk_score: riskScore,
          last_updated: new Date().toISOString(),
        }, {
          onConflict: 'employee_id'
        });
        
      if (error) {
        console.error('Error updating retention matrix:', error);
        throw error;
      }
    },
  },
  
  // Project endpoints
  projects: {
    getAll: async (): Promise<Project[]> => {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*');
        
      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }
      
      // For each project, get team members
      const projectsWithTeam = await Promise.all(
        projects.map(async (project) => {
          const { data: assignments, error: assignmentsError } = await supabase
            .from('project_assignments')
            .select('employee_id')
            .eq('project_id', project.id);
            
          if (assignmentsError) {
            console.error('Error fetching project assignments:', assignmentsError);
            return {
              id: project.id,
              name: project.name,
              description: project.description,
              startDate: project.start_date,
              endDate: project.end_date || undefined,
              status: project.status,
              teamMembers: [],
              requiredSkills: project.required_skills,
            };
          }
          
          // Fetch team members
          const employeeIds = assignments.map(a => a.employee_id);
          let teamMembers: Employee[] = [];
          
          if (employeeIds.length > 0) {
            const { data: employees, error: employeesError } = await supabase
              .from('employees')
              .select('*')
              .in('id', employeeIds);
              
            if (!employeesError && employees) {
              teamMembers = employees.map(employee => ({
                id: employee.id,
                employeeId: employee.employee_id,
                firstName: employee.first_name,
                lastName: employee.last_name,
                email: employee.email,
                department: employee.department,
                position: employee.position,
                managerId: employee.manager_id || undefined,
                mentorId: employee.mentor_id || undefined,
                hireDate: employee.hire_date,
                status: employee.status,
                projectAssignments: [], // We don't need full assignment data here
              }));
            }
          }
          
          return {
            id: project.id,
            name: project.name,
            description: project.description,
            startDate: project.start_date,
            endDate: project.end_date || undefined,
            status: project.status,
            teamMembers,
            requiredSkills: project.required_skills,
          };
        })
      );
      
      return projectsWithTeam;
    },
    
    getById: async (id: string): Promise<Project | null> => {
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error('Error fetching project:', error);
        return null;
      }
      
      // Similar to getAll, fetch team members
      // Simplified for brevity
      
      return {
        id: project.id,
        name: project.name,
        description: project.description,
        startDate: project.start_date,
        endDate: project.end_date || undefined,
        status: project.status,
        teamMembers: [], // Would fetch team members in a real implementation
        requiredSkills: project.required_skills,
      };
    },
    
    update: async (project: Project): Promise<Project> => {
      const { error } = await supabase
        .from('projects')
        .update({
          name: project.name,
          description: project.description,
          start_date: project.startDate,
          end_date: project.endDate || null,
          status: project.status,
          required_skills: project.requiredSkills,
        })
        .eq('id', project.id);
        
      if (error) {
        console.error('Error updating project:', error);
        throw error;
      }
      
      return project;
    },
  },
  
  // AI recommendations - this would be implemented as a Supabase Edge Function
  recommendations: {
    getTeamRecommendations: async (projectId: string): Promise<TeamRecommendation> => {
      // This would call a Supabase Edge Function that implements the AI logic
      // For now, we'll use a simplified implementation
      
      // Get project details
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('required_skills')
        .eq('id', projectId)
        .single();
        
      if (projectError) {
        console.error('Error fetching project for recommendations:', projectError);
        throw projectError;
      }
      
      // Get employees with matching skills
      // In a real implementation, this would be more sophisticated
      const { data: employees, error: employeesError } = await supabase
        .from('employees')
        .select('*')
        .eq('status', 'active');
        
      if (employeesError) {
        console.error('Error fetching employees for recommendations:', employeesError);
        throw employeesError;
      }
      
      // Get competency matrices
      const { data: matrices, error: matricesError } = await supabase
        .from('competency_matrices')
        .select('employee_id, skills');
        
      if (matricesError) {
        console.error('Error fetching competency matrices:', matricesError);
        throw matricesError;
      }
      
      // Match employees to skills (simplified)
      const matchedEmployees = employees.filter(employee => {
        const matrix = matrices.find(m => m.employee_id === employee.id);
        if (!matrix) return false;
        
        // Check if employee has any of the required skills
        const skills = matrix.skills as Record<string, number>;
        return project.required_skills.some(skill => 
          skills[skill] && skills[skill] >= 3
        );
      });
      
      // Sort by match quality (simplified)
      const sortedEmployees = [...matchedEmployees].sort((a, b) => {
        const matrixA = matrices.find(m => m.employee_id === a.id);
        const matrixB = matrices.find(m => m.employee_id === b.id);
        
        if (!matrixA || !matrixB) return 0;
        
        const skillsA = matrixA.skills as Record<string, number>;
        const skillsB = matrixB.skills as Record<string, number>;
        
        const scoreA = project.required_skills.reduce((sum, skill) => sum + (skillsA[skill] || 0), 0);
        const scoreB = project.required_skills.reduce((sum, skill) => sum + (skillsB[skill] || 0), 0);
        
        return scoreB - scoreA;
      });
      
      // Convert to our application's Employee type
      const recommendedEmployees = sortedEmployees.slice(0, 3).map(employee => ({
        id: employee.id,
        employeeId: employee.employee_id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        managerId: employee.manager_id || undefined,
        mentorId: employee.mentor_id || undefined,
        hireDate: employee.hire_date,
        status: employee.status,
        projectAssignments: [], // Simplified, would fetch in real implementation
      }));
      
      const alternativeEmployees = sortedEmployees.slice(3).map(employee => ({
        id: employee.id,
        employeeId: employee.employee_id,
        firstName: employee.first_name,
        lastName: employee.last_name,
        email: employee.email,
        department: employee.department,
        position: employee.position,
        managerId: employee.manager_id || undefined,
        mentorId: employee.mentor_id || undefined,
        hireDate: employee.hire_date,
        status: employee.status,
        projectAssignments: [], // Simplified, would fetch in real implementation
      }));
      
      // Generate reasoning (simplified)
      const reasonings: Record<string, string> = {};
      recommendedEmployees.forEach(employee => {
        const matrix = matrices.find(m => m.employee_id === employee.id);
        if (!matrix) return;
        
        const skills = matrix.skills as Record<string, number>;
        const matchedSkills = project.required_skills.filter(skill => skills[skill] && skills[skill] >= 4);
        
        reasonings[employee.id] = `${employee.firstName} ${employee.lastName} has strong skills in ${matchedSkills.join(', ')}`;
      });
      
      return {
        projectId,
        recommendedEmployees,
        reasonings,
        alternativeEmployees,
        confidenceScore: 85, // Fixed value for now
      };
    },
  },
  
  // File operations (would use Supabase Storage and Edge Functions)
  files: {
    uploadCompetencyMatrix: async (file: File): Promise<{ success: boolean; message: string; }> => {
      // In a real implementation, this would:
      // 1. Upload the file to Supabase Storage
      // 2. Trigger a function to process the file
      // 3. Update the competency_matrices table
      
      // Simplified implementation
      return {
        success: true,
        message: 'Competency matrix uploaded and processed successfully',
      };
    },
    
    uploadRetentionMatrix: async (file: File): Promise<{ success: boolean; message: string; }> => {
      // Similar to uploadCompetencyMatrix
      return {
        success: true,
        message: 'Retention matrix uploaded and processed successfully',
      };
    },
    
    uploadILBAMTalentPool: async (file: File): Promise<{ success: boolean; message: string; }> => {
      // Similar to uploadCompetencyMatrix
      return {
        success: true,
        message: 'ILBAM talent pool data uploaded and processed successfully',
      };
    },
  },
};
