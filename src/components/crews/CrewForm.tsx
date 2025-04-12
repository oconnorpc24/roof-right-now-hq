
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { crewsApi } from '@/services/api';
import { X } from 'lucide-react';

interface CrewFormProps {
  onSubmit: () => void;
  initialData?: any;
  onCancel?: () => void;
}

export default function CrewForm({ onSubmit, initialData, onCancel }: CrewFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    status: initialData?.status || 'available',
    specialties: initialData?.specialties || [],
    notes: initialData?.notes || '',
    newSpecialty: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddSpecialty = () => {
    if (formData.newSpecialty.trim()) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, prev.newSpecialty.trim()],
        newSpecialty: ''
      }));
    }
  };
  
  const handleRemoveSpecialty = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const crewData = {
        name: formData.name,
        status: formData.status,
        specialties: formData.specialties,
        notes: formData.notes
      };
      
      if (initialData) {
        await crewsApi.updateCrew(initialData.id, crewData);
      } else {
        await crewsApi.createCrew(crewData);
      }
      
      onSubmit();
    } catch (error) {
      console.error("Error submitting crew:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Crew Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Enter crew name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select 
          value={formData.status} 
          onValueChange={(value) => handleSelectChange('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="on-job">On Job</SelectItem>
            <SelectItem value="unavailable">Unavailable</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Specialties</Label>
        <div className="flex space-x-2">
          <Input 
            name="newSpecialty" 
            value={formData.newSpecialty} 
            onChange={handleChange} 
            placeholder="Add a specialty"
          />
          <Button type="button" onClick={handleAddSpecialty} size="sm">Add</Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.specialties.map((specialty: string, index: number) => (
            <div key={index} className="flex items-center bg-secondary text-secondary-foreground px-3 py-1 rounded-md">
              <span>{specialty}</span>
              <button 
                type="button" 
                onClick={() => handleRemoveSpecialty(index)}
                className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          name="notes" 
          value={formData.notes || ''} 
          onChange={handleChange} 
          placeholder="Additional notes about this crew"
          rows={4}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Crew' : 'Create Crew'}
        </Button>
      </div>
    </form>
  );
}
