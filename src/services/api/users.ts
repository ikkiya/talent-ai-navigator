
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types';

// User management functions
export const getAll = async (): Promise<User[]> => {
  try {
    // Use the RPC function to get all users
    const { data, error } = await supabase
      .rpc('get_all_users')
      .select();

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    // If no data is returned, return an empty array
    if (!data) return [];
    
    return data.map(user => ({
      id: user.id,
      username: user.email?.split('@')[0] || '',
      email: user.email || '',
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      role: user.role as UserRole,
      status: user.is_active ? 'active' : 'inactive',
      lastLogin: user.last_sign_in_at || null
    }));
  } catch (error) {
    console.error('Error in getAll users:', error);
    return [];
  }
};

export const approveUser = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    // Update user role and status using RPC
    const { error } = await supabase
      .rpc('approve_user', {
        user_id: userId,
        user_role: role
      });

    if (error) {
      console.error('Error approving user:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in approveUser:', error);
    return false;
  }
};

export const assignMentorRole = async (userId: string): Promise<boolean> => {
  try {
    // Update user role using RPC
    const { error } = await supabase
      .rpc('assign_mentor_role', {
        user_id: userId
      });

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
    // Use RPC to get pending users
    const { data, error } = await supabase
      .rpc('get_pending_users')
      .select();

    if (error) {
      console.error('Error fetching pending users:', error);
      throw error;
    }
    
    // If no data is returned, return an empty array
    if (!data) return [];
    
    return data.map(user => ({
      id: user.id,
      username: user.email?.split('@')[0] || '',
      email: user.email || '',
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      role: user.role as UserRole,
      status: 'inactive',
      lastLogin: user.last_sign_in_at || null
    }));
  } catch (error) {
    console.error('Error in getPendingUsers:', error);
    return [];
  }
};
