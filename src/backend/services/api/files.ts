
import { CompetencyMatrix, RetentionMatrix } from '@/types';

const API_URL = 'http://localhost:8080/api';

// Process and upload competency matrix
export const uploadCompetencyMatrix = async (file: File): Promise<{ success: boolean }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/files/competency-matrix`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Error uploading competency matrix: ${response.statusText}`);
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error uploading competency matrix:', error);
    return { success: false };
  }
};

// Process and upload retention matrix
export const uploadRetentionMatrix = async (file: File): Promise<{ success: boolean }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_URL}/files/retention-matrix`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Error uploading retention matrix: ${response.statusText}`);
    }
    
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
    const endpoint = matrixType === 'competency' ? 'competency-matrix' : 'retention-matrix';
    
    const response = await fetch(`${API_URL}/employees/${employeeId}/${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matrixData)
    });
    
    if (!response.ok) {
      throw new Error(`Error updating ${matrixType} matrix: ${response.statusText}`);
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
    const response = await fetch(`${API_URL}/employees/${employeeId}/competency-matrix`);
    
    if (!response.ok) {
      throw new Error(`Error fetching competency matrix: ${response.statusText}`);
    }
    
    const data = await response.json() as Record<string, number>;
    
    return data;
  } catch (error) {
    console.error('Error fetching competency matrix:', error);
    return null;
  }
};

// Get retention matrix with flexible columns
export const getEmployeeRetentionMatrix = async (employeeId: string): Promise<Record<string, number> | null> => {
  try {
    const response = await fetch(`${API_URL}/employees/${employeeId}/retention-matrix`);
    
    if (!response.ok) {
      throw new Error(`Error fetching retention matrix: ${response.statusText}`);
    }
    
    const data = await response.json() as Record<string, number>;
    
    return data;
  } catch (error) {
    console.error('Error fetching retention matrix:', error);
    return null;
  }
};
