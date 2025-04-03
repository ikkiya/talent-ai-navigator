import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { FileSpreadsheet, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';
import { useQuery } from '@tanstack/react-query';

const MatrixUploadCard = ({ 
  title, 
  description, 
  uploadHandler 
}: { 
  title: string; 
  description: string; 
  uploadHandler: (file: File) => Promise<void>;
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadComplete(false);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      await uploadHandler(file);
      setUploadComplete(true);
      toast({
        title: "Upload successful",
        description: `${title} has been uploaded and processed successfully.`,
      });
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="file-upload">Excel File</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="file-upload" 
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="flex-1"
            />
          </div>
          {file && (
            <p className="text-sm text-muted-foreground mt-1">
              Selected: {file.name}
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          onClick={handleUpload} 
          disabled={!file || isUploading || uploadComplete}
          className="relative"
        >
          {isUploading ? (
            <>
              <span className="mr-2">Uploading...</span>
            </>
          ) : uploadComplete ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <span>Uploaded</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              <span>Upload File</span>
            </>
          )}
        </Button>
        
        {uploadComplete && (
          <Button variant="outline" onClick={() => setFile(null)}>
            Upload Another
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

const CompetencyMatrixTable = ({ employeeId }: { employeeId?: string }) => {
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
  });
  
  // If employeeId is provided, find that employee
  // Otherwise use the first employee in the list
  const employee = employeeId 
    ? employees?.find(e => e.id === employeeId) 
    : employees?.[0];
  
  if (!employee || !employee.competencyMatrix) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/30">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 font-medium">No Competency Data Available</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This employee doesn't have any competency data yet.
          Please upload a competency matrix.
        </p>
      </div>
    );
  }
  
  const skills = Object.keys(employee.competencyMatrix);
  const scores = Object.values(employee.competencyMatrix);
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="matrix-header text-left">Skill</th>
            <th className="matrix-header w-24">Score (0-5)</th>
            <th className="matrix-header text-left">Level</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill, index) => {
            const score = scores[index];
            let level = "Novice";
            if (score >= 4) level = "Expert";
            else if (score >= 3) level = "Advanced";
            else if (score >= 2) level = "Intermediate";
            
            return (
              <tr key={skill}>
                <td className="matrix-cell text-left">{skill}</td>
                <td className={`matrix-cell matrix-score-${score}`}>{score}</td>
                <td className="matrix-cell text-left">{level}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const RetentionMatrixTable = ({ employeeId }: { employeeId?: string }) => {
  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: api.employees.getAll,
  });
  
  // If employeeId is provided, find that employee
  // Otherwise use the first employee in the list
  const employee = employeeId 
    ? employees?.find(e => e.id === employeeId) 
    : employees?.[0];
  
  if (!employee || !employee.retentionMatrix) {
    return (
      <div className="text-center p-8 border rounded-md bg-muted/30">
        <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground" />
        <h3 className="mt-4 font-medium">No Retention Data Available</h3>
        <p className="text-sm text-muted-foreground mt-2">
          This employee doesn't have any retention data yet.
          Please upload a retention matrix.
        </p>
      </div>
    );
  }
  
  const factors = Object.keys(employee.retentionMatrix);
  const scores = Object.values(employee.retentionMatrix);
  
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="matrix-header text-left">Factor</th>
            <th className="matrix-header w-24">Score (0-5)</th>
            <th className="matrix-header text-left">Risk Level</th>
          </tr>
        </thead>
        <tbody>
          {factors.map((factor, index) => {
            const score = scores[index];
            let risk = "High Risk";
            if (score >= 4) risk = "Low Risk";
            else if (score >= 3) risk = "Medium Risk";
            
            return (
              <tr key={factor}>
                <td className="matrix-cell text-left">{factor}</td>
                <td className={`matrix-cell matrix-score-${score}`}>{score}</td>
                <td className="matrix-cell text-left">{risk}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Matrices = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const { toast } = useToast();
  
  const handleCompetencyUpload = async (file: File) => {
    try {
      const result = await api.files.uploadCompetencyMatrix(file);
      if (result.success) {
        // Force a refetch of employee data if needed
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error processing the competency matrix.",
      });
      throw error;
    }
  };
  
  const handleRetentionUpload = async (file: File) => {
    try {
      const result = await api.files.uploadRetentionMatrix(file);
      if (result.success) {
        // Force a refetch of employee data if needed
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: "There was an error processing the retention matrix.",
      });
      throw error;
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matrix Management</h1>
          <p className="text-muted-foreground">
            Upload and manage competency and retention matrices
          </p>
        </div>
        
        <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="view">View & Edit</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <MatrixUploadCard 
                title="Competency Matrix"
                description="Upload an Excel file with employee skills and proficiency levels"
                uploadHandler={handleCompetencyUpload}
              />
              
              <MatrixUploadCard 
                title="Retention Matrix"
                description="Upload an Excel file with employee retention factors and risk scores"
                uploadHandler={handleRetentionUpload}
              />
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>File Format Guidelines</CardTitle>
                <CardDescription>Ensure your Excel files follow these formats</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Competency Matrix Format</h3>
                    <ul className="list-disc list-inside text-sm space-y-1 mt-2 text-muted-foreground">
                      <li>First column: Employee ID</li>
                      <li>First row: Skill names (JavaScript, Java, React, etc.)</li>
                      <li>Data cells: Proficiency scores from 0-5</li>
                      <li>0 = No knowledge, 5 = Expert level</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium">Retention Matrix Format</h3>
                    <ul className="list-disc list-inside text-sm space-y-1 mt-2 text-muted-foreground">
                      <li>First column: Employee ID</li>
                      <li>First row: Retention factors (Career Growth, Compensation, etc.)</li>
                      <li>Data cells: Satisfaction scores from 0-5</li>
                      <li>0 = High risk of leaving, 5 = Highly satisfied</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="view" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Competency Matrix</CardTitle>
                <CardDescription>
                  View and edit employee skills and proficiency levels
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CompetencyMatrixTable />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Retention Matrix</CardTitle>
                <CardDescription>
                  View and edit employee retention factors and risk scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RetentionMatrixTable />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Matrices;
