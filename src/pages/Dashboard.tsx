
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, UserMinus, BriefcaseBusiness, BarChart3, ArrowUpRight } from 'lucide-react';

// Sample data for demonstration
const departmentData = [
  { name: 'Engineering', value: 42 },
  { name: 'Product', value: 18 },
  { name: 'Design', value: 15 },
  { name: 'Marketing', value: 12 },
  { name: 'Sales', value: 10 },
  { name: 'HR', value: 5 },
];

const projectData = [
  { month: 'Jan', count: 4 },
  { month: 'Feb', count: 6 },
  { month: 'Mar', count: 5 },
  { month: 'Apr', count: 7 },
  { month: 'May', count: 8 },
  { month: 'Jun', count: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const Dashboard = () => {
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome! Here's an overview of your team's data.
          </p>
        </div>
        
        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Employees</p>
                  <h3 className="text-3xl font-bold mt-1">124</h3>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Active</span>
                  <span className="font-medium">89%</span>
                </div>
                <Progress value={89} className="h-2 mt-1" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">With Mentors</p>
                  <h3 className="text-3xl font-bold mt-1">89</h3>
                </div>
                <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Coverage</span>
                  <span className="font-medium">72%</span>
                </div>
                <Progress value={72} className="h-2 mt-1" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <h3 className="text-3xl font-bold mt-1">12</h3>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <BriefcaseBusiness className="h-6 w-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>In Planning</span>
                  <span className="font-medium">4</span>
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
                  <h3 className="text-3xl font-bold mt-1">7</h3>
                </div>
                <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <UserMinus className="h-6 w-6 text-red-500" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span>Percentage</span>
                  <span className="font-medium">5.6%</span>
                </div>
                <Progress value={5.6} className="h-2 mt-1" />
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
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                  <BarChart3 className="h-5 w-5 text-green-500" />
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
