import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, FileSpreadsheet, AlertTriangle, Trash2 } from 'lucide-react';
import { api } from '@/services/api';
import { Employee } from '@/types';
import { supabase } from '@/lib/supabase';

const TalentPool = () => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState<'competency' | 'retention' | 'ilbam'>('competency');
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const employees = await api.employees.getAll();
      setEmployees(employees);
      setError(null);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Failed to load employees. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      let result;
      
      switch (uploadType) {
        case 'competency':
          result = await api.files.uploadCompetencyMatrix(file);
          break;
        case 'retention':
          result = await api.files.uploadRetentionMatrix(file);
          break;
        case 'ilbam':
          result = await api.files.uploadILBAMTalentPool(file);
          break;
      }
      
      if (result.success) {
        toast({
          title: "Upload successful",
          description: result.message,
        });
        
        // Refresh employee data
        fetchEmployees();
        
        // Reset file input
        setFile(null);
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        throw new Error(result.message);
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      toast({
        title: "Upload failed",
        description: err.message || "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      // Delete employee from Supabase
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);
        
      if (error) throw error;
      
      // Update local state
      const newEmployees = employees.filter(emp => emp.id !== employeeId);
      setEmployees(newEmployees);
      
      toast({
        title: "Employee deleted",
        description: "The employee has been removed from the talent pool.",
      });
    } catch (err: any) {
      console.error('Delete error:', err);
      toast({
        title: "Delete failed",
        description: err.message || "There was an error deleting the employee.",
        variant: "destructive",
      });
    }
  };

  // Filter employees based on search term and filters
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      searchTerm === '' || 
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesDepartment = 
      departmentFilter === 'all' || 
      employee.department === departmentFilter;
      
    const matchesStatus = 
      statusFilter === 'all' || 
      employee.status === statusFilter;
      
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // Get unique departments for filter
  const departments = ['all', ...new Set(employees.map(emp => emp.department))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Talent Pool</h1>
          <p className="text-muted-foreground">
            Manage your organization's talent pool and upload matrices
          </p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Data
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Data</DialogTitle>
              <DialogDescription>
                Upload competency matrices, retention data, or ILBAM talent pool information.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="upload-type">Data Type</Label>
                <Select 
                  value={uploadType} 
                  onValueChange={(value) => setUploadType(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select data type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="competency">Competency Matrix</SelectItem>
                    <SelectItem value="retention">Retention Matrix</SelectItem>
                    <SelectItem value="ilbam">ILBAM Talent Pool</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="file-upload">File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                />
                <p className="text-sm text-muted-foreground">
                  Accepted formats: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
              
              {uploadType === 'competency' && (
                <Alert>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Competency matrix should include employee ID, skill names, and ratings (0-5).
                  </AlertDescription>
                </Alert>
              )}
              
              {uploadType === 'retention' && (
                <Alert>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    Retention matrix should include employee ID and risk factors with ratings.
                  </AlertDescription>
                </Alert>
              )}
              
              {uploadType === 'ilbam' && (
                <Alert>
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  <AlertDescription>
                    ILBAM data should include employee details in the standard ILBAM format.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                onClick={handleUpload} 
                disabled={!file || isUploading}
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Employee Database</CardTitle>
          <CardDescription>
            View and manage all employees in your talent pool
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <Select 
                value={departmentFilter} 
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.filter(d => d !== 'all').map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="onLeave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="text-center py-8">Loading employees...</div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No employees found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          employee.status === 'active' ? 'bg-green-100 text-green-800' :
                          employee.status === 'inactive' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {employee.status}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(employee.hireDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete {employee.firstName} {employee.lastName} from the talent pool?
                                This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => handleDeleteEmployee(employee.id)}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {filteredEmployees.length} of {employees.length} employees
          </div>
          <Button variant="outline" onClick={fetchEmployees}>
            Refresh Data
          </Button>
        </CardFooter>
      </Card>
      
      <Tabs defaultValue="competency">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="competency">Competency Matrices</TabsTrigger>
          <TabsTrigger value="retention">Retention Matrices</TabsTrigger>
          <TabsTrigger value="ilbam">ILBAM Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="competency" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Competency Matrices</CardTitle>
              <CardDescription>
                View and analyze employee competency matrices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Select an employee to view their competency matrix.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="retention" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Retention Matrices</CardTitle>
              <CardDescription>
                View and analyze employee retention risk factors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Select an employee to view their retention matrix.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ilbam" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>ILBAM Data</CardTitle>
              <CardDescription>
                View and analyze ILBAM talent pool data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                ILBAM data visualization coming soon.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TalentPool;
