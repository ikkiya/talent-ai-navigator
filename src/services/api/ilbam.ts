
import { supabase } from '@/lib/supabase';
import { IlbamMatrix } from '@/types';

// Get all ILBAM matrices
export const getAll = async (): Promise<IlbamMatrix[]> => {
  try {
    const { data, error } = await supabase
      .from('ilbam_matrices')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching ILBAM matrices:', error);
    return [];
  }
};

// Get ILBAM matrix by employee ID
export const getByEmployeeId = async (employeeId: string): Promise<IlbamMatrix | null> => {
  try {
    const { data, error } = await supabase
      .from('ilbam_matrices')
      .select('*')
      .eq('employee_id', employeeId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, return null
        return null;
      }
      throw error;
    }
    
    return data as IlbamMatrix;
  } catch (error) {
    console.error(`Error fetching ILBAM matrix for employee ${employeeId}:`, error);
    return null;
  }
};

// Upload ILBAM matrix data
export const uploadIlbamMatrix = async (matrixData: Omit<IlbamMatrix, 'id'>): Promise<IlbamMatrix | null> => {
  try {
    const { data, error } = await supabase
      .from('ilbam_matrices')
      .upsert({
        employee_id: matrixData.employeeId,
        business_understanding: matrixData.businessUnderstanding,
        leadership: matrixData.leadership,
        innovation_capability: matrixData.innovationCapability,
        teamwork: matrixData.teamwork,
        adaptability: matrixData.adaptability,
        motivation: matrixData.motivation,
        last_updated: matrixData.lastUpdated,
        updated_by: matrixData.updatedBy
      }, { onConflict: 'employee_id' })
      .select()
      .single();

    if (error) throw error;
    
    // Convert snake_case to camelCase
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
    const { data, error } = await supabase
      .from('ilbam_matrices')
      .update({
        business_understanding: matrix.businessUnderstanding,
        leadership: matrix.leadership,
        innovation_capability: matrix.innovationCapability,
        teamwork: matrix.teamwork,
        adaptability: matrix.adaptability,
        motivation: matrix.motivation,
        last_updated: new Date().toISOString(),
        updated_by: matrix.updatedBy
      })
      .eq('id', matrix.id)
      .select()
      .single();

    if (error) throw error;
    
    // Convert snake_case to camelCase
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
