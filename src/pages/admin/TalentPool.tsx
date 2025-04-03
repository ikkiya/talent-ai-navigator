
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { FileSpreadsheet, Search, Download, Upload, Eye, FileChart, FileDown } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Employee } from '@/types';

const TalentPool = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  
  // Mock loading employees on component mount
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await api.employees.getAll();
        setEmployees(data);
        setIsLoading(false);
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
      
      // Call the API to process the file
      const result = await api.files.uploadILBAMTalentPool(file);
      
      if (result.success) {
        toast({
          title: "Upload successful",
          description: result.message
        });
        
        // Refresh the data
        const data = await api.employees.getAll();
        setEmployees(data);
      } else {
        toast({
          title: "Upload failed",
          description: result.message,
          variant: "destructive"
        });
      }
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
                            <FileChart className="h-4 w-4" />
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
