
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Upload, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Employee, IlbamMatrix } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

type IlbamMatrixUploadProps = {
  open: boolean;
  onClose: () => void;
  employees: Employee[];
};

const IlbamMatrixUpload: React.FC<IlbamMatrixUploadProps> = ({ open, onClose, employees }) => {
  const { auth } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [formData, setFormData] = useState({
    businessUnderstanding: 3,
    leadership: 3,
    innovationCapability: 3,
    teamwork: 3,
    adaptability: 3,
    motivation: 3
  });

  const handleChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedEmployee || !auth.user) return;
    
    setIsUploading(true);
    
    try {
      const matrixData: Omit<IlbamMatrix, 'id'> = {
        employeeId: selectedEmployee,
        businessUnderstanding: formData.businessUnderstanding,
        leadership: formData.leadership,
        innovationCapability: formData.innovationCapability,
        teamwork: formData.teamwork,
        adaptability: formData.adaptability,
        motivation: formData.motivation,
        lastUpdated: new Date().toISOString(),
        updatedBy: auth.user.id
      };
      
      const result = await api.ilbam.uploadIlbamMatrix(matrixData);
      
      if (result) {
        toast({
          title: 'ILBAM Matrix uploaded',
          description: 'The ILBAM Matrix has been successfully uploaded.',
        });
        queryClient.invalidateQueries({ queryKey: ['ilbam-matrices'] });
        onClose();
      } else {
        toast({
          title: 'Upload failed',
          description: 'Failed to upload the ILBAM Matrix. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error uploading ILBAM matrix:', error);
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upload ILBAM Matrix</DialogTitle>
          <DialogDescription>
            Enter ILBAM Matrix data for the selected employee
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="employee">Select Employee</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger id="employee">
                <SelectValue placeholder="Select an employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.firstName} {employee.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {Object.entries(formData).map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <div key={key} className="grid gap-2">
                <Label htmlFor={key}>{label} (1-5)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={key}
                    type="range"
                    min={1}
                    max={5}
                    value={value}
                    onChange={(e) => handleChange(key, parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{value}</span>
                </div>
              </div>
            );
          })}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!selectedEmployee || isUploading}
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

export default IlbamMatrixUpload;
