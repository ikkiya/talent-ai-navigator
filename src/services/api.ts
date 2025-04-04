import { supabase } from '@/lib/supabase';
import { Employee, Project } from '@/types';

// Add these helper functions to map database types to application types
function mapDbEmployeeToEmployee(dbEmployee: any): Employee {
  return {
    id: dbEmployee.id,
    employeeId: dbEmployee.employee_id,
    firstName: dbEmployee.first_name,
    lastName: dbEmployee.last_name,
    email: dbEmployee.email,
    department: dbEmployee.department,
    position: dbEmployee.position,
    managerId: dbEmployee.manager_id || undefined,
    mentorId: dbEmployee.mentor_id || undefined,
    hireDate: dbEmployee.hire_date,
    status: dbEmployee.status as 'active' | 'inactive' | 'onLeave',
    expectedDepartureDate: dbEmployee.expected_departure_date || undefined,
    projectAssignments: dbEmployee.projectAssignments || [],
    notes: dbEmployee.notes || '',
    competencyMatrix: dbEmployee.competencyMatrix,
    retentionMatrix: dbEmployee.retentionMatrix
  };
}

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

// Update the getEmployees function
export const getEmployees = async (): Promise<Employee[]> => {
  try {
    const { data: empData, error } = await supabase
      .from('employees')
      .select('*');

    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
    
    // Update the return statement to use the mapping function
    return empData.map(mapDbEmployeeToEmployee);
  } catch (error) {
    console.error('Error in getEmployees:', error);
    return [];
  }
};

// Update all other functions that return Employee[] or Project[] 
// to use the appropriate mapping function

export const getEmployeeById = async (id: string): Promise<Employee | null> => {
  try {
    const { data: employeeData, error } = await supabase
      .from('employees')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching employee by ID:', error);
      return null;
    }

    return mapDbEmployeeToEmployee(employeeData);
  } catch (error) {
    console.error('Error in getEmployeeById:', error);
    return null;
  }
};

export const getProjects = async (): Promise<Project[]> => {
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

// Example of how to update one more function:
export const getActiveProjects = async (): Promise<Project[]> => {
  try {
    const { data: projectsData, error } = await supabase
      .from('projects')
      .select('*')
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching active projects:', error);
      return [];
    }
    
    // Update to use the mapping function
    return projectsData.map(mapDbProjectToProject);
  } catch (error) {
    console.error('Error in getActiveProjects:', error);
    return [];
  }
};

export const createEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .insert([
        {
          employee_id: employee.employeeId,
          first_name: employee.firstName,
          last_name: employee.lastName,
          email: employee.email,
          department: employee.department,
          position: employee.position,
          manager_id: employee.managerId,
          mentor_id: employee.mentorId,
          hire_date: employee.hireDate,
          status: employee.status,
          expected_departure_date: employee.expectedDepartureDate,
          projectAssignments: employee.projectAssignments,
          notes: employee.notes,
          competencyMatrix: employee.competencyMatrix,
          retentionMatrix: employee.retentionMatrix
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.error('Error creating employee:', error);
      return null;
    }

    return mapDbEmployeeToEmployee(data);
  } catch (error) {
    console.error('Error in createEmployee:', error);
    return null;
  }
};

export const updateEmployee = async (id: string, updates: Partial<Employee>): Promise<Employee | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .update({
        employee_id: updates.employeeId,
        first_name: updates.firstName,
        last_name: updates.lastName,
        email: updates.email,
        department: updates.department,
        position: updates.position,
        manager_id: updates.managerId,
        mentor_id: updates.mentorId,
        hire_date: updates.hireDate,
        status: updates.status,
        expected_departure_date: updates.expectedDepartureDate,
        projectAssignments: updates.projectAssignments,
        notes: updates.notes,
        competencyMatrix: updates.competencyMatrix,
        retentionMatrix: updates.retentionMatrix
      })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating employee:', error);
      return null;
    }

    return mapDbEmployeeToEmployee(data);
  } catch (error) {
    console.error('Error in updateEmployee:', error);
    return null;
  }
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting employee:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteEmployee:', error);
    return false;
  }
};
