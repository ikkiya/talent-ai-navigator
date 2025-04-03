
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, BarChartHorizontal, LineChart, PieChart, Download, Share2, 
  ChevronDown, FileDown, BarChart as BarChartIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Bar,
  BarChart as ReBarChart,
  Line,
  LineChart as ReLineChart,
  Pie,
  PieChart as RePieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

// Mock data for reports
const departmentDistributionData = [
  { name: 'Engineering', value: 45 },
  { name: 'Product Management', value: 15 },
  { name: 'Marketing', value: 10 },
  { name: 'Sales', value: 12 },
  { name: 'Customer Support', value: 8 },
  { name: 'HR', value: 5 },
  { name: 'Finance', value: 5 }
];

const skillDistributionData = [
  { name: 'JavaScript', count: 32 },
  { name: 'Python', count: 28 },
  { name: 'Java', count: 25 },
  { name: 'SQL', count: 38 },
  { name: 'React', count: 22 },
  { name: 'AWS', count: 18 },
  { name: 'DevOps', count: 15 },
  { name: 'UX Design', count: 10 }
];

const retentionRiskData = [
  { name: 'Low', value: 45, color: '#4ade80' },
  { name: 'Medium', value: 30, color: '#facc15' },
  { name: 'High', value: 25, color: '#f87171' }
];

const headcountTrendData = [
  { month: 'Jan', headcount: 120 },
  { month: 'Feb', headcount: 118 },
  { month: 'Mar', headcount: 125 },
  { month: 'Apr', headcount: 132 },
  { month: 'May', headcount: 135 },
  { month: 'Jun', headcount: 140 },
  { month: 'Jul', headcount: 145 },
  { month: 'Aug', headcount: 150 },
  { month: 'Sep', headcount: 148 },
  { month: 'Oct', headcount: 155 },
  { month: 'Nov', headcount: 158 },
  { month: 'Dec', headcount: 160 }
];

const projectUtilizationData = [
  { project: 'Project Alpha', utilization: 85 },
  { project: 'Project Beta', utilization: 72 },
  { project: 'Project Gamma', utilization: 93 },
  { project: 'Project Delta', utilization: 65 },
  { project: 'Project Epsilon', utilization: 78 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('2025-q1');
  const [reportType, setReportType] = useState('organizational');

  const downloadReport = (format: string) => {
    toast({
      title: "Downloading report",
      description: `Report is being downloaded in ${format.toUpperCase()} format`
    });
  };

  const shareReport = () => {
    toast({
      title: "Share report",
      description: "Share link has been copied to clipboard"
    });
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
            <p className="text-muted-foreground">
              Analyze talent metrics and organizational insights
            </p>
          </div>
          <div className="flex gap-2">
            <Select value={reportPeriod} onValueChange={setReportPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2025-q1">Q1 2025</SelectItem>
                <SelectItem value="2024-q4">Q4 2024</SelectItem>
                <SelectItem value="2024-q3">Q3 2024</SelectItem>
                <SelectItem value="2024-q2">Q2 2024</SelectItem>
                <SelectItem value="2024-full">Full Year 2024</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Button variant="outline" className="flex items-center gap-1">
                <Download className="h-4 w-4" />
                Export
                <ChevronDown className="h-4 w-4" />
              </Button>
              <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg z-10 hidden group-hover:block">
                <ul>
                  <li className="px-4 py-2 hover:bg-accent cursor-pointer" onClick={() => downloadReport('pdf')}>
                    Export as PDF
                  </li>
                  <li className="px-4 py-2 hover:bg-accent cursor-pointer" onClick={() => downloadReport('excel')}>
                    Export as Excel
                  </li>
                  <li className="px-4 py-2 hover:bg-accent cursor-pointer" onClick={() => downloadReport('csv')}>
                    Export as CSV
                  </li>
                </ul>
              </div>
            </div>
            <Button variant="ghost" onClick={shareReport}>
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="organizational" className="space-y-4" value={reportType} onValueChange={setReportType}>
          <TabsList>
            <TabsTrigger value="organizational">Organizational</TabsTrigger>
            <TabsTrigger value="talent">Talent</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="retention">Retention</TabsTrigger>
          </TabsList>
          
          <TabsContent value="organizational" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    <span>Department Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    Headcount distribution across departments
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={departmentDistributionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {departmentDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    <span>Headcount Trend</span>
                  </CardTitle>
                  <CardDescription>
                    Monthly headcount changes over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={headcountTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="headcount" stroke="#8884d8" activeDot={{ r: 8 }} />
                    </ReLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartHorizontal className="h-5 w-5" />
                  <span>Department Metrics</span>
                </CardTitle>
                <CardDescription>
                  Key metrics by department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Department</th>
                        <th className="px-4 py-2 text-right">Headcount</th>
                        <th className="px-4 py-2 text-right">Avg. Tenure (years)</th>
                        <th className="px-4 py-2 text-right">Open Positions</th>
                        <th className="px-4 py-2 text-right">Attrition Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2">Engineering</td>
                        <td className="px-4 py-2 text-right">45</td>
                        <td className="px-4 py-2 text-right">3.5</td>
                        <td className="px-4 py-2 text-right">5</td>
                        <td className="px-4 py-2 text-right">12%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Product Management</td>
                        <td className="px-4 py-2 text-right">15</td>
                        <td className="px-4 py-2 text-right">4.2</td>
                        <td className="px-4 py-2 text-right">2</td>
                        <td className="px-4 py-2 text-right">8%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Marketing</td>
                        <td className="px-4 py-2 text-right">10</td>
                        <td className="px-4 py-2 text-right">2.8</td>
                        <td className="px-4 py-2 text-right">1</td>
                        <td className="px-4 py-2 text-right">15%</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">Sales</td>
                        <td className="px-4 py-2 text-right">12</td>
                        <td className="px-4 py-2 text-right">2.1</td>
                        <td className="px-4 py-2 text-right">3</td>
                        <td className="px-4 py-2 text-right">18%</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Customer Support</td>
                        <td className="px-4 py-2 text-right">8</td>
                        <td className="px-4 py-2 text-right">1.9</td>
                        <td className="px-4 py-2 text-right">2</td>
                        <td className="px-4 py-2 text-right">22%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="talent" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChartIcon className="h-5 w-5" />
                    <span>Skill Distribution</span>
                  </CardTitle>
                  <CardDescription>
                    Most common skills across the organization
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={skillDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    <span>Skill Gap Analysis</span>
                  </CardTitle>
                  <CardDescription>
                    Skill supply vs. demand for critical competencies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Cloud Architecture</span>
                        <span className="text-sm text-red-500">-35%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Demand exceeds supply by 35%</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Machine Learning</span>
                        <span className="text-sm text-red-500">-40%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Demand exceeds supply by 40%</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">DevOps</span>
                        <span className="text-sm text-red-500">-25%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Demand exceeds supply by 25%</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">JavaScript</span>
                        <span className="text-sm text-green-500">+15%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Supply exceeds demand by 15%</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Project Management</span>
                        <span className="text-sm text-green-500">+10%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Supply exceeds demand by 10%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartHorizontal className="h-5 w-5" />
                  <span>Talent Acquisition</span>
                </CardTitle>
                <CardDescription>
                  Hiring metrics and recruitment pipeline
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">Open Positions</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl font-bold">45</div>
                    <div className="text-sm text-muted-foreground">Active Candidates</div>
                  </div>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="text-2xl font-bold">38 days</div>
                    <div className="text-sm text-muted-foreground">Avg. Time to Hire</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Hiring Pipeline</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Applied (120)</span>
                        <span className="text-sm">100%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Screening (65)</span>
                        <span className="text-sm">54%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '54%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Interview (28)</span>
                        <span className="text-sm">23%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '23%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Offer (12)</span>
                        <span className="text-sm">10%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Hired (8)</span>
                        <span className="text-sm">7%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '7%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="projects" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChartIcon className="h-5 w-5" />
                    <span>Project Utilization</span>
                  </CardTitle>
                  <CardDescription>
                    Resource allocation across active projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReBarChart data={projectUtilizationData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="project" type="category" width={100} />
                      <Tooltip formatter={(value) => [`${value}%`, 'Utilization']} />
                      <Legend />
                      <Bar dataKey="utilization" fill="#8884d8" />
                    </ReBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChartIcon className="h-5 w-5" />
                    <span>Project Status Overview</span>
                  </CardTitle>
                  <CardDescription>
                    Current status of all projects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm text-muted-foreground">Active Projects</div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold">4</div>
                        <div className="text-sm text-muted-foreground">Completed Projects</div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold">3</div>
                        <div className="text-sm text-muted-foreground">Planning Phase</div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-2xl font-bold">1</div>
                        <div className="text-sm text-muted-foreground">On Hold</div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-3">Project Health</h3>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                          <div className="text-sm mr-4">Healthy</div>
                          <div className="w-full bg-muted rounded-full h-2.5 flex-1">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                          <div className="text-sm ml-2">60%</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                          <div className="text-sm mr-4">At Risk</div>
                          <div className="w-full bg-muted rounded-full h-2.5 flex-1">
                            <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '25%' }}></div>
                          </div>
                          <div className="text-sm ml-2">25%</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                          <div className="text-sm mr-4">Critical</div>
                          <div className="w-full bg-muted rounded-full h-2.5 flex-1">
                            <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                          </div>
                          <div className="text-sm ml-2">15%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartHorizontal className="h-5 w-5" />
                  <span>Skills Demand Forecast</span>
                </CardTitle>
                <CardDescription>
                  Projected skills needed for upcoming projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-2 text-left">Skill Area</th>
                        <th className="px-4 py-2 text-right">Current Capacity</th>
                        <th className="px-4 py-2 text-right">Q2 2025 Demand</th>
                        <th className="px-4 py-2 text-right">Q3 2025 Demand</th>
                        <th className="px-4 py-2 text-right">Gap</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="px-4 py-2">Full Stack Development</td>
                        <td className="px-4 py-2 text-right">18 FTE</td>
                        <td className="px-4 py-2 text-right">22 FTE</td>
                        <td className="px-4 py-2 text-right">25 FTE</td>
                        <td className="px-4 py-2 text-right text-red-500">-7 FTE</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">DevOps</td>
                        <td className="px-4 py-2 text-right">6 FTE</td>
                        <td className="px-4 py-2 text-right">8 FTE</td>
                        <td className="px-4 py-2 text-right">10 FTE</td>
                        <td className="px-4 py-2 text-right text-red-500">-4 FTE</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">AI/ML</td>
                        <td className="px-4 py-2 text-right">4 FTE</td>
                        <td className="px-4 py-2 text-right">7 FTE</td>
                        <td className="px-4 py-2 text-right">8 FTE</td>
                        <td className="px-4 py-2 text-right text-red-500">-4 FTE</td>
                      </tr>
                      <tr className="border-b">
                        <td className="px-4 py-2">UX Design</td>
                        <td className="px-4 py-2 text-right">5 FTE</td>
                        <td className="px-4 py-2 text-right">6 FTE</td>
                        <td className="px-4 py-2 text-right">6 FTE</td>
                        <td className="px-4 py-2 text-right text-red-500">-1 FTE</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2">Project Management</td>
                        <td className="px-4 py-2 text-right">8 FTE</td>
                        <td className="px-4 py-2 text-right">7 FTE</td>
                        <td className="px-4 py-2 text-right">8 FTE</td>
                        <td className="px-4 py-2 text-right text-green-500">+0 FTE</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="retention" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    <span>Retention Risk</span>
                  </CardTitle>
                  <CardDescription>
                    Distribution of employees by retention risk level
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={retentionRiskData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {retentionRiskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} employees`, 'Count']} />
                      <Legend />
                    </RePieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5" />
                    <span>Attrition Rate Trend</span>
                  </CardTitle>
                  <CardDescription>
                    Monthly employee attrition rate
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart data={headcountTrendData.map(item => ({
                      ...item,
                      attrition: Math.random() * 5 + 2
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, 'Attrition Rate']} />
                      <Legend />
                      <Line type="monotone" dataKey="attrition" stroke="#f87171" activeDot={{ r: 8 }} />
                    </ReLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChartHorizontal className="h-5 w-5" />
                  <span>Retention Factors</span>
                </CardTitle>
                <CardDescription>
                  Key factors affecting employee retention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Top Retention Challenges</h3>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Compensation</span>
                        <span className="text-sm">82%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Career Growth</span>
                        <span className="text-sm">75%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Work-Life Balance</span>
                        <span className="text-sm">65%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Recognition</span>
                        <span className="text-sm">60%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Retention Strategies</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">High Flight Risk</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Targeted compensation adjustments</li>
                          <li>Career path discussions</li>
                          <li>Retention bonuses</li>
                          <li>Special project assignments</li>
                        </ul>
                      </div>
                      <div className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">Medium Flight Risk</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Regular 1:1 check-ins</li>
                          <li>Development opportunities</li>
                          <li>Recognition programs</li>
                          <li>Flexible work arrangements</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
