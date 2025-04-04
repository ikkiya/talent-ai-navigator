import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileSpreadsheet, Search, Download, Upload, Eye, FileText, FileDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Employee } from '@/types';

const mockEmployees: Employee[] = [
  {
    id: '1',
    employeeId: 'EMP001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    status: 'active',
    hireDate: '2020-03-15T00:00:00Z',
    managerId: '3',
    mentorId: '5',
    notes: 'Full-stack developer with 5 years of experience in React and Node.js. Interested in AI and machine learning.',
    projectAssignments: [
      {
        id: '1',
        projectId: 'proj1',
        projectName: 'Dashboard Redesign',
        role: 'Lead Developer',
        startDate: '2024-12-01T00:00:00Z',
        endDate: '2025-06-30T00:00:00Z',
        utilizationPercentage: 80
      }
    ]
  },
  {
    id: '2',
    employeeId: 'EMP002',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@company.com',
    department: 'Product',
    position: 'Product Manager',
    status: 'active',
    hireDate: '2021-05-20T00:00:00Z',
    managerId: '3',
    mentorId: null,
    notes: 'Experienced product manager with background in user research and go-to-market strategies.',
    projectAssignments: [
      {
        id: '2',
        projectId: 'proj1',
        projectName: 'Dashboard Redesign',
        role: 'Product Manager',
        startDate: '2024-12-01T00:00:00Z',
        endDate: '2025-06-30T00:00:00Z',
        utilizationPercentage: 50
      },
      {
        id: '3',
        projectId: 'proj2',
        projectName: 'Mobile App v2',
        role: 'Product Owner',
        startDate: '2025-01-15T00:00:00Z',
        endDate: '2025-08-30T00:00:00Z',
        utilizationPercentage: 50
      }
    ]
  },
  {
    id: '3',
    employeeId: 'EMP003',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@company.com',
    department: 'Engineering',
    position: 'Engineering Manager',
    status: 'active',
    hireDate: '2018-11-03T00:00:00Z',
    managerId: null,
    mentorId: null,
    notes: 'Engineering manager with strong technical and leadership skills. Manages a team of 10 engineers.',
    projectAssignments: [
      {
        id: '4',
        projectId: 'proj1',
        projectName: 'Dashboard Redesign',
        role: 'Engineering Manager',
        startDate: '2024-12-01T00:00:00Z',
        endDate: '2025-06-30T00:00:00Z',
        utilizationPercentage: 30
      },
      {
        id: '5',
        projectId: 'proj2',
        projectName: 'Mobile App v2',
        role: 'Technical Advisor',
        startDate: '2025-01-15T00:00:00Z',
        endDate: '2025-08-30T00:00:00Z',
        utilizationPercentage: 20
      }
    ]
  },
  {
    id: '4',
    employeeId: 'EMP004',
    firstName: 'Emily',
    lastName: 'Williams',
    email: 'emily.williams@company.com',
    department: 'Design',
    position: 'UX Designer',
    status: 'active',
    hireDate: '2022-02-15T00:00:00Z',
    managerId: '6',
    mentorId: null,
    notes: 'UX designer with experience in user research, wireframing, and prototyping.',
    projectAssignments: [
      {
        id: '6',
        projectId: 'proj1',
        projectName: 'Dashboard Redesign',
        role: 'Lead Designer',
        startDate: '2024-12-01T00:00:00Z',
        endDate: '2025-06-30T00:00:00Z',
        utilizationPercentage: 70
      }
    ]
  },
  {
    id: '5',
    employeeId: 'EMP005',
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@company.com',
    department: 'Engineering',
    position: 'Principal Engineer',
    status: 'active',
    hireDate: '2016-08-10T00:00:00Z',
    managerId: '3',
    mentorId: null,
    notes: 'Principal engineer with expertise in system architecture and technical leadership.',
    projectAssignments: [
      {
        id: '7',
        projectId: 'proj2',
        projectName: 'Mobile App v2',
        role: 'Principal Engineer',
        startDate: '2025-01-15T00:00:00Z',
        endDate: '2025-08-30T00:00:00Z',
        utilizationPercentage: 60
      }
    ]
  },
  {
    id: '6',
    employeeId: 'EMP006',
    firstName: 'Sophia',
    lastName: 'Martinez',
    email: 'sophia.martinez@company.com',
    department: 'Design',
    position: 'Design Manager',
    status: 'onLeave',
    hireDate: '2019-06-22T00:00:00Z',
    managerId: null,
    mentorId: null,
    notes: 'Design manager currently on parental leave. Expected to return in July 2025.',
    projectAssignments: []
  },
  {
    id: '7',
    employeeId: 'EMP007',
    firstName: 'David',
    lastName: 'Garcia',
    email: 'david.garcia@company.com',
    department: 'Engineering',
    position: 'Frontend Developer',
    status: 'inactive',
    hireDate: '2023-01-10T00:00:00Z',
    managerId: '3',
    mentorId: '1',
    notes: 'Frontend developer specializing in React and CSS. Currently on extended leave for personal reasons.',
    projectAssignments: []
  }
];

const addMockEmployees = () => {
  const newEmployees = [...mockEmployees];
  
  for (let i = 0; i < 5; i++) {
    newEmployees.push({
      id: `mock-${Date.now()}-${i}`,
      employeeId: `EMP${100 + newEmployees.length}`,
      firstName: `New${i + 1}`,
      lastName: 'Employee',
      email: `new.employee${i + 1}@company.com`,
      department: i % 2 === 0 ? 'Engineering' : 'Marketing',
      position: i % 2 === 0 ? 'Developer' : 'Marketing Specialist',
      status: 'active' as 'active' | 'inactive' | 'onLeave',
      hireDate: new Date().toISOString(),
      managerId: null,
      mentorId: null,
      notes: 'Mock employee',
      projectAssignments: [],
    });
  }
  
  setEmployees(newEmployees);
};

const TalentPool = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // In a real application, we would use the API to fetch data
        // const data = await api.employees.getAll();
        
        // For now, we'll use mock data with a delay to simulate loading
        setTimeout(() => {
          setEmployees(mockEmployees);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load talent pool data",
          variant: "destructive"
        });
        setIsLoading(false);
      }
    };
    
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => 
    employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploadDialogOpen(false);
    
    try {
      // Show loading toast
      toast({
        title: "Processing...",
        description: "Uploading and processing talent pool data"
      });
      
      // Mock API call to process the file
      setTimeout(() => {
        toast({
          title: "Upload successful",
          description: "Talent pool data has been updated"
        });
        
        // Add a few more fake employees to simulate data import
        addMockEmployees();
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing the file",
        variant: "destructive"
      });
    }
  };

  const exportTalentPoolData = () => {
    toast({
      title: "Export started",
      description: "Talent pool data is being exported to Excel"
    });
    
    // Mock export functionality
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Talent pool data has been exported to Excel"
      });
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'onLeave': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Talent Pool</h1>
            <p className="text-muted-foreground">
              Manage and analyze organizational talent data
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportTalentPoolData}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload ILBAM Data
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                <span>Talent Database</span>
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search employees..."
                  className="pl-8 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <CardDescription>
              {isLoading ? 'Loading data...' : `${filteredEmployees.length} employees in the talent pool`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg">Loading talent pool data...</div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Projects</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.employeeId}</TableCell>
                      <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(employee.status)} text-white capitalize`}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {employee.projectAssignments.length}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setIsDetailDialogOpen(true);
                            }}
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              toast({
                                title: "Competency Matrix",
                                description: `Viewing competency matrix for ${employee.firstName} ${employee.lastName}`
                              });
                            }}
                            title="View competency matrix"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <div className="text-sm text-muted-foreground">
              Last updated: April 3, 2025
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportTalentPoolData}>
                <FileDown className="mr-2 h-4 w-4" />
                Export to Excel
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload ILBAM Data</DialogTitle>
            <DialogDescription>
              Upload an Excel file with the ILBAM talent pool data. The system will process and import the data.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="file-upload" className="text-sm font-medium">
                Select File (Excel format)
              </label>
              <Input
                id="file-upload"
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => document.getElementById('file-upload')?.click()}>
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Employee Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedEmployee?.firstName} {selectedEmployee?.lastName}
            </DialogDescription>
          </DialogHeader>
          {selectedEmployee && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm font-medium">Employee ID:</div>
                    <div className="text-sm">{selectedEmployee.employeeId}</div>
                    <div className="text-sm font-medium">Full Name:</div>
                    <div className="text-sm">{selectedEmployee.firstName} {selectedEmployee.lastName}</div>
                    <div className="text-sm font-medium">Email:</div>
                    <div className="text-sm">{selectedEmployee.email}</div>
                    <div className="text-sm font-medium">Hire Date:</div>
                    <div className="text-sm">{new Date(selectedEmployee.hireDate).toLocaleDateString()}</div>
                    <div className="text-sm font-medium">Status:</div>
                    <div className="text-sm capitalize">{selectedEmployee.status}</div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Position Information</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-sm font-medium">Department:</div>
                    <div className="text-sm">{selectedEmployee.department}</div>
                    <div className="text-sm font-medium">Position:</div>
                    <div className="text-sm">{selectedEmployee.position}</div>
                    <div className="text-sm font-medium">Manager:</div>
                    <div className="text-sm">{selectedEmployee.managerId ? "Assigned" : "None"}</div>
                    <div className="text-sm font-medium">Mentor:</div>
                    <div className="text-sm">{selectedEmployee.mentorId ? "Assigned" : "None"}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Project Assignments</h3>
                  <div className="mt-2">
                    {selectedEmployee.projectAssignments.length > 0 ? (
                      <ul className="space-y-2">
                        {selectedEmployee.projectAssignments.map((assignment) => (
                          <li key={assignment.id} className="text-sm border rounded p-2">
                            <div className="font-medium">{assignment.projectName}</div>
                            <div className="text-xs text-muted-foreground">Role: {assignment.role}</div>
                            <div className="text-xs text-muted-foreground">Start: {new Date(assignment.startDate).toLocaleDateString()}</div>
                            <div className="text-xs text-muted-foreground">Utilization: {assignment.utilizationPercentage}%</div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-muted-foreground">No project assignments</div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium">Notes</h3>
                  <div className="mt-2 text-sm border rounded p-2 min-h-[100px]">
                    {selectedEmployee.notes || "No notes available for this employee."}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => {
              setIsDetailDialogOpen(false);
              toast({
                title: "Edit mode",
                description: "This would open the employee edit form in a real application"
              });
            }}>
              Edit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default TalentPool;
