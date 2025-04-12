
import { supabase } from '@/lib/supabase';
import { User, UserRole } from '@/types';

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

// Define each RPC function type
type GetAllUsersFunction = () => Promise<UserRPCResponse[]>;
type ApproveUserFunction = (params: { user_id: string; user_role: string }) => Promise<null>;
type AssignMentorRoleFunction = (params: { user_id: string }) => Promise<null>;
type GetPendingUsersFunction = () => Promise<UserRPCResponse[]>;

// User management functions
export const getAll = async (): Promise<User[]> => {
  try {
    // Use the RPC function to get all users with proper typing
    const { data, error } = await supabase
      .rpc<GetAllUsersFunction>('get_all_users');

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
    
    // If no data is returned, return an empty array
    if (!data) return [];
    
    // Map the data to the expected User type
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
    // Update user role and status using RPC with proper typing
    const { error } = await supabase
      .rpc<ApproveUserFunction>('approve_user', {
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
    // Update user role using RPC with proper typing
    const { error } = await supabase
      .rpc<AssignMentorRoleFunction>('assign_mentor_role', {
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
    // Use RPC to get pending users with proper typing
    const { data, error } = await supabase
      .rpc<GetPendingUsersFunction>('get_pending_users');

    if (error) {
      console.error('Error fetching pending users:', error);
      throw error;
    }
    
    // If no data is returned, return an empty array
    if (!data) return [];
    
    // Map the data to the expected User type
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
