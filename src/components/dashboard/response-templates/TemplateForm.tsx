
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { ResponseTemplate } from './types';

interface TemplateFormProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  currentTemplate: ResponseTemplate | null;
  resetForm: () => void;
}

export function TemplateForm({ isOpen, setIsOpen, currentTemplate, resetForm }: TemplateFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {currentTemplate ? "Edit Template" : "Create New Template"}
          </DialogTitle>
          <DialogDescription>
            Create reusable templates for common responses to clients.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Template Name</Label>
            <Input 
              id="name" 
              placeholder="e.g., Initial Lead Response" 
              defaultValue={currentTemplate?.name || ''}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select 
              id="category" 
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue={currentTemplate?.category || 'general'}
            >
              <option value="lead">Lead Response</option>
              <option value="quote">Quote Related</option>
              <option value="follow-up">Follow-up</option>
              <option value="general">General</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Template Content</Label>
            <Textarea 
              id="content" 
              placeholder="Enter the template content. Use placeholders like [Customer Name] for dynamic content." 
              className="min-h-[200px]"
              defaultValue={currentTemplate?.content || ''}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetForm}>Cancel</Button>
          <Button type="submit">Save Template</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
