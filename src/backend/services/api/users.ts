
import { User, UserRole, UserStatus } from '@/types';

// Define interfaces for the API response types
interface UserAPIResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  lastSignInAt: string | null;
}

const API_URL = 'http://localhost:8080/api';

// User management functions
export const getAll = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/users`);
    
    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }
    
    const data = await response.json() as UserAPIResponse[];
    
    // Map the data to the expected User type
    return data.map(user => ({
      id: user.id,
      username: user.email?.split('@')[0] || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role as UserRole,
      status: (user.isActive ? 'active' : 'inactive') as UserStatus,
      lastLogin: user.lastSignInAt || null
    }));
  } catch (error) {
    console.error('Error in getAll users:', error);
    return [];
  }
};

export const approveUser = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role })
    });

    if (!response.ok) {
      throw new Error(`Error approving user: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error in approveUser:', error);
    return false;
  }
};

export const assignMentorRole = async (userId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}/assign-mentor`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`Error assigning mentor role: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error in assignMentorRole:', error);
    return false;
  }
};

export const getPendingUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}/users/pending`);
    
    if (!response.ok) {
      throw new Error(`Error fetching pending users: ${response.statusText}`);
    }
    
    const data = await response.json() as UserAPIResponse[];
    
    // Map the data to the expected User type
    return data.map(user => ({
      id: user.id,
      username: user.email?.split('@')[0] || '',
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      role: user.role as UserRole,
      status: 'inactive' as UserStatus,
      lastLogin: user.lastSignInAt || null
    }));
  } catch (error) {
    console.error('Error in getPendingUsers:', error);
    return [];
  }
};
