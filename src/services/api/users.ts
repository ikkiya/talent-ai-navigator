
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types';

// User management functions
export const getAll = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    return data.map(user => ({
      id: user.id,
      username: user.email.split('@')[0],
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role as UserRole,
      status: user.is_active ? 'active' : 'inactive'
    }));
  } catch (error) {
    console.error('Error in getAll users:', error);
    return [];
  }
};

export const approveUser = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        role: role,
        is_active: true
      })
      .eq('id', userId);

    if (error) {
      console.error('Error approving user:', error);
      return false;
    }

    // If approving as manager, add entry to managers table
    if (role === 'manager') {
      const { error: managerError } = await supabase
        .from('managers')
        .insert([{ user_id: userId }]);
      
      if (managerError) {
        console.error('Error creating manager record:', managerError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in approveUser:', error);
    return false;
  }
};

export const assignMentorRole = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('users')
      .update({
        role: 'mentor'
      })
      .eq('id', userId);

    if (error) {
      console.error('Error assigning mentor role:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in assignMentorRole:', error);
    return false;
  }
};

export const getPendingUsers = async (): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', false);

    if (error) {
      console.error('Error fetching pending users:', error);
      throw error;
    }
    
    return data.map(user => ({
      id: user.id,
      username: user.email.split('@')[0],
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      role: user.role as UserRole,
      status: 'inactive'
    }));
  } catch (error) {
    console.error('Error in getPendingUsers:', error);
    return [];
  }
};
