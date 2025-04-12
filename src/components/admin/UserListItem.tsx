
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserX, UserCheck, Mail, ShieldCheck } from 'lucide-react';
import { User, UserStatus } from '@/types';
import { toast } from '@/hooks/use-toast';

interface UserListItemProps {
  user: User;
  isAdmin: boolean;
  isManager: boolean;
  onApprove: (user: User) => void;
  onAssignMentor: (userId: string, firstName: string, lastName: string) => void;
  onDelete: (user: User) => void;
}

export const UserListItem: React.FC<UserListItemProps> = ({
  user,
  isAdmin,
  isManager,
  onApprove,
  onAssignMentor,
  onDelete,
}) => {
  const getStatusBadgeColor = (status: UserStatus) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'invited': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
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
              onClick={() => onApprove(user)}
              title="Approve user"
            >
              <ShieldCheck className="h-4 w-4 text-green-600" />
            </Button>
          )}
          
          {isManager && user.role !== 'mentor' && user.status === 'active' && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAssignMentor(user.id, user.firstName, user.lastName)}
              title="Assign mentor role"
            >
              <UserCheck className="h-4 w-4 text-blue-600" />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(user)}
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
  );
};
