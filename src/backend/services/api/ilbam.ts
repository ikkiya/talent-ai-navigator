
import { IlbamMatrix } from '@/types';

// Define interface for the API response types
interface IlbamMatrixAPIResponse {
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

const API_URL = 'http://localhost:8080/api';

// Get all ILBAM matrices
export const getAll = async (): Promise<IlbamMatrix[]> => {
  try {
    const response = await fetch(`${API_URL}/ilbam`);
    
    if (!response.ok) {
      throw new Error(`Error fetching ILBAM matrices: ${response.statusText}`);
    }
    
    const data = await response.json() as IlbamMatrixAPIResponse[];
    
    return data;
  } catch (error) {
    console.error('Error fetching ILBAM matrices:', error);
    return [];
  }
};

// Get ILBAM matrix by employee ID
export const getByEmployeeId = async (employeeId: string): Promise<IlbamMatrix | null> => {
  try {
    const response = await fetch(`${API_URL}/ilbam/employee/${employeeId}`);
    
    if (!response.ok) {
      throw new Error(`Error fetching ILBAM matrix: ${response.statusText}`);
    }
    
    const data = await response.json() as IlbamMatrixAPIResponse;
    
    return data;
  } catch (error) {
    console.error(`Error fetching ILBAM matrix for employee ${employeeId}:`, error);
    return null;
  }
};

// Upload ILBAM matrix data
export const uploadIlbamMatrix = async (matrixData: Omit<IlbamMatrix, 'id'>): Promise<IlbamMatrix | null> => {
  try {
    const response = await fetch(`${API_URL}/ilbam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matrixData)
    });
    
    if (!response.ok) {
      throw new Error(`Error uploading ILBAM matrix: ${response.statusText}`);
    }
    
    const data = await response.json() as IlbamMatrixAPIResponse;
    
    return data;
  } catch (error) {
    console.error('Error uploading ILBAM matrix:', error);
    return null;
  }
};

// Update ILBAM matrix
export const updateIlbamMatrix = async (matrix: IlbamMatrix): Promise<IlbamMatrix | null> => {
  try {
    const response = await fetch(`${API_URL}/ilbam/${matrix.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matrix)
    });
    
    if (!response.ok) {
      throw new Error(`Error updating ILBAM matrix: ${response.statusText}`);
    }
    
    const data = await response.json() as IlbamMatrixAPIResponse;
    
    return data;
  } catch (error) {
    console.error('Error updating ILBAM matrix:', error);
    return null;
  }
};
