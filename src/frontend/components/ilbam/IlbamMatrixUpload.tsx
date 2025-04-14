import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/backend/services/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Upload, FileSpreadsheet } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MatrixColumn } from '@/types';

interface FlexibleMatrixUploadProps {
  open: boolean;
  onClose: () => void;
  matrixType: 'competency' | 'retention';
  title: string;
  description: string;
  sampleColumns?: MatrixColumn[];
}

const FlexibleMatrixUpload: React.FC<FlexibleMatrixUploadProps> = ({
  open,
  onClose,
  matrixType,
  title,
  description,
  sampleColumns = []
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file || !auth.user) return;
    
    setIsUploading(true);
    
    try {
      let result;
      
      // Call appropriate API based on matrix type
      if (matrixType === 'competency') {
        result = await api.files.uploadCompetencyMatrix(file);
      } else {
        result = await api.files.uploadRetentionMatrix(file);
      }
      
      if (result.success) {
        toast({
          title: 'Matrix uploaded',
          description: `The ${title} has been successfully uploaded.`,
        });
        queryClient.invalidateQueries({ queryKey: ['employees'] });
        onClose();
      } else {
        toast({
          title: 'Upload failed',
          description: 'Failed to upload the matrix. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error(`Error uploading ${matrixType} matrix:`, error);
      toast({
        title: 'Upload error',
        description: 'An error occurred while uploading the matrix.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Upload {title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload">Upload</TabsTrigger>
            <TabsTrigger value="format">Format Guidelines</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="space-y-4 py-4">
            <div className="grid w-full items-center gap-4">
              <Label htmlFor="file-upload">Select Excel File</Label>
              <Input 
                id="file-upload" 
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="format" className="space-y-4 py-4">
            <Card>
              <CardHeader>
                <CardTitle>File Format Requirements</CardTitle>
                <CardDescription>
                  Please ensure your Excel file follows this format for correct processing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">General Format</h3>
                  <ul className="list-disc list-inside text-sm space-y-1 mt-2 text-muted-foreground">
                    <li>First column: Employee ID</li>
                    <li>First row: Column headers (skills or factors)</li>
                    <li>Data cells: Rating scores from 1-5</li>
                    <li>1 = Lowest level, 5 = Highest level</li>
                  </ul>
                </div>
                
                {matrixType === 'competency' && (
                  <div>
                    <h3 className="font-medium">Competency Matrix Format</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your file should include these skill categories and columns (more can be added):
                    </p>
                    <div className="mt-2 border rounded-md p-2 overflow-auto max-h-32">
                      <div className="text-xs grid grid-cols-2 gap-2">
                        {sampleColumns.map(col => (
                          <div key={col.key} className="flex items-center gap-1">
                            <span className="font-medium">{col.label}</span>
                            <span className="text-muted-foreground">({col.category})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {matrixType === 'retention' && (
                  <div>
                    <h3 className="font-medium">Retention Matrix Format</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your file should include these retention factors (more can be added):
                    </p>
                    <div className="mt-2 border rounded-md p-2">
                      <ul className="text-xs grid grid-cols-2 gap-2">
                        <li>Key Position (KP)</li>
                        <li>Hard Position (HP)</li>
                        <li>Backup Identified</li>
                        <li>Formation</li>
                        <li>Point Management</li>
                        <li>Rémunération</li>
                        <li>Séniorité</li>
                        <li>Diversité</li>
                        <li>Opportunités</li>
                        <li>Tendance</li>
                      </ul>
                    </div>
                    <p className="text-sm mt-2">
                      <span className="font-medium">Score interpretation:</span>
                      <br />
                      <span className="text-xs text-muted-foreground">
                        1-2 = High risk (red), 3 = Medium risk (yellow), 4-5 = Low risk (green)
                      </span>
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="font-medium">File Types Supported</h3>
                  <ul className="list-disc list-inside text-sm mt-2 text-muted-foreground">
                    <li>Excel (.xlsx, .xls)</li>
                    <li>CSV (.csv)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleUpload} 
            disabled={!file || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Matrix
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FlexibleMatrixUpload;
