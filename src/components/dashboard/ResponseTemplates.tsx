
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Copy, Edit, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types for response templates
interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: 'lead' | 'quote' | 'follow-up' | 'general';
  lastUsed?: string;
}

// Demo response templates
const demoTemplates: ResponseTemplate[] = [
  {
    id: '1',
    name: 'Initial Lead Response',
    content: "Thank you for reaching out to [Company Name]! We've received your inquiry about roofing services. One of our specialists will contact you within 24 hours to discuss your needs. For immediate assistance, please call us at [Phone Number].",
    category: 'lead',
    lastUsed: '2025-04-10'
  },
  {
    id: '2',
    name: 'Quote Follow-up',
    content: "Hello [Customer Name],\n\nI wanted to follow up on the roofing estimate we sent on [Date]. If you have any questions or would like to schedule a time to discuss further, please let me know. We're currently booking projects for next month and would love to get you on our schedule.\n\nBest regards,\n[Your Name]",
    category: 'quote',
    lastUsed: '2025-04-09'
  },
  {
    id: '3',
    name: 'Appointment Confirmation',
    content: "Your roof inspection is confirmed for [Date] at [Time]. Our inspector [Name] will arrive in a company vehicle. Please ensure access to your property is available. If you need to reschedule, please call us at [Phone Number] at least 24 hours in advance.",
    category: 'follow-up'
  },
  {
    id: '4',
    name: 'Thank You After Job',
    content: "Thank you for choosing [Company Name] for your roofing project! We appreciate your business and hope you're satisfied with our work. If you have a moment, we'd love for you to leave us a review on Google or our website. If you have any questions about your new roof, please don't hesitate to reach out.",
    category: 'general',
    lastUsed: '2025-04-08'
  }
];

// Category colors and labels
const categoryInfo = {
  lead: { color: "bg-blue-100 text-blue-800", label: "Lead Response" },
  quote: { color: "bg-green-100 text-green-800", label: "Quote Related" },
  'follow-up': { color: "bg-yellow-100 text-yellow-800", label: "Follow-up" },
  general: { color: "bg-purple-100 text-purple-800", label: "General" }
};

interface ResponseTemplatesProps {
  className?: string;
}

export function ResponseTemplates({ className }: ResponseTemplatesProps) {
  const [templates, setTemplates] = useState<ResponseTemplate[]>(demoTemplates);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<ResponseTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoryInfo[template.category as keyof typeof categoryInfo].label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleCopyTemplate = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "Response template has been copied to clipboard.",
    });
  };
  
  const resetForm = () => {
    setCurrentTemplate(null);
    setIsAddOpen(false);
  };
  
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Response Templates</CardTitle>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
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
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input 
            placeholder="Search templates..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.length > 0 ? (
                  filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge className={`rounded-full font-normal ${categoryInfo[template.category].color}`}>
                          {categoryInfo[template.category].label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleCopyTemplate(template.content)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No templates found. Create one to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ResponseTemplates;
