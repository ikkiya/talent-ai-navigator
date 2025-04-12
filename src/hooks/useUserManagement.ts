
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User, UserRole } from '@/types';
import * as usersApi from '@/services/api/users';
import { toast } from '@/hooks/use-toast';

export const useUserManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('mentor');
  const [approveRole, setApproveRole] = useState<UserRole>('mentor');
  const [activeTab, setActiveTab] = useState('all');

  const { data: allUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const { data: pendingUsers = [], isLoading: isLoadingPending } = useQuery({
    queryKey: ['pendingUsers'],
    queryFn: usersApi.getPendingUsers,
  });

  const approveMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string, role: UserRole }) => 
      usersApi.approveUser(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['pendingUsers'] });
      toast({
        title: "User approved",
        description: `${selectedUser?.firstName} ${selectedUser?.lastName} has been approved as ${approveRole}.`
      });
      setIsApproveDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error approving user",
        description: `There was an error approving the user: ${error}`,
        variant: "destructive"
      });
    }
  });

  const assignMentorMutation = useMutation({
    mutationFn: (userId: string) => usersApi.assignMentorRole(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({
        title: "Mentor role assigned",
        description: `${selectedUser?.firstName} ${selectedUser?.lastName} is now a mentor.`
      });
    },
    onError: (error) => {
      toast({
        title: "Error assigning mentor role",
        description: `There was an error: ${error}`,
        variant: "destructive"
      });
    }
  });

  const users = activeTab === 'pending' ? pendingUsers : allUsers;

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    if (selectedUser) {
      // For mock data only - would use a real API call in production
      toast({
        title: "User deleted",
        description: `${selectedUser.firstName} ${selectedUser.lastName} has been removed from the system.`
      });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleInvite = () => {
    if (inviteEmail) {
      // For mock data only - would use a real API call in production
      toast({
        title: "Invitation sent",
        description: `An invitation has been sent to ${inviteEmail}.`
      });
      setIsInviteDialogOpen(false);
      setInviteEmail('');
    }
  };

  const handleApproveUser = () => {
    if (selectedUser) {
      approveMutation.mutate({ userId: selectedUser.id, role: approveRole });
    }
  };

  const handleAssignMentor = (userId: string, firstName: string, lastName: string) => {
    assignMentorMutation.mutate(userId);
    toast({
      title: "Assigning mentor role",
      description: `${firstName} ${lastName} is being assigned the mentor role.`
    });
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedUser,
    setSelectedUser,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isInviteDialogOpen,
    setIsInviteDialogOpen,
    isApproveDialogOpen,
    setIsApproveDialogOpen,
    inviteEmail,
    setInviteEmail,
    inviteRole,
    setInviteRole,
    approveRole,
    setApproveRole,
    activeTab,
    setActiveTab,
    allUsers,
    pendingUsers,
    filteredUsers,
    isLoadingUsers,
    isLoadingPending,
    handleDelete,
    handleInvite,
    handleApproveUser,
    handleAssignMentor
  };
};
