
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, UserCheck, UserMinus, BriefcaseBusiness, BarChart3, ArrowUpRight } from 'lucide-react';

// Sample data for demonstration
const userDistributionData = [
  { name: 'Admins', value: 5 },
  { name: 'Managers', value: 15 },
  { name: 'Mentors', value: 10 },
  { name: 'Users', value: 70 },
];

const userGrowthData = [
  { month: 'Jan', count: 10 },
  { month: 'Feb', count: 15 },
  { month: 'Mar', count: 20 },
  { month: 'Apr', count: 25 },
  { month: 'May', count: 30 },
  { month: 'Jun', count: 40 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminPage = () => {
  return (
    <div className="space-y-6 animate-fade-in p-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive overview of system users and activities
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                <h3 className="text-3xl font-bold mt-1">100</h3>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Active</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2 mt-1" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">User Growth</p>
                <h3 className="text-3xl font-bold mt-1">+40</h3>
              </div>
              <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>This Month</span>
                <span className="font-medium">40%</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>Increase from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Projects</p>
                <h3 className="text-3xl font-bold mt-1">25</h3>
              </div>
              <div className="h-12 w-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                <BriefcaseBusiness className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Active</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>+5 new projects this month</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Inactive Users</p>
                <h3 className="text-3xl font-bold mt-1">15</h3>
              </div>
              <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <UserMinus className="h-6 w-6 text-red-500" />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span>Percentage</span>
                <span className="font-medium">15%</span>
              </div>
              <Progress value={15} className="h-2 mt-1" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Users by role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {userDistributionData.map((entry, index) => (
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
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>Monthly user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userGrowthData}
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
          <CardTitle>Recent Admin Activities</CardTitle>
          <CardDescription>Latest system updates and administrative actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">New user account created</p>
                <p className="text-sm text-muted-foreground">John Doe added to the system</p>
                <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center mt-1">
                <BarChart3 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">System report generated</p>
                <p className="text-sm text-muted-foreground">Monthly user analytics report completed</p>
                <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-start">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center mt-1">
                <BriefcaseBusiness className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">New project registered</p>
                <p className="text-sm text-muted-foreground">Project Alpha added to the system</p>
                <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPage;
