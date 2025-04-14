import { supabase } from '@/lib/supabase';
import { Employee } from '@/types';

// Helper function to map database types to application types
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

export const getAll = async (): Promise<Employee[]> => {
  try {
    const { data: empData, error } = await supabase
      .from('employees')
      .select('*');

    if (error) {
      console.error('Error fetching employees:', error);
      throw error;
    }
    
    return empData.map(mapDbEmployeeToEmployee);
  } catch (error) {
    console.error('Error in getEmployees:', error);
    return [];
  }
};

export const getById = async (id: string): Promise<Employee | null> => {
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

export const create = async (employee: Omit<Employee, 'id'>): Promise<Employee | null> => {
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

export const update = async (id: string, updates: Partial<Employee>): Promise<Employee | null> => {
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

export const remove = async (id: string): Promise<boolean> => {
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
