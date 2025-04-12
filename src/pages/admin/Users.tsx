
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { User, UserPlus, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserTable } from '@/components/admin/UserTable';
import { DeleteDialog, InviteDialog, ApproveDialog } from '@/components/admin/UserDialogs';
import { useUserManagement } from '@/hooks/useUserManagement';

const Users = () => {
  const { auth } = useAuth();
  const {
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
    pendingUsers,
    filteredUsers,
    isLoadingUsers,
    isLoadingPending,
    handleDelete,
    handleInvite,
    handleApproveUser,
    handleAssignMentor
  } = useUserManagement();

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
            <UserTable 
              users={filteredUsers}
              isAdmin={isAdmin}
              isManager={isManager}
              onApprove={(user) => {
                setSelectedUser(user);
                setApproveRole(user.role);
                setIsApproveDialogOpen(true);
              }}
              onAssignMentor={handleAssignMentor}
              onDelete={(user) => {
                setSelectedUser(user);
                setIsDeleteDialogOpen(true);
              }}
            />
          </CardContent>
        </Card>
      </div>

      <DeleteDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedUser={selectedUser}
        onConfirm={handleDelete}
      />

      <InviteDialog 
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        inviteRole={inviteRole}
        setInviteRole={setInviteRole}
        onConfirm={handleInvite}
      />

      {isAdmin && (
        <ApproveDialog 
          isOpen={isApproveDialogOpen}
          onOpenChange={setIsApproveDialogOpen}
          selectedUser={selectedUser}
          approveRole={approveRole}
          setApproveRole={setApproveRole}
          onConfirm={handleApproveUser}
        />
      )}
    </Layout>
  );
};

export default Users;
