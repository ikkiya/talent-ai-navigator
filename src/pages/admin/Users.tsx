
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { User, UserPlus, Search, UserX, UserCheck, Mail, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { UserRole } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as usersApi from '@/services/api/users';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

type UserStatus = 'active' | 'inactive' | 'invited';

interface UserData {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  lastLogin?: string | null;
  avatarUrl?: string;
}

const Users = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
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

  const getStatusBadgeColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'invited': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const isAdmin = auth.user?.role === 'admin';
  const isManager = auth.user?.role === 'manager' || auth.user?.role === 'admin';

  if (isLoadingUsers || isLoadingPending) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p>Loading users...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts, permissions, and approvals
            </p>
          </div>
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Invite User
          </Button>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span>User Management</span>
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search users..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>
              {filteredUsers.length} users in total, {filteredUsers.filter(u => u.status === 'active').length} active
            </CardDescription>
            {isAdmin && (
              <Tabs defaultValue="all" className="mt-4" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="pending">
                    Pending Approval 
                    {pendingUsers.length > 0 && (
                      <Badge className="ml-2 bg-amber-500">{pendingUsers.length}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
                          <AvatarFallback>{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadgeColor(user.status)} text-white capitalize`}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {isAdmin && user.status === 'inactive' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedUser(user);
                              setApproveRole(user.role);
                              setIsApproveDialogOpen(true);
                            }}
                            title="Approve user"
                          >
                            <ShieldCheck className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        
                        {isManager && user.role !== 'mentor' && user.status === 'active' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleAssignMentor(user.id, user.firstName, user.lastName)}
                            title="Assign mentor role"
                          >
                            <UserCheck className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedUser(user);
                            setIsDeleteDialogOpen(true);
                          }}
                          title="Delete user"
                        >
                          <UserX className="h-4 w-4 text-destructive" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            toast({
                              title: "Email sent",
                              description: `A password reset email has been sent to ${user.email}`
                            });
                          }}
                          title="Send password reset"
                        >
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedUser?.firstName} {selectedUser?.lastName}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation email to add a new user to the system.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="user@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="role" className="text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as UserRole)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="mentor">Mentor</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve User Dialog */}
      {isAdmin && (
        <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve User</DialogTitle>
              <DialogDescription>
                Approve {selectedUser?.firstName} {selectedUser?.lastName} and assign their role.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="approveRole" className="text-sm font-medium">
                  Assign Role
                </label>
                <Select 
                  value={approveRole} 
                  onValueChange={(value) => setApproveRole(value as UserRole)}
                >
                  <SelectTrigger id="approveRole">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="mentor">Mentor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleApproveUser}>
                Approve User
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default Users;
