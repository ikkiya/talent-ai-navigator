
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Employee } from '@/types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, UserCheck, UserMinus, BriefcaseBusiness, BarChart3, ArrowUpRight } from 'lucide-react';

const Dashboard = () => {
  const { auth } = useAuth();
  
  const { data: employees, isLoading: isLoadingEmployees } = useQuery({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
  });
  
  const { data: projects, isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: api.projects.getAll,
  });
  
  if (isLoadingEmployees || isLoadingProjects) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div>Loading dashboard data...</div>
        </div>
      </Layout>
    );
  }
  
  // Employee stats
  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(e => e.status === 'active').length || 0;
  const employeesWithMentor = employees?.filter(e => e.mentorId).length || 0;
  const atRiskEmployees = employees?.filter(e => {
    if (!e.retentionMatrix) return false;
    // Calculate average risk score
    const values = Object.values(e.retentionMatrix);
    const avgScore = values.reduce((sum, val) => sum + val, 0) / values.length;
    return avgScore < 3; // Consider "at risk" if average score is less than 3
  }).length || 0;
  
  // Department distribution for pie chart
  const departmentCount = employees?.reduce((acc: Record<string, number>, employee) => {
    acc[employee.department] = (acc[employee.department] || 0) + 1;
    return acc;
  }, {}) || {};
  
  const departmentData = Object.keys(departmentCount).map(dept => ({
    name: dept,
    value: departmentCount[dept],
  }));
  
  // Monthly project count for area chart
  const projectData = [
    { month: 'Jan', count: 4 },
    { month: 'Feb', count: 6 },
    { month: 'Mar', count: 5 },
    { month: 'Apr', count: 7 },
    { month: 'May', count: 8 },
    { month: 'Jun', count: 10 },
  ];
  
  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {auth.user?.firstName}! Here's an overview of your team's data.
          </p>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                  <h3 className="text-3xl font-bold mt-1">{totalEmployees}</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Active</span>
                  <span className="font-medium">{Math.round((activeEmployees / totalEmployees) * 100)}%</span>
                </div>
                <Progress value={(activeEmployees / totalEmployees) * 100} className="h-2 mt-1" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">With Mentors</p>
                  <h3 className="text-3xl font-bold mt-1">{employeesWithMentor}</h3>
                </div>
                <div className="h-12 w-12 bg-brand-green/10 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-brand-green" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Coverage</span>
                  <span className="font-medium">{Math.round((employeesWithMentor / totalEmployees) * 100)}%</span>
                </div>
                <Progress value={(employeesWithMentor / totalEmployees) * 100} className="h-2 mt-1" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <h3 className="text-3xl font-bold mt-1">{projects?.filter(p => p.status === 'active').length || 0}</h3>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <BriefcaseBusiness className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>In Planning</span>
                  <span className="font-medium">{projects?.filter(p => p.status === 'planning').length || 0}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                  <span>+2 new projects this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">At-Risk Employees</p>
                  <h3 className="text-3xl font-bold mt-1">{atRiskEmployees}</h3>
                </div>
                <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <UserMinus className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Percentage</span>
                  <span className="font-medium">{Math.round((atRiskEmployees / totalEmployees) * 100)}%</span>
                </div>
                <Progress value={(atRiskEmployees / totalEmployees) * 100} className="h-2 mt-1" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Distribution</CardTitle>
              <CardDescription>Breakdown by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Projects Trend</CardTitle>
              <CardDescription>Monthly active projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={projectData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#0077B6" fill="#0077B6" fillOpacity={0.2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">New employee added</p>
                  <p className="text-sm text-muted-foreground">Carol Williams joined Engineering department</p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-brand-green/10 flex items-center justify-center mt-1">
                  <BarChart3 className="h-5 w-5 text-brand-green" />
                </div>
                <div>
                  <p className="font-medium">Competency matrix updated</p>
                  <p className="text-sm text-muted-foreground">Engineering team skills assessment completed</p>
                  <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                </div>
              </div>
              
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mt-1">
                  <BriefcaseBusiness className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">New project created</p>
                  <p className="text-sm text-muted-foreground">Project Delta added to the system</p>
                  <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
