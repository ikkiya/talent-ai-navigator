
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '@/backend/services/api';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { IlbamMatrix, Employee } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface IlbamMatrixDialogProps {
  matrix: IlbamMatrix | null;
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'view' | 'edit';
}

const IlbamMatrixDialog: React.FC<IlbamMatrixDialogProps> = ({
  matrix,
  employee,
  isOpen,
  onClose,
  mode
}) => {
  const { auth } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<IlbamMatrix, 'id' | 'employeeId' | 'lastUpdated' | 'updatedBy'>>({
    businessUnderstanding: matrix?.businessUnderstanding || 1,
    leadership: matrix?.leadership || 1,
    innovationCapability: matrix?.innovationCapability || 1,
    teamwork: matrix?.teamwork || 1,
    adaptability: matrix?.adaptability || 1,
    motivation: matrix?.motivation || 1
  });
  
  // Update form data when matrix changes
  React.useEffect(() => {
    if (matrix) {
      setFormData({
        businessUnderstanding: matrix.businessUnderstanding,
        leadership: matrix.leadership,
        innovationCapability: matrix.innovationCapability,
        teamwork: matrix.teamwork,
        adaptability: matrix.adaptability,
        motivation: matrix.motivation
      });
    }
  }, [matrix]);
  
  const handleChange = (field: string, value: number) => {
    if (mode === 'edit') {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  const handleSubmit = async () => {
    if (!matrix || !auth.user) return;
    
    setIsSubmitting(true);
    
    try {
      const updatedMatrix = await api.ilbam.updateIlbamMatrix({
        ...matrix,
        ...formData,
        updatedBy: auth.user.id,
        lastUpdated: new Date().toISOString()
      });
      
      if (updatedMatrix) {
        toast({
          title: 'ILBAM Matrix updated',
          description: 'The ILBAM Matrix has been successfully updated.',
        });
        queryClient.invalidateQueries({ queryKey: ['ilbam-matrices'] });
        onClose();
      } else {
        toast({
          title: 'Update failed',
          description: 'Failed to update the ILBAM Matrix. Please try again.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Error updating ILBAM matrix:', error);
      toast({
        title: 'Update error',
        description: 'An error occurred while updating the matrix.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!matrix || !employee) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'view' ? 'View' : 'Edit'} ILBAM Matrix
          </DialogTitle>
          <DialogDescription>
            {employee.firstName} {employee.lastName} - {employee.position}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {Object.entries(formData).map(([key, value]) => {
            const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <div key={key} className="grid gap-2">
                <Label htmlFor={key}>{label}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id={key}
                    type="range"
                    min={1}
                    max={5}
                    value={value}
                    onChange={(e) => handleChange(key, parseInt(e.target.value))}
                    disabled={mode === 'view'}
                    className="flex-1"
                  />
                  <span className="w-8 text-center">{value}</span>
                </div>
              </div>
            );
          })}
          
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(matrix.lastUpdated).toLocaleString()}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          
          {mode === 'edit' && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IlbamMatrixDialog;
