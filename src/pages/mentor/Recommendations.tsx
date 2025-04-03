
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Project, TeamRecommendation, Employee } from '@/types';
import { UserCheck, UserX, Sparkles, Clipboard, Check, Info } from 'lucide-react';

const RecommendedEmployee = ({ 
  employee, 
  reasoning,
  onAccept,
  onReject
}: { 
  employee: Employee; 
  reasoning: string;
  onAccept: () => void;
  onReject: () => void;
}) => {
  const [showReasoning, setShowReasoning] = useState(false);
  
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="" />
              <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium">{employee.firstName} {employee.lastName}</h3>
              <p className="text-sm text-muted-foreground">{employee.position}</p>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {employee.competencyMatrix && Object.entries(employee.competencyMatrix)
                  .filter(([_, score]) => score >= 4)
                  .slice(0, 3)
                  .map(([skill]) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))
                }
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="mt-2 h-7 px-2"
                onClick={() => setShowReasoning(!showReasoning)}
              >
                <Info className="h-3.5 w-3.5 mr-1" />
                {showReasoning ? 'Hide Reasoning' : 'Show Reasoning'}
              </Button>
              
              {showReasoning && (
                <div className="mt-2 text-sm p-3 bg-muted/50 rounded-md">
                  {reasoning}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-24 text-brand-green border-brand-green hover:bg-brand-green/10"
              onClick={onAccept}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Accept
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="w-24 text-destructive border-destructive hover:bg-destructive/10"
              onClick={onReject}
            >
              <UserX className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AlternativeEmployee = ({ 
  employee,
  onSelect
}: { 
  employee: Employee;
  onSelect: () => void;
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="" />
              <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium">{employee.firstName} {employee.lastName}</h3>
              <p className="text-sm text-muted-foreground">{employee.position}</p>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {employee.competencyMatrix && Object.entries(employee.competencyMatrix)
                  .filter(([_, score]) => score >= 3)
                  .slice(0, 3)
                  .map(([skill]) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))
                }
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSelect}
          >
            Select
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const AcceptedEmployee = ({ 
  employee, 
  onRemove 
}: { 
  employee: Employee;
  onRemove: () => void;
}) => {
  return (
    <div className="flex items-center justify-between p-3 bg-brand-green/10 rounded-md mb-2">
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src="" />
          <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
        </Avatar>
        <span>{employee.firstName} {employee.lastName}</span>
      </div>
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onRemove}
      >
        <UserX className="h-4 w-4" />
      </Button>
    </div>
  );
};

const Recommendations = () => {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [acceptedEmployees, setAcceptedEmployees] = useState<Employee[]>([]);
  const { toast } = useToast();
  
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: api.projects.getAll,
  });
  
  const { 
    data: recommendation, 
    isLoading: isLoadingRecommendation,
    isError
  } = useQuery({
    queryKey: ['recommendation', selectedProjectId],
    queryFn: () => api.recommendations.getTeamRecommendations(selectedProjectId!),
    enabled: !!selectedProjectId,
  });
  
  const handleAcceptEmployee = (employee: Employee) => {
    setAcceptedEmployees(prev => [...prev, employee]);
    toast({
      title: "Employee accepted",
      description: `${employee.firstName} ${employee.lastName} has been added to the team.`,
    });
  };
  
  const handleRejectEmployee = (employee: Employee) => {
    toast({
      title: "Employee rejected",
      description: `${employee.firstName} ${employee.lastName} has been rejected from the recommendations.`,
    });
  };
  
  const handleRemoveAccepted = (employeeId: string) => {
    setAcceptedEmployees(prev => prev.filter(e => e.id !== employeeId));
    toast({
      title: "Employee removed",
      description: "Employee has been removed from the team.",
    });
  };
  
  const handleSubmitTeam = () => {
    if (acceptedEmployees.length === 0) {
      toast({
        variant: "destructive",
        title: "No employees selected",
        description: "Please select at least one employee for the team.",
      });
      return;
    }
    
    toast({
      title: "Team submitted",
      description: `Team with ${acceptedEmployees.length} members has been submitted for approval.`,
    });
    // In a real app, you would submit this to the backend
  };
  
  const handleCopyTeam = () => {
    const teamText = acceptedEmployees
      .map(e => `${e.firstName} ${e.lastName} (${e.position})`)
      .join('\n');
    navigator.clipboard.writeText(teamText);
    toast({
      title: "Team copied to clipboard",
      description: "You can now paste the team list in another application.",
    });
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Recommendations</h1>
          <p className="text-muted-foreground">
            Get AI-powered team recommendations for your projects
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-brand-blue" />
              <span>Team Builder</span>
            </CardTitle>
            <CardDescription>
              Select a project to get AI-recommended team members based on skills, availability, and retention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="max-w-sm">
                <label className="text-sm font-medium mb-1.5 block">
                  Select Project
                </label>
                <Select 
                  value={selectedProjectId || ''} 
                  onValueChange={(value) => {
                    setSelectedProjectId(value);
                    setAcceptedEmployees([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects?.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedProjectId && (
                <div className="grid md:grid-cols-5 gap-6">
                  <div className="md:col-span-3 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Recommended Team Members</h3>
                      
                      {recommendation && (
                        <Badge variant="outline" className="font-normal">
                          Confidence: {recommendation.confidenceScore}%
                        </Badge>
                      )}
                    </div>
                    
                    {isLoadingRecommendation ? (
                      <div className="text-center py-12 border rounded-md bg-muted/30">
                        <Sparkles className="h-10 w-10 mx-auto text-brand-blue animate-pulse" />
                        <p className="mt-4 text-muted-foreground">
                          AI is generating recommendations...
                        </p>
                      </div>
                    ) : isError ? (
                      <div className="text-center py-12 border rounded-md bg-muted/30">
                        <p className="text-red-500">
                          Error loading recommendations. Please try again.
                        </p>
                      </div>
                    ) : recommendation ? (
                      <Tabs defaultValue="recommended">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="recommended">Recommended</TabsTrigger>
                          <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="recommended" className="mt-4">
                          {recommendation.recommendedEmployees.length > 0 ? (
                            recommendation.recommendedEmployees.map(employee => (
                              <RecommendedEmployee
                                key={employee.id}
                                employee={employee}
                                reasoning={recommendation.reasonings[employee.id] || "This employee has matching skills for the project."}
                                onAccept={() => handleAcceptEmployee(employee)}
                                onReject={() => handleRejectEmployee(employee)}
                              />
                            ))
                          ) : (
                            <div className="text-center py-8 border rounded-md bg-muted/30">
                              <p className="text-muted-foreground">
                                No recommended employees available
                              </p>
                            </div>
                          )}
                        </TabsContent>
                        
                        <TabsContent value="alternatives" className="mt-4">
                          {recommendation.alternativeEmployees.length > 0 ? (
                            recommendation.alternativeEmployees.map(employee => (
                              <AlternativeEmployee
                                key={employee.id}
                                employee={employee}
                                onSelect={() => handleAcceptEmployee(employee)}
                              />
                            ))
                          ) : (
                            <div className="text-center py-8 border rounded-md bg-muted/30">
                              <p className="text-muted-foreground">
                                No alternative employees available
                              </p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    ) : (
                      <div className="text-center py-12 border rounded-md bg-muted/30">
                        <p className="text-muted-foreground">
                          Select a project to get team recommendations
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Your Selected Team</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {acceptedEmployees.length > 0 ? (
                          <div className="space-y-2">
                            {acceptedEmployees.map(employee => (
                              <AcceptedEmployee
                                key={employee.id}
                                employee={employee}
                                onRemove={() => handleRemoveAccepted(employee.id)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 rounded-md bg-muted/30">
                            <p className="text-muted-foreground">
                              No team members selected yet
                            </p>
                          </div>
                        )}
                        
                        <div className="flex flex-col gap-2 mt-4">
                          <Button 
                            onClick={handleSubmitTeam}
                            className="w-full"
                            disabled={acceptedEmployees.length === 0}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Submit Team
                          </Button>
                          
                          <Button 
                            variant="outline"
                            onClick={handleCopyTeam}
                            className="w-full"
                            disabled={acceptedEmployees.length === 0}
                          >
                            <Clipboard className="h-4 w-4 mr-2" />
                            Copy Team List
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Recommendations;
