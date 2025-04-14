
import { supabase } from '@/lib/supabase';
import { IlbamMatrix } from '@/types';

// Define interface for the RPC function return types
interface IlbamMatrixDBResponse {
  id: string;
  employee_id: string;
  business_understanding: number;
  leadership: number;
  innovation_capability: number;
  teamwork: number;
  adaptability: number;
  motivation: number;
  last_updated: string;
  updated_by: string;
}

// Get all ILBAM matrices
export const getAll = async (): Promise<IlbamMatrix[]> => {
  try {
    // Use RPC with type assertion
    const { data, error } = await supabase
      .rpc('get_all_ilbam_matrices') as { data: IlbamMatrixDBResponse[] | null, error: any };

    if (error) {
      console.error('Error fetching ILBAM matrices:', error);
      return [];
    }

    // If no data is returned, return an empty array
    if (!data) return [];
    
    // Convert from DB format to our application format
    return data.map(item => ({
      id: item.id,
      employeeId: item.employee_id,
      businessUnderstanding: item.business_understanding,
      leadership: item.leadership,
      innovationCapability: item.innovation_capability,
      teamwork: item.teamwork,
      adaptability: item.adaptability,
      motivation: item.motivation,
      lastUpdated: item.last_updated,
      updatedBy: item.updated_by
    }));
  } catch (error) {
    console.error('Error fetching ILBAM matrices:', error);
    return [];
  }
};

// Get ILBAM matrix by employee ID
export const getByEmployeeId = async (employeeId: string): Promise<IlbamMatrix | null> => {
  try {
    // Use RPC with type assertion
    const { data, error } = await supabase
      .rpc('get_ilbam_by_employee_id', {
        employee_id_param: employeeId
      }) as { data: IlbamMatrixDBResponse | null, error: any };

    if (error) {
      console.error(`Error fetching ILBAM matrix for employee ${employeeId}:`, error);
      return null;
    }

    if (!data) return null;
    
    // Convert from DB format to our application format
    return {
      id: data.id,
      employeeId: data.employee_id,
      businessUnderstanding: data.business_understanding,
      leadership: data.leadership,
      innovationCapability: data.innovation_capability,
      teamwork: data.teamwork,
      adaptability: data.adaptability,
      motivation: data.motivation,
      lastUpdated: data.last_updated,
      updatedBy: data.updated_by
    };
  } catch (error) {
    console.error(`Error fetching ILBAM matrix for employee ${employeeId}:`, error);
    return null;
  }
};

// Upload ILBAM matrix data
export const uploadIlbamMatrix = async (matrixData: Omit<IlbamMatrix, 'id'>): Promise<IlbamMatrix | null> => {
  try {
    // Use RPC with type assertion
    const { data, error } = await supabase
      .rpc('upsert_ilbam_matrix', {
        employee_id_param: matrixData.employeeId,
        business_understanding_param: matrixData.businessUnderstanding,
        leadership_param: matrixData.leadership,
        innovation_capability_param: matrixData.innovationCapability,
        teamwork_param: matrixData.teamwork,
        adaptability_param: matrixData.adaptability,
        motivation_param: matrixData.motivation,
        updated_by_param: matrixData.updatedBy
      }) as { data: IlbamMatrixDBResponse | null, error: any };

    if (error) {
      console.error('Error uploading ILBAM matrix:', error);
      return null;
    }

    if (!data) return null;
    
    // Convert from DB format to our application format
    return {
      id: data.id,
      employeeId: data.employee_id,
      businessUnderstanding: data.business_understanding,
      leadership: data.leadership,
      innovationCapability: data.innovation_capability,
      teamwork: data.teamwork,
      adaptability: data.adaptability,
      motivation: data.motivation,
      lastUpdated: data.last_updated,
      updatedBy: data.updated_by
    };
  } catch (error) {
    console.error('Error uploading ILBAM matrix:', error);
    return null;
  }
};

// Update ILBAM matrix
export const updateIlbamMatrix = async (matrix: IlbamMatrix): Promise<IlbamMatrix | null> => {
  try {
    // Use RPC with type assertion
    const { data, error } = await supabase
      .rpc('update_ilbam_matrix', {
        matrix_id_param: matrix.id,
        business_understanding_param: matrix.businessUnderstanding,
        leadership_param: matrix.leadership,
        innovation_capability_param: matrix.innovationCapability,
        teamwork_param: matrix.teamwork,
        adaptability_param: matrix.adaptability,
        motivation_param: matrix.motivation,
        updated_by_param: matrix.updatedBy
      }) as { data: IlbamMatrixDBResponse | null, error: any };

    if (error) {
      console.error('Error updating ILBAM matrix:', error);
      return null;
    }

    if (!data) return null;
    
    // Convert from DB format to our application format
    return {
      id: data.id,
      employeeId: data.employee_id,
      businessUnderstanding: data.business_understanding,
      leadership: data.leadership,
      innovationCapability: data.innovation_capability,
      teamwork: data.teamwork,
      adaptability: data.adaptability,
      motivation: data.motivation,
      lastUpdated: data.last_updated,
      updatedBy: data.updated_by
    };
  } catch (error) {
    console.error('Error updating ILBAM matrix:', error);
    return null;
  }
};
