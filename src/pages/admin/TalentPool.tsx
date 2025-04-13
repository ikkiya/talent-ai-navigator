import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Filter, Plus, Search, UserPlus, BarChart4, FileSpreadsheet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Employee, IlbamMatrix } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import IlbamMatrixUpload from '@/components/ilbam/IlbamMatrixUpload';
import IlbamMatrixTable from '@/components/ilbam/IlbamMatrixTable';
import IlbamMatrixDialog from '@/components/ilbam/IlbamMatrixDialog';

const generateEmployeeId = () => {
  return 'EMP' + Math.floor(Math.random() * 9000 + 1000);
};

const EmployeeForm = ({
  onSubmit,
  initialData,
  formTitle = "Add New Employee",
  submitLabel = "Add Employee"
}: {
  onSubmit: (data: Partial<Employee>) => void;
  initialData?: Partial<Employee>;
  formTitle?: string;
  submitLabel?: string;
}) => {
  const [firstName, setFirstName] = useState(initialData?.firstName || '');
  const [lastName, setLastName] = useState(initialData?.lastName || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [department, setDepartment] = useState(initialData?.department || '');
  const [position, setPosition] = useState(initialData?.position || '');
  const [status, setStatus] = useState<'active' | 'inactive' | 'onLeave'>(
    (initialData?.status as 'active' | 'inactive' | 'onLeave') || 'active'
  );

  const handleSubmit = () => {
    onSubmit({
      firstName,
      lastName,
      email,
      department,
      position,
      status,
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={status} 
            onValueChange={(value: string) => setStatus(value as 'active' | 'inactive' | 'onLeave')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="onLeave">On Leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="pt-4">
        <Button onClick={handleSubmit} className="w-full">
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};

const TalentPool = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [ilbamUploadOpen, setIlbamUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: '',
  });
  const [activeTab, setActiveTab] = useState('employees');
  const [selectedMatrix, setSelectedMatrix] = useState<IlbamMatrix | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [matrixDialogMode, setMatrixDialogMode] = useState<'view' | 'edit'>('view');
  const [matrixDialogOpen, setMatrixDialogOpen] = useState(false);
  
  const { auth } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isAdmin = auth.user?.role === 'admin';

  const { data: employees = [], isLoading, error } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
  });

  const handleAddEmployee = async (data: Partial<Employee>) => {
    const newEmployee = {
      ...data,
      employeeId: generateEmployeeId(),
      status: data.status as 'active' | 'inactive' | 'onLeave' || 'active',
      hireDate: new Date().toISOString(),
      projectAssignments: [],
    };
    
    try {
      await api.employees.create(newEmployee as Omit<Employee, 'id'>);
      toast({
        title: "Employee added",
        description: `${data.firstName} ${data.lastName} has been added to the talent pool.`,
      });
      setAddDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    } catch (error) {
      console.error("Error adding employee:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add employee. Please try again.",
      });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredEmployees = employees.filter((employee) => {
    const searchRegex = new RegExp(searchQuery, 'i');
    const matchesSearch =
      searchRegex.test(employee.firstName) || searchRegex.test(employee.lastName) || searchRegex.test(employee.email);

    const matchesFilters =
      (filters.department === '' || filters.department === 'all-departments' || employee.department === filters.department) &&
      (filters.status === '' || filters.status === 'all-statuses' || employee.status === filters.status);

    return matchesSearch && matchesFilters;
  });
  
  const handleViewMatrix = (matrix: IlbamMatrix, employee: Employee) => {
    setSelectedMatrix(matrix);
    setSelectedEmployee(employee);
    setMatrixDialogMode('view');
    setMatrixDialogOpen(true);
  };
  
  const handleEditMatrix = (matrix: IlbamMatrix, employee: Employee) => {
    setSelectedMatrix(matrix);
    setSelectedEmployee(employee);
    setMatrixDialogMode('edit');
    setMatrixDialogOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Talent Pool</h1>
          <div className="flex gap-2">
            <Button onClick={() => setAddDialogOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
            {isAdmin && (
              <Button 
                variant="outline" 
                onClick={() => setIlbamUploadOpen(true)}
              >
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Upload ILBAM Matrix
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="employees">Employee List</TabsTrigger>
            <TabsTrigger value="ilbam">ILBAM Matrices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="employees">
            <Card>
              <CardHeader>
                <CardTitle>Employee List</CardTitle>
                <CardDescription>Manage your team members and their project assignments.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between py-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search employees..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <div className="space-x-2">
                    <Select onValueChange={(value) => setFilters({ ...filters, department: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-departments">All Departments</SelectItem>
                        {Array.from(new Set(employees.map((emp) => emp.department))).map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select onValueChange={(value) => setFilters({ ...filters, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-statuses">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="onLeave">On Leave</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">Loading...</TableCell>
                      </TableRow>
                    ) : error ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">Error: {error.message}</TableCell>
                      </TableRow>
                    ) : filteredEmployees.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">No employees found.</TableCell>
                      </TableRow>
                    ) : (
                      filteredEmployees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>{employee.firstName} {employee.lastName}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.position}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>
                            <Badge variant={
                              employee.status === 'active' ? 'default' :
                                employee.status === 'inactive' ? 'destructive' :
                                  'outline'
                            }>
                              {employee.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ilbam">
            <IlbamMatrixTable 
              employees={employees}
              onEdit={handleEditMatrix}
              onView={handleViewMatrix}
            />
          </TabsContent>
        </Tabs>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Fill out the form below to add a new employee to the talent pool.
              </DialogDescription>
            </DialogHeader>
            <EmployeeForm onSubmit={handleAddEmployee} />
          </DialogContent>
        </Dialog>
        
        {isAdmin && (
          <IlbamMatrixUpload 
            open={ilbamUploadOpen}
            onClose={() => setIlbamUploadOpen(false)}
            employees={employees}
          />
        )}
        
        <IlbamMatrixDialog 
          matrix={selectedMatrix}
          employee={selectedEmployee}
          isOpen={matrixDialogOpen}
          onClose={() => setMatrixDialogOpen(false)}
          mode={matrixDialogMode}
        />
      </div>
    </Layout>
  );
};

export default TalentPool;
