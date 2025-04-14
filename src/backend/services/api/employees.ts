
import { Employee } from '@/types';

const API_URL = 'http://localhost:8080/api';

export const getAll = async (): Promise<Employee[]> => {
  try {
    const response = await fetch(`${API_URL}/employees`);
    
    if (!response.ok) {
      throw new Error(`Error fetching employees: ${response.statusText}`);
    }
    
    const data = await response.json() as Employee[];
    
    return data;
  } catch (error) {
    console.error('Error in getEmployees:', error);
    return [];
  }
};

export const getById = async (id: string): Promise<Employee | null> => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching employee: ${response.statusText}`);
    }
    
    const data = await response.json() as Employee;
    
    return data;
  } catch (error) {
    console.error('Error in getEmployeeById:', error);
    return null;
  }
};

export const create = async (employee: Omit<Employee, 'id'>): Promise<Employee | null> => {
  try {
    const response = await fetch(`${API_URL}/employees`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(employee)
    });
    
    if (!response.ok) {
      throw new Error(`Error creating employee: ${response.statusText}`);
    }
    
    const data = await response.json() as Employee;
    
    return data;
  } catch (error) {
    console.error('Error in createEmployee:', error);
    return null;
  }
};

export const update = async (id: string, updates: Partial<Employee>): Promise<Employee | null> => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error(`Error updating employee: ${response.statusText}`);
    }
    
    const data = await response.json() as Employee;
    
    return data;
  } catch (error) {
    console.error('Error in updateEmployee:', error);
    return null;
  }
};

export const remove = async (id: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Error deleting employee: ${response.statusText}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error in deleteEmployee:', error);
    return false;
  }
};
