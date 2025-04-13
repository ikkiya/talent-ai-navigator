
import { supabase } from '@/lib/supabase';
import { Employee, CompetencyMatrix, RetentionMatrix } from '@/types';

// Process and upload competency matrix
export const uploadCompetencyMatrix = async (file: File): Promise<{ success: boolean }> => {
  try {
    // This would process the Excel file
    console.log('Processing competency matrix:', file.name);
    
    // For demo purposes, we're simulating the extraction of data
    // In a real implementation, you would:
    // 1. Parse the Excel file to extract headers (skills) and data
    // 2. Map each row to an employee
    // 3. Update the database with the matrix data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { success: true };
  } catch (error) {
    console.error('Error uploading competency matrix:', error);
    return { success: false };
  }
};

// Process and upload retention matrix
export const uploadRetentionMatrix = async (file: File): Promise<{ success: boolean }> => {
  try {
    // This would process the Excel file
    console.log('Processing retention matrix:', file.name);
    
    // For demo purposes, we're simulating the extraction of data
    // In a real implementation, you would:
    // 1. Parse the Excel file to extract headers (retention factors) and data
    // 2. Map each row to an employee
    // 3. Update the database with the matrix data
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return { success: true };
  } catch (error) {
    console.error('Error uploading retention matrix:', error);
    return { success: false };
  }
};

// Flexible matrix update - allows adding new columns dynamically
export const updateEmployeeMatrix = async (
  employeeId: string, 
  matrixType: 'competency' | 'retention', 
  matrixData: Record<string, number>
): Promise<{ success: boolean }> => {
  try {
    // Get the current employee data
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching employee data:', fetchError);
      return { success: false };
    }
    
    // Prepare the update object
    const updateObj: Record<string, any> = {};
    
    if (matrixType === 'competency') {
      updateObj.competencyMatrix = matrixData;
    } else {
      updateObj.retentionMatrix = matrixData;
    }
    
    // Update the employee record
    const { error: updateError } = await supabase
      .from('employees')
      .update(updateObj)
      .eq('id', employeeId);
    
    if (updateError) {
      console.error('Error updating matrix data:', updateError);
      return { success: false };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error updating employee matrix:', error);
    return { success: false };
  }
};

// Get competency matrix with flexible columns
export const getEmployeeCompetencyMatrix = async (employeeId: string): Promise<Record<string, number> | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('competencyMatrix')
      .eq('id', employeeId)
      .single();
    
    if (error) {
      console.error('Error fetching competency matrix:', error);
      return null;
    }
    
    return data?.competencyMatrix || null;
  } catch (error) {
    console.error('Error fetching competency matrix:', error);
    return null;
  }
};

// Get retention matrix with flexible columns
export const getEmployeeRetentionMatrix = async (employeeId: string): Promise<Record<string, number> | null> => {
  try {
    const { data, error } = await supabase
      .from('employees')
      .select('retentionMatrix')
      .eq('id', employeeId)
      .single();
    
    if (error) {
      console.error('Error fetching retention matrix:', error);
      return null;
    }
    
    return data?.retentionMatrix || null;
  } catch (error) {
    console.error('Error fetching retention matrix:', error);
    return null;
  }
};
