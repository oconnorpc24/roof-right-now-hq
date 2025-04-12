
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { crewsApi } from '@/services/api';

interface CrewMemberFormProps {
  crewId: string;
  onSubmit: () => void;
  initialData?: any;
  onCancel?: () => void;
}

export default function CrewMemberForm({ crewId, onSubmit, initialData, onCancel }: CrewMemberFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    address: initialData?.address || '',
    notes: initialData?.notes || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const memberData = {
        ...formData,
        crew_id: crewId
      };
      
      if (initialData) {
        await crewsApi.updateCrewMember(initialData.id, memberData);
      } else {
        await crewsApi.createCrewMember(memberData);
      }
      
      onSubmit();
    } catch (error) {
      console.error("Error submitting crew member:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          placeholder="Full name"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Role/Position</Label>
        <Input 
          id="role" 
          name="role" 
          value={formData.role} 
          onChange={handleChange} 
          placeholder="e.g. Foreman, Installer, Helper"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder="Phone number"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            name="email" 
            type="email"
            value={formData.email} 
            onChange={handleChange} 
            placeholder="Email address"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          placeholder="Home address"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea 
          id="notes" 
          name="notes" 
          value={formData.notes} 
          onChange={handleChange} 
          placeholder="Any additional information"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : initialData ? 'Update Member' : 'Add Member'}
        </Button>
      </div>
    </form>
  );
}
