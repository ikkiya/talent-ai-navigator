
import { supabase } from '@/lib/supabase';
import { User, UserRole, UserStatus } from '@/types';

// Define interfaces for the RPC function return types
interface UserRPCResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
  last_sign_in_at: string | null;
}

// Generic type for RPC functions to help with TypeScript
type RPCResponse<T> = T[];

// User management functions
export const getAll = async (): Promise<User[]> => {
  try {
    // Call RPC function with proper type declaration
    const { data, error } = await supabase
      .rpc('get_all_users')
      .returns<RPCResponse<UserRPCResponse>>();

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    // If no data is returned, return an empty array
    if (!data) return [];
    
    // Map the data to the expected User type
    return (data || []).map(user => ({
      id: user.id,
      username: user.email?.split('@')[0] || '',
      email: user.email || '',
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      role: user.role as UserRole,
      status: (user.is_active ? 'active' : 'inactive') as UserStatus,
      lastLogin: user.last_sign_in_at || null
    }));
  } catch (error) {
    console.error('Error in getAll users:', error);
    return [];
  }
};

export const approveUser = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    // Use RPC with proper type declaration
    const { error } = await supabase
      .rpc('approve_user', {
        user_id: userId,
        user_role: role
      })
      .returns<null>();

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
    // Update user role using RPC with proper type declaration
    const { error } = await supabase
      .rpc('assign_mentor_role', {
        user_id: userId
      })
      .returns<null>();

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
    // Use RPC with proper type declaration
    const { data, error } = await supabase
      .rpc('get_pending_users')
      .returns<RPCResponse<UserRPCResponse>>();

    if (error) {
      console.error('Error fetching pending users:', error);
      throw error;
    }
    
    // If no data is returned, return an empty array
    if (!data) return [];
    
    // Map the data to the expected User type
    return (data || []).map(user => ({
      id: user.id,
      username: user.email?.split('@')[0] || '',
      email: user.email || '',
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      role: user.role as UserRole,
      status: 'inactive' as UserStatus,
      lastLogin: user.last_sign_in_at || null
    }));
  } catch (error) {
    console.error('Error in getPendingUsers:', error);
    return [];
  }
};
