
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { BriefcaseBusiness, Calendar, Clock, FileText, Plus, Users } from 'lucide-react';
import { formatDistanceToNow, format, parseISO, addMonths } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Project } from '@/types';

const ProjectItem = ({ project }: { project: Project }) => {
  const startDate = parseISO(project.startDate);
  const endDate = project.endDate ? parseISO(project.endDate) : addMonths(startDate, 6);
  const today = new Date();
  
  // Calculate progress based on time elapsed
  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = today.getTime() - startDate.getTime();
  const progressPercentage = Math.min(Math.max(Math.round((elapsed / totalDuration) * 100), 0), 100);
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{project.name}</CardTitle>
            <CardDescription className="mt-1">{project.description}</CardDescription>
          </div>
          <Badge 
            variant={
              project.status === 'active' ? 'default' : 
              project.status === 'completed' ? 'success' : 
              project.status === 'planning' ? 'secondary' : 
              'outline'
            }
          >
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Progress</div>
            <div className="flex items-center gap-2">
              <Progress value={progressPercentage} className="h-2" />
              <span className="text-sm font-medium">{progressPercentage}%</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex gap-2 items-center">
                <Calendar className="h-4 w-4" /> Start Date
              </div>
              <div className="text-sm font-medium">{format(startDate, 'MMM d, yyyy')}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground flex gap-2 items-center">
                <Calendar className="h-4 w-4" /> End Date
              </div>
              <div className="text-sm font-medium">
                {project.endDate ? format(endDate, 'MMM d, yyyy') : 'Ongoing'}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground flex gap-2 items-center">
              <Users className="h-4 w-4" /> Team ({project.teamMembers.length})
            </div>
            <div className="flex -space-x-2">
              {project.teamMembers.slice(0, 5).map((member) => (
                <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                  <AvatarFallback className="text-xs">{member.firstName[0]}{member.lastName[0]}</AvatarFallback>
                </Avatar>
              ))}
              {project.teamMembers.length > 5 && (
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-muted text-xs border-2 border-background">
                  +{project.teamMembers.length - 5}
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground flex gap-2 items-center">
              <FileText className="h-4 w-4" /> Required Skills
            </div>
            <div className="flex flex-wrap gap-1">
              {project.requiredSkills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button variant="outline" size="sm">Details</Button>
        <Button variant="outline" size="sm">Manage Team</Button>
      </CardFooter>
    </Card>
  );
};

const Projects = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>('grid');
  
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: api.projects.getAll,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Loading projects...</h2>
            <p className="text-muted-foreground">Please wait while we fetch the project data.</p>
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
            <h2 className="text-2xl font-semibold mb-2">Error loading projects</h2>
            <p className="text-destructive">An error occurred while fetching project data.</p>
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
          <h1 className="text-3xl font-bold">Projects</h1>
          <Button onClick={() => toast({ title: "Feature coming soon", description: "Project creation will be available in a future update." })}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {projects?.filter(p => p.status === 'active').length || 0}
                </div>
                <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {/* Count unique team members across all projects */}
                  {projects ? 
                    new Set(projects.flatMap(p => p.teamMembers.map(m => m.id))).size : 0}
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Planned Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">
                  {projects?.filter(p => p.status === 'planning').length || 0}
                </div>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="grid" className="w-full" onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-6">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="table">Table View</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="grid" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects?.map((project) => (
                <ProjectItem key={project.id} project={project} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="table" className="mt-0">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Team Size</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects?.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{project.name}</div>
                            <div className="text-sm text-muted-foreground">{project.description}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              project.status === 'active' ? 'default' : 
                              project.status === 'completed' ? 'success' : 
                              project.status === 'planning' ? 'secondary' : 
                              'outline'
                            }
                          >
                            {project.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {project.teamMembers.length}
                            <div className="flex -space-x-2">
                              {project.teamMembers.slice(0, 3).map((member) => (
                                <Avatar key={member.id} className="border-2 border-background h-6 w-6">
                                  <AvatarFallback className="text-xs">
                                    {member.firstName[0]}{member.lastName[0]}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {project.teamMembers.length > 3 && (
                                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted text-xs border-2 border-background">
                                  +{project.teamMembers.length - 3}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {project.startDate && (
                            <div className="text-sm">
                              Started {formatDistanceToNow(parseISO(project.startDate), { addSuffix: true })}
                              {project.endDate && (
                                <div className="text-muted-foreground">
                                  Ends {format(parseISO(project.endDate), 'MMM d, yyyy')}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" className="mr-2">Details</Button>
                          <Button variant="outline" size="sm">Team</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Projects;
