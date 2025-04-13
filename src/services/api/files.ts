
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
    
    // Decide which table to update based on matrix type
    const tableName = matrixType === 'competency' ? 'competency_matrices' : 'retention_matrices';
    const dataField = matrixType === 'competency' ? 'skills' : 'factors';
    
    // Check if there's an existing matrix for this employee
    const { data: existingMatrix, error: matrixError } = await supabase
      .from(tableName)
      .select('*')
      .eq('employee_id', employeeId)
      .single();
    
    if (matrixError && !matrixError.message.includes('No rows found')) {
      console.error(`Error checking existing ${matrixType} matrix:`, matrixError);
      return { success: false };
    }
    
    let updateResult;
    
    if (existingMatrix) {
      // Update existing matrix
      updateResult = await supabase
        .from(tableName)
        .update({ 
          [dataField]: matrixData,
          last_updated: new Date().toISOString()
        })
        .eq('id', existingMatrix.id);
    } else {
      // Create new matrix
      const insertData: any = {
        employee_id: employeeId,
        [dataField]: matrixData,
        last_updated: new Date().toISOString()
      };
      
      // Add risk_score for retention matrices
      if (matrixType === 'retention') {
        // Calculate average risk score
        const values = Object.values(matrixData);
        const avgScore = values.length > 0 
          ? values.reduce((sum, val) => sum + val, 0) / values.length
          : 0;
        insertData.risk_score = avgScore;
      }
      
      updateResult = await supabase
        .from(tableName)
        .insert(insertData);
    }
    
    if (updateResult.error) {
      console.error(`Error updating ${matrixType} matrix:`, updateResult.error);
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
      .from('competency_matrices')
      .select('skills')
      .eq('employee_id', employeeId)
      .single();
    
    if (error) {
      console.error('Error fetching competency matrix:', error);
      return null;
    }
    
    return data?.skills || null;
  } catch (error) {
    console.error('Error fetching competency matrix:', error);
    return null;
  }
};

// Get retention matrix with flexible columns
export const getEmployeeRetentionMatrix = async (employeeId: string): Promise<Record<string, number> | null> => {
  try {
    const { data, error } = await supabase
      .from('retention_matrices')
      .select('factors')
      .eq('employee_id', employeeId)
      .single();
    
    if (error) {
      console.error('Error fetching retention matrix:', error);
      return null;
    }
    
    return data?.factors || null;
  } catch (error) {
    console.error('Error fetching retention matrix:', error);
    return null;
  }
};
