
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart as BarChartIcon, PieChart, Calendar, Download, Filter, ChevronDown, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subMonths } from 'date-fns';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Sample data for reports
const skillDistributionData = [
  { name: 'JavaScript', value: 48 },
  { name: 'Python', value: 35 },
  { name: 'Java', value: 25 },
  { name: 'C#', value: 22 },
  { name: 'Ruby', value: 15 },
  { name: 'Go', value: 12 },
  { name: 'PHP', value: 8 },
];

const departmentDistributionData = [
  { name: 'Engineering', value: 42 },
  { name: 'Product', value: 18 },
  { name: 'Design', value: 15 },
  { name: 'Marketing', value: 12 },
  { name: 'Sales', value: 10 },
  { name: 'HR', value: 5 },
  { name: 'Finance', value: 8 },
];

const roleLevelDistributionData = [
  { name: 'Junior', value: 35 },
  { name: 'Mid-Level', value: 40 },
  { name: 'Senior', value: 20 },
  { name: 'Lead', value: 10 },
  { name: 'Manager', value: 8 },
  { name: 'Director', value: 4 },
];

const hiringTrendData = Array.from({ length: 12 }, (_, i) => {
  const date = subMonths(new Date(), i);
  return {
    month: format(date, 'MMM'),
    hires: Math.floor(Math.random() * 20) + 5,
    attrition: Math.floor(Math.random() * 10),
  };
}).reverse();

const skillGapData = [
  { name: 'AI/ML', required: 25, available: 15 },
  { name: 'Cloud', required: 40, available: 35 },
  { name: 'DevOps', required: 30, available: 20 },
  { name: 'Mobile', required: 35, available: 25 },
  { name: 'Security', required: 20, available: 10 },
  { name: 'Data Science', required: 15, available: 8 },
];

const performanceData = [
  { name: 'Exceeds', value: 15 },
  { name: 'Meets+', value: 30 },
  { name: 'Meets', value: 40 },
  { name: 'Needs Improvement', value: 10 },
  { name: 'Below', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658'];

// Custom tooltip for charts that handles different value types
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-md shadow-md p-3">
        <p className="font-medium">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${typeof entry.value === 'number' ? entry.value.toString() : entry.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('last-month');
  const [reportType, setReportType] = useState('workforce');
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Analyze talent distribution and trends
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select defaultValue={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="last-quarter">Last Quarter</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
                <SelectItem value="all-time">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <Tabs defaultValue={reportType} onValueChange={setReportType} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="workforce">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Workforce Analytics
            </TabsTrigger>
            <TabsTrigger value="skills">
              <PieChart className="h-4 w-4 mr-2" />
              Skills Analysis
            </TabsTrigger>
            <TabsTrigger value="performance">
              <Calendar className="h-4 w-4 mr-2" />
              Performance Metrics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workforce" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Employee distribution across departments</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Role Level Distribution</CardTitle>
                  <CardDescription>Employee distribution by seniority</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={roleLevelDistributionData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" fill="#8884d8">
                        {roleLevelDistributionData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Hiring and Attrition Trends</CardTitle>
                <CardDescription>Monthly hiring and attrition rates</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={hiringTrendData}
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
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="hires" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                    <Area type="monotone" dataKey="attrition" stackId="2" stroke="#ffc658" fill="#ffc658" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
              <CardFooter className="flex justify-between">
                <p className="text-sm text-muted-foreground">Data for the last 12 months</p>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>All Departments</DropdownMenuItem>
                    <DropdownMenuItem>Engineering</DropdownMenuItem>
                    <DropdownMenuItem>Product</DropdownMenuItem>
                    <DropdownMenuItem>Design</DropdownMenuItem>
                    <DropdownMenuItem>Marketing</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="skills" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Skill Distribution</CardTitle>
                  <CardDescription>Most common skills in the talent pool</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => {
                          const percentValue = percent * 100;
                          return `${name}: ${typeof percentValue === 'number' ? percentValue.toFixed(0) : percentValue}%`;
                        }}
                      >
                        {skillDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Skill Gap Analysis</CardTitle>
                  <CardDescription>Required vs available skills</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={skillGapData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar dataKey="required" fill="#8884d8" />
                      <Bar dataKey="available" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Skills Gap Report</CardTitle>
                  <CardDescription>Detailed analysis of skills gaps in the organization</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="rounded-md border p-4">
                    <h3 className="font-medium mb-2">Critical Skills Gaps</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>AI/ML specialists - 40% gap</li>
                      <li>Security engineers - 50% gap</li>
                      <li>Data scientists - 47% gap</li>
                    </ul>
                  </div>
                  
                  <div className="rounded-md border p-4">
                    <h3 className="font-medium mb-2">Recommendations</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Focus hiring efforts on AI/ML and security roles</li>
                      <li>Develop internal training programs for data science</li>
                      <li>Consider contractor resources for immediate needs</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
                <CardDescription>Overall performance ratings distribution</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => {
                        const percentValue = percent * 100;
                        return `${name}: ${typeof percentValue === 'number' ? percentValue.toFixed(0) : percentValue}%`;
                      }}
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Top Performers</CardTitle>
                  <CardDescription>Employees with highest ratings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                          {i}
                        </div>
                        <div>
                          <p className="font-medium">Employee Name {i}</p>
                          <p className="text-xs text-muted-foreground">Department</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance by Department</CardTitle>
                  <CardDescription>Average ratings by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Engineering', 'Product', 'Design', 'Marketing', 'Sales'].map((dept) => (
                      <div key={dept} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{dept}</span>
                          <span className="font-medium">{(3 + Math.random() * 1.5).toFixed(1)}/5</span>
                        </div>
                        <div className="h-2 rounded-full bg-secondary overflow-hidden">
                          <div 
                            className="h-full bg-primary" 
                            style={{ width: `${60 + Math.random() * 30}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Performance Trends</CardTitle>
                  <CardDescription>Year-over-year comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-5xl font-bold">+12%</p>
                      <p className="text-sm text-muted-foreground">YoY improvement</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>This year</span>
                        <span className="font-medium">4.2/5</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '84%' }} />
                      </div>
                      
                      <div className="flex justify-between text-sm mt-3">
                        <span>Last year</span>
                        <span className="font-medium">3.7/5</span>
                      </div>
                      <div className="h-2 rounded-full bg-secondary overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: '74%' }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
