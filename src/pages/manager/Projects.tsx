import React from 'react';
import Layout from '@/components/Layout';
import { api } from '@/backend/services/api';
import { Project } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, CheckCircle, CircleDollarSign, Loader2, XCircle } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';

const Projects = () => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: api.projects.getAll,
  });
  
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
  });

  const activeProjects = projects.filter(project => project.status === 'active') || [];

  if (isLoading || isLoadingEmployees) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading projects...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Projects</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{projects?.length || 0}</div>
                <Briefcase className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{activeProjects.length}</div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {projects?.length ? 
                    (projects.reduce((acc, project) => {
                      const budget = 100000;
                      const expenses = 50000;
                      return acc + (expenses / budget);
                    }, 0) / projects.length).toFixed(1) + '%' 
                    : '0%'}
                </div>
                <CircleDollarSign className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project List</CardTitle>
            <CardDescription>Overview of all projects and their team members.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Team Members</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects?.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>{new Date(project.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          project.status === 'active' ? 'default' :
                            project.status === 'completed' ? 'secondary' :
                              'outline'
                        }
                      >
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {Array.isArray(project.teamMembers) && project.teamMembers.slice(0, 3).map((memberId) => {
                          const member = typeof memberId === 'string' ? 
                            employees.find((emp) => emp.id === memberId) : 
                            memberId;
                            
                          return member ? (
                            <Avatar key={member.id} className="h-6 w-6">
                              <AvatarFallback>{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                            </Avatar>
                          ) : null;
                        })}
                        {Array.isArray(project.teamMembers) && project.teamMembers.length > 3 && (
                          <span className="text-sm text-muted-foreground">
                            +{project.teamMembers.length - 3}
                          </span>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Projects;
