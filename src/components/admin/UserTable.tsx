
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { User } from '@/types';
import { UserListItem } from './UserListItem';

interface UserTableProps {
  users: User[];
  isAdmin: boolean;
  isManager: boolean;
  onApprove: (user: User) => void;
  onAssignMentor: (userId: string, firstName: string, lastName: string) => void;
  onDelete: (user: User) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  isAdmin,
  isManager,
  onApprove,
  onAssignMentor,
  onDelete,
}) => {
  return (
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
        {users.map((user) => (
          <UserListItem
            key={user.id}
            user={user}
            isAdmin={isAdmin}
            isManager={isManager}
            onApprove={onApprove}
            onAssignMentor={onAssignMentor}
            onDelete={onDelete}
          />
        ))}
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-6">
              No users found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
