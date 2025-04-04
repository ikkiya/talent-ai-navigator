
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpFromLine, FileSpreadsheet, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/services/api';
import { Employee } from '@/types';

const TalentPool = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'competency' | 'retention' | 'ilbam'>('competency');
  const [competencyFile, setCompetencyFile] = useState<File | null>(null);
  const [retentionFile, setRetentionFile] = useState<File | null>(null);
  const [ilbamFile, setIlbamFile] = useState<File | null>(null);
  
  // For manual entry
  const [manualEmployees, setManualEmployees] = useState<Employee[]>([]);
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    department: '',
    position: '',
    hireDate: '',
    status: 'active' as const,
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    
    switch (uploadType) {
      case 'competency':
        setCompetencyFile(file);
        break;
      case 'retention':
        setRetentionFile(file);
        break;
      case 'ilbam':
        setIlbamFile(file);
        break;
    }
  };
  
  const handleUpload = async () => {
    let file: File | null = null;
    let uploadFunction: (file: File) => Promise<{ success: boolean; message: string }>;
    
    switch (uploadType) {
      case 'competency':
        file = competencyFile;
        uploadFunction = api.files.uploadCompetencyMatrix;
        break;
      case 'retention':
        file = retentionFile;
        uploadFunction = api.files.uploadRetentionMatrix;
        break;
      case 'ilbam':
        file = ilbamFile;
        uploadFunction = api.files.uploadILBAMTalentPool;
        break;
      default:
        toast({
          title: "Error",
          description: "Invalid upload type selected",
          variant: "destructive",
        });
        return;
    }
    
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    try {
      const result = await uploadFunction(file);
      
      if (result.success) {
        toast({
          title: "Upload Successful",
          description: result.message,
        });
        
        // Reset file input
        switch (uploadType) {
          case 'competency':
            setCompetencyFile(null);
            break;
          case 'retention':
            setRetentionFile(null);
            break;
          case 'ilbam':
            setIlbamFile(null);
            break;
        }
      } else {
        toast({
          title: "Upload Failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleManualAdd = () => {
    // Validation
    if (!newEmployee.employeeId || !newEmployee.firstName || !newEmployee.lastName || !newEmployee.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const employee: Employee = {
      ...newEmployee,
      id: crypto.randomUUID(),
      projectAssignments: [],
    };
    
    // Add to state
    const updatedEmployees = [...manualEmployees, employee];
    setManualEmployees(updatedEmployees);
    
    // Reset form
    setNewEmployee({
      id: '',
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      department: '',
      position: '',
      hireDate: '',
      status: 'active' as const,
    });
    
    toast({
      title: "Employee Added",
      description: "Employee has been added to the talent pool",
    });
  };
  
  const getFileStatus = (file: File | null) => {
    if (!file) return "No file selected";
    return `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Talent Pool</h2>
          <p className="text-muted-foreground">
            Upload and manage your employee talent pool with skills matrices
          </p>
        </div>
        
        <Tabs defaultValue="upload" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
                <CardDescription>
                  Upload your employee data, competency matrices, and retention factors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="uploadType">Upload Type</Label>
                    <select 
                      id="uploadType"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={uploadType}
                      onChange={(e) => setUploadType(e.target.value as any)}
                    >
                      <option value="competency">Competency Matrix</option>
                      <option value="retention">Retention Matrix</option>
                      <option value="ilbam">ILBAM Talent Pool</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="file">File</Label>
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
                      <Input 
                        id="file" 
                        type="file" 
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                      />
                      <Button 
                        onClick={handleUpload}
                        disabled={isUploading || (
                          (uploadType === 'competency' && !competencyFile) ||
                          (uploadType === 'retention' && !retentionFile) ||
                          (uploadType === 'ilbam' && !ilbamFile)
                        )}
                      >
                        <ArrowUpFromLine className="mr-2 h-4 w-4" />
                        {isUploading ? "Uploading..." : "Upload"}
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {uploadType === 'competency' && getFileStatus(competencyFile)}
                      {uploadType === 'retention' && getFileStatus(retentionFile)}
                      {uploadType === 'ilbam' && getFileStatus(ilbamFile)}
                    </p>
                  </div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-md flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium">File Format Instructions</p>
                    <p className="text-muted-foreground mt-1">
                      {uploadType === 'competency' && "Upload a CSV or Excel file with employee IDs and skill ratings (0-5) for each competency area."}
                      {uploadType === 'retention' && "Upload a CSV or Excel file with employee IDs and ratings (0-5) for retention risk factors."}
                      {uploadType === 'ilbam' && "Upload the standard ILBAM talent pool export file with all employee data."}
                    </p>
                    <a href="#" className="text-primary hover:underline text-xs mt-2 inline-block">
                      <FileSpreadsheet className="h-3 w-3 inline mr-1" />
                      Download sample template
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="manual" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Manual Entry</CardTitle>
                <CardDescription>
                  Add employees to the talent pool manually
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID</Label>
                    <Input 
                      id="employeeId" 
                      value={newEmployee.employeeId}
                      onChange={(e) => setNewEmployee({...newEmployee, employeeId: e.target.value})}
                      placeholder="E.g., EMP12345"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      placeholder="employee@company.com"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input 
                      id="firstName" 
                      value={newEmployee.firstName}
                      onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                      placeholder="First name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input 
                      id="lastName" 
                      value={newEmployee.lastName}
                      onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                      placeholder="Last name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department" 
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                      placeholder="E.g., Engineering"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="position">Position</Label>
                    <Input 
                      id="position" 
                      value={newEmployee.position}
                      onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                      placeholder="E.g., Senior Developer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">Hire Date</Label>
                    <Input 
                      id="hireDate" 
                      type="date"
                      value={newEmployee.hireDate}
                      onChange={(e) => setNewEmployee({...newEmployee, hireDate: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <select 
                      id="status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newEmployee.status}
                      onChange={(e) => setNewEmployee({...newEmployee, status: e.target.value as 'active' | 'inactive' | 'onLeave'})}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="onLeave">On Leave</option>
                    </select>
                  </div>
                </div>
                
                <Button onClick={handleManualAdd} className="w-full mt-4">
                  Add Employee
                </Button>
                
                {manualEmployees.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Added Employees ({manualEmployees.length})</h3>
                    <div className="border rounded-md">
                      <div className="grid grid-cols-3 gap-2 p-2 border-b font-medium text-sm">
                        <div>Name</div>
                        <div>ID</div>
                        <div>Department</div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {manualEmployees.map((emp) => (
                          <div key={emp.id} className="grid grid-cols-3 gap-2 p-2 border-b last:border-b-0 text-sm">
                            <div>{emp.firstName} {emp.lastName}</div>
                            <div>{emp.employeeId}</div>
                            <div>{emp.department}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default TalentPool;
