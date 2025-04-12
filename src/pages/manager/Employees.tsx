
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Employee } from '@/types';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart, Briefcase, User, Users, UserCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/contexts/AuthContext';

const Employees = () => {
  const { toast } = useToast();
  const { auth } = useAuth();
  const queryClient = useQueryClient();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAssignMentorDialogOpen, setIsAssignMentorDialogOpen] = useState(false);

  const { data: employees = [], isLoading: isLoadingEmployees, error } = useQuery({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
  });

  const assignMentorMutation = useMutation({
    mutationFn: (userId: string) => api.users.assignMentorRole(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      toast({
        title: "Mentor role assigned",
        description: `${selectedEmployee?.firstName} ${selectedEmployee?.lastName} is now a mentor.`
      });
      setIsAssignMentorDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error assigning mentor role",
        description: `There was an error: ${error}`,
        variant: "destructive"
      });
    }
  });

  const handleAssignMentor = () => {
    if (selectedEmployee) {
      assignMentorMutation.mutate(selectedEmployee.id);
    }
  };

  const departmentStats = employees.length > 0 
    ? employees.reduce<Record<string, number>>((acc, employee) => {
        acc[employee.department] = (acc[employee.department] || 0) + 1;
        return acc;
      }, {})
    : {};

  const statusCount = {
    active: employees.length > 0 
      ? employees.reduce((count, emp) => count + (emp.status === 'active' ? 1 : 0), 0)
      : 0,
    onLeave: employees.length > 0 
      ? employees.reduce((count, emp) => count + (emp.status === 'onLeave' ? 1 : 0), 0)
      : 0,
    inactive: employees.length > 0 
      ? employees.reduce((count, emp) => count + (emp.status === 'inactive' ? 1 : 0), 0)
      : 0,
  };

  const isManager = auth.user?.role === 'manager' || auth.user?.role === 'admin';

  if (isLoadingEmployees) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading employees...</h2>
            <p className="text-muted-foreground">Please wait while we fetch the employee data.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Error loading employees</h2>
            <p className="text-destructive">An error occurred while fetching employee data.</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Employees</h1>
          <Button onClick={() => toast({ title: "Feature coming soon", description: "Employee creation will be available in a future update." })}>
            <User className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{employees?.length || 0}</div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Project Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {employees?.reduce((acc, emp) => acc + emp.projectAssignments.length, 0) || 0}
                </div>
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {employees?.length ? 
                    (employees.reduce((acc, emp) => {
                      const totalUtilization = emp.projectAssignments.reduce(
                        (total, assignment) => total + assignment.utilizationPercentage, 0
                      );
                      return acc + (totalUtilization / Math.max(emp.projectAssignments.length, 1));
                    }, 0) / employees.length).toFixed(1) + '%' 
                    : '0%'}
                </div>
                <BarChart className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
            <CardDescription>Manage your team members and their project assignments.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees?.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                          <div className="text-sm text-muted-foreground">{employee.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {employee.projectAssignments.map((assignment) => (
                          <Badge key={assignment.id} variant="outline" className="whitespace-nowrap">
                            {assignment.projectName} ({assignment.utilizationPercentage}%)
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          employee.status === 'active' ? 'default' : 
                          employee.status === 'inactive' ? 'destructive' : 
                          'outline'
                        }
                      >
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {isManager && (
                          <Button
                            variant="ghost" 
                            size="icon"
                            title="Assign mentor role"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsAssignMentorDialogOpen(true);
                            }}
                          >
                            <UserCheck className="h-4 w-4 text-blue-600" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast({ 
                            title: "View employee details", 
                            description: "Employee details view will be available in a future update." 
                          })}
                        >
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Assign Mentor Role Dialog */}
      {isManager && (
        <Dialog open={isAssignMentorDialogOpen} onOpenChange={setIsAssignMentorDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign Mentor Role</DialogTitle>
              <DialogDescription>
                Do you want to assign the mentor role to {selectedEmployee?.firstName} {selectedEmployee?.lastName}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAssignMentorDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAssignMentor}>
                Assign Mentor Role
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default Employees;
