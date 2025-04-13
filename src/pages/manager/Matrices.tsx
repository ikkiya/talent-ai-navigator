
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Employee, MatrixColumn, COMPETENCY_CATEGORIES } from '@/types';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { FileSpreadsheet, Upload, BarChart4 } from 'lucide-react';
import FlexibleMatrixTable from '@/components/matrices/FlexibleMatrixTable';
import RetentionMatrixTable from '@/components/matrices/RetentionMatrixTable';
import FlexibleMatrixUpload from '@/components/matrices/FlexibleMatrixUpload';

// Sample competency matrix columns based on the examples
const COMPETENCY_COLUMNS: MatrixColumn[] = [
  // DevSecOps
  { key: 'kubernetes', label: 'Kubernetes', category: COMPETENCY_CATEGORIES.devSecOps },
  { key: 'docker', label: 'Docker', category: COMPETENCY_CATEGORIES.devSecOps },
  { key: 'jenkins', label: 'Jenkins', category: COMPETENCY_CATEGORIES.devSecOps },
  { key: 'gitlab', label: 'GitLab', category: COMPETENCY_CATEGORIES.devSecOps },
  { key: 'github', label: 'GitHub', category: COMPETENCY_CATEGORIES.devSecOps },
  { key: 'grafana', label: 'Grafana', category: COMPETENCY_CATEGORIES.devSecOps },
  { key: 'ansible', label: 'Ansible', category: COMPETENCY_CATEGORIES.devSecOps },
  
  // Data Management
  { key: 'sql', label: 'SQL', category: COMPETENCY_CATEGORIES.dataManagement },
  { key: 'mysql', label: 'MySQL', category: COMPETENCY_CATEGORIES.dataManagement },
  { key: 'postgresql', label: 'PostgreSQL', category: COMPETENCY_CATEGORIES.dataManagement },
  { key: 'mongodb', label: 'MongoDB', category: COMPETENCY_CATEGORIES.dataManagement },
  { key: 'data_modeling', label: 'Data Modeling', category: COMPETENCY_CATEGORIES.dataManagement },
  
  // Data Science
  { key: 'python', label: 'Python', category: COMPETENCY_CATEGORIES.dataScience },
  { key: 'r', label: 'R', category: COMPETENCY_CATEGORIES.dataScience },
  { key: 'hadoop', label: 'Hadoop', category: COMPETENCY_CATEGORIES.dataScience },
  { key: 'spark', label: 'Spark', category: COMPETENCY_CATEGORIES.dataScience },
  
  // Coding
  { key: 'javascript', label: 'JavaScript', category: COMPETENCY_CATEGORIES.coding },
  { key: 'typescript', label: 'TypeScript', category: COMPETENCY_CATEGORIES.coding },
  { key: 'java', label: 'Java', category: COMPETENCY_CATEGORIES.coding },
  { key: 'csharp', label: 'C#', category: COMPETENCY_CATEGORIES.coding },
  
  // Systems
  { key: 'linux', label: 'Linux', category: COMPETENCY_CATEGORIES.systems },
  { key: 'windows', label: 'Windows', category: COMPETENCY_CATEGORIES.systems },
  { key: 'aws', label: 'AWS', category: COMPETENCY_CATEGORIES.systems },
  { key: 'azure', label: 'Azure', category: COMPETENCY_CATEGORIES.systems },
];

// Sample retention matrix columns based on the examples
const RETENTION_COLUMNS = [
  { key: 'key_position', label: 'KP' },
  { key: 'hard_position', label: 'HP' },
  { key: 'backup_identified', label: 'Backup Ident.' },
  { key: 'formation', label: 'Formation' },
  { key: 'point_management', label: 'Point Manage.' },
  { key: 'remuneration', label: 'Rémunération' },
  { key: 'seniority', label: 'Séniorité' },
  { key: 'diversity', label: 'Diversité' },
  { key: 'opportunities', label: 'Opportunités' },
  { key: 'trend', label: 'Tendance' },
];

const Matrices = () => {
  const [activeTab, setActiveTab] = useState('view');
  const [competencyUploadOpen, setCompetencyUploadOpen] = useState(false);
  const [retentionUploadOpen, setRetentionUploadOpen] = useState(false);
  const { toast } = useToast();
  
  const { data: employees = [], isLoading } = useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
  });
  
  // Create a map of employee names for display
  const employeeNames: Record<string, string> = {};
  employees.forEach(emp => {
    employeeNames[emp.id] = `${emp.firstName} ${emp.lastName}`;
  });
  
  // Extract competency and retention data from employees
  const competencyData: Record<string, Record<string, number>> = {};
  const retentionData: Record<string, Record<string, number>> = {};
  
  employees.forEach(emp => {
    if (emp.competencyMatrix) {
      competencyData[emp.id] = emp.competencyMatrix;
    }
    
    if (emp.retentionMatrix) {
      retentionData[emp.id] = emp.retentionMatrix;
    }
  });
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Matrix Management</h1>
            <p className="text-muted-foreground">
              Upload and view employee competency and retention matrices
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setCompetencyUploadOpen(true)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Upload Competency Matrix
            </Button>
            <Button variant="outline" onClick={() => setRetentionUploadOpen(true)}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Upload Retention Matrix
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="view" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="view">View Matrices</TabsTrigger>
            <TabsTrigger value="ilbam">ILBAM Matrix</TabsTrigger>
          </TabsList>
          
          <TabsContent value="view" className="space-y-6 mt-6">
            <FlexibleMatrixTable 
              title="Competency Matrix"
              description="Employee skills and proficiency levels"
              data={competencyData}
              columns={COMPETENCY_COLUMNS}
              employeeIds={Object.keys(competencyData)}
              employeeNames={employeeNames}
            />
            
            <RetentionMatrixTable 
              data={retentionData}
              employeeNames={employeeNames}
              columns={RETENTION_COLUMNS}
            />
          </TabsContent>
          
          <TabsContent value="ilbam" className="mt-6">
            {/* This tab will show the ILBAM matrix component that's already implemented */}
            <div className="flex items-center justify-center p-8 border rounded-md">
              <div className="text-center">
                <BarChart4 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">ILBAM Matrix</h3>
                <p className="text-muted-foreground mb-4">
                  View and manage ILBAM matrices on the Talent Pool page
                </p>
                <Button 
                  variant="default" 
                  onClick={() => window.location.href = '/admin/talent-pool'}
                >
                  Go to Talent Pool
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Flexible Matrix Upload Dialogs */}
      <FlexibleMatrixUpload 
        open={competencyUploadOpen}
        onClose={() => setCompetencyUploadOpen(false)}
        matrixType="competency"
        title="Competency Matrix"
        description="Upload an Excel file with employee skills and proficiency levels"
        sampleColumns={COMPETENCY_COLUMNS}
      />
      
      <FlexibleMatrixUpload 
        open={retentionUploadOpen}
        onClose={() => setRetentionUploadOpen(false)}
        matrixType="retention"
        title="Retention Matrix" 
        description="Upload an Excel file with employee retention factors and risk scores"
        sampleColumns={RETENTION_COLUMNS}
      />
    </Layout>
  );
};

export default Matrices;
