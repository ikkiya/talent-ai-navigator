
import React from 'react';
import Layout from '@/components/Layout';
import { api } from '@/backend/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSpreadsheet, Upload } from 'lucide-react';
import FlexibleMatrixUpload from '@/components/matrices/FlexibleMatrixUpload';
import { useState } from 'react';
import { MatrixColumn } from '@/types';

const Matrices = () => {
  const [isCompetencyDialogOpen, setIsCompetencyDialogOpen] = useState(false);
  const [isRetentionDialogOpen, setIsRetentionDialogOpen] = useState(false);
  
  const sampleCompetencyColumns: MatrixColumn[] = [
    { key: 'communication', label: 'Communication', category: 'Soft Skills' },
    { key: 'teamwork', label: 'Teamwork', category: 'Soft Skills' },
    { key: 'problemSolving', label: 'Problem Solving', category: 'Soft Skills' },
    { key: 'leadership', label: 'Leadership', category: 'Soft Skills' },
    { key: 'technicalSkills', label: 'Technical Skills', category: 'Hard Skills' },
    { key: 'projectManagement', label: 'Project Management', category: 'Hard Skills' },
    { key: 'dataAnalysis', label: 'Data Analysis', category: 'Hard Skills' },
    { key: 'coding', label: 'Coding', category: 'Hard Skills' },
  ];
  
  return (
    <Layout>
      <div className="container mx-auto py-10">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
                Competency Matrix
              </CardTitle>
              <CardDescription>
                Upload a matrix to assess employee skills and competencies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Upload an Excel file containing employee IDs and their competency scores.
              </p>
              <Button 
                onClick={() => setIsCompetencyDialogOpen(true)}
                className="mt-4"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Competency Matrix
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileSpreadsheet className="mr-2 h-5 w-5 text-primary" />
                Retention Matrix
              </CardTitle>
              <CardDescription>
                Upload a matrix to assess employee retention risks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Upload an Excel file containing employee IDs and their retention risk factors.
              </p>
              <Button 
                onClick={() => setIsRetentionDialogOpen(true)}
                className="mt-4"
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Retention Matrix
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <FlexibleMatrixUpload
          open={isCompetencyDialogOpen}
          onClose={() => setIsCompetencyDialogOpen(false)}
          matrixType="competency"
          title="Competency Matrix"
          description="Upload an Excel file containing employee IDs and their competency scores."
          sampleColumns={sampleCompetencyColumns}
        />
        
        <FlexibleMatrixUpload
          open={isRetentionDialogOpen}
          onClose={() => setIsRetentionDialogOpen(false)}
          matrixType="retention"
          title="Retention Matrix"
          description="Upload an Excel file containing employee IDs and their retention risk factors."
        />
      </div>
    </Layout>
  );
};

export default Matrices;
