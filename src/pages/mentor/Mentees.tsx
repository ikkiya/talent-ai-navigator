import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Employee } from '@/types';
import { UserSearch, UserCheck, PlusCircle, Link, MessageSquare, ChevronRight, FileEdit, BarChart, Calendar, Filter, Search } from 'lucide-react';

const MenteeCard = ({ 
  employee, 
  onMessage,
  onView
}: { 
  employee: Employee; 
  onMessage: () => void;
  onView: () => void;
}) => {
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
                <Badge variant="outline" className="text-xs">
                  {employee.department}
                </Badge>
                <Badge variant={employee.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {employee.status}
                </Badge>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={onMessage}
                >
                  <MessageSquare className="h-3.5 w-3.5 mr-1" />
                  Message
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-2"
                  onClick={onView}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            {employee.competencyMatrix && (
              <div className="text-right">
                <p className="text-sm font-medium">Skills</p>
                <p className="text-2xl font-bold">{Object.keys(employee.competencyMatrix).length}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PotentialMenteeCard = ({ 
  employee, 
  onAssign 
}: { 
  employee: Employee;
  onAssign: () => void;
}) => {
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
                <Badge variant="outline" className="text-xs">
                  {employee.department}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  Joined {new Date(employee.hireDate).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={onAssign}
            className="whitespace-nowrap"
          >
            <Link className="h-4 w-4 mr-2" />
            Become Mentor
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const Mentees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: false,
    recentlyJoined: false,
    lowSkills: false,
  });
  const { toast } = useToast();
  
  const { data: employees = [], isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
  });
  
  const myMentees = employees.filter(e => e.mentorId === 'current-user-id') || [];
  
  const potentialMentees = employees.filter(e => !e.mentorId) || [];
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  const handleToggleFilter = (filter: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };
  
  const handleAssignMentee = (employee: Employee) => {
    toast({
      title: "Mentee assigned",
      description: `You are now a mentor to ${employee.firstName} ${employee.lastName}.`,
    });
  };
  
  const handleViewMentee = (employee: Employee) => {
    toast({
      title: "View mentee",
      description: `Viewing detailed profile for ${employee.firstName} ${employee.lastName}.`,
    });
  };
  
  const handleMessageMentee = (employee: Employee) => {
    toast({
      title: "Message mentee",
      description: `Opening chat with ${employee.firstName} ${employee.lastName}.`,
    });
  };
  
  const filteredMentees = myMentees.filter(mentee => 
    `${mentee.firstName} ${mentee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredPotentialMentees = potentialMentees.filter(mentee => 
    `${mentee.firstName} ${mentee.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mentees</h1>
          <p className="text-muted-foreground">
            Manage your mentee relationships and development
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-brand-green" />
              <span>Mentee Management</span>
            </CardTitle>
            <CardDescription>
              View your current mentees and find new mentees to guide
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search mentees..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleToggleFilter('department')} 
                    className={filters.department ? "bg-primary/10" : ""}>
                    <Filter className="h-4 w-4 mr-1" />
                    Department
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleFilter('recentlyJoined')}
                    className={filters.recentlyJoined ? "bg-primary/10" : ""}>
                    <Calendar className="h-4 w-4 mr-1" />
                    Recently Joined
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleFilter('lowSkills')}
                    className={filters.lowSkills ? "bg-primary/10" : ""}>
                    <BarChart className="h-4 w-4 mr-1" />
                    Low Skills
                  </Button>
                </div>
              </div>
              
              <Tabs defaultValue="current" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="current">
                    My Mentees ({myMentees.length})
                  </TabsTrigger>
                  <TabsTrigger value="potential">
                    Potential Mentees ({potentialMentees.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="current" className="space-y-4">
                  {isLoadingEmployees ? (
                    <div className="text-center py-12 border rounded-md bg-muted/30">
                      <p className="text-muted-foreground">
                        Loading mentees...
                      </p>
                    </div>
                  ) : filteredMentees.length > 0 ? (
                    <>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Showing {filteredMentees.length} of {myMentees.length} mentees
                        </p>
                        
                        <div className="flex gap-2 items-center">
                          <Button variant="outline" size="sm">
                            <FileEdit className="h-4 w-4 mr-2" />
                            Bulk Edit
                          </Button>
                        </div>
                      </div>
                      
                      {filteredMentees.map(mentee => (
                        <MenteeCard
                          key={mentee.id}
                          employee={mentee}
                          onMessage={() => handleMessageMentee(mentee)}
                          onView={() => handleViewMentee(mentee)}
                        />
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-12 border rounded-md bg-muted/30">
                      <UserSearch className="h-10 w-10 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">
                        {searchTerm ? "No mentees match your search" : "You don't have any mentees yet"}
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="potential" className="space-y-4">
                  {isLoadingEmployees ? (
                    <div className="text-center py-12 border rounded-md bg-muted/30">
                      <p className="text-muted-foreground">
                        Loading potential mentees...
                      </p>
                    </div>
                  ) : filteredPotentialMentees.length > 0 ? (
                    <>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          Showing {filteredPotentialMentees.length} of {potentialMentees.length} potential mentees
                        </p>
                      </div>
                      
                      {filteredPotentialMentees.map(mentee => (
                        <PotentialMenteeCard
                          key={mentee.id}
                          employee={mentee}
                          onAssign={() => handleAssignMentee(mentee)}
                        />
                      ))}
                    </>
                  ) : (
                    <div className="text-center py-12 border rounded-md bg-muted/30">
                      <UserSearch className="h-10 w-10 mx-auto text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">
                        {searchTerm ? "No potential mentees match your search" : "There are no employees without mentors"}
                      </p>
                      {searchTerm && (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setSearchTerm('')}
                        >
                          Clear search
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Mentees;
