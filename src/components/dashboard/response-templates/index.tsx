
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { TemplateForm } from './TemplateForm';
import { TemplateList } from './TemplateList';
import { SearchBar } from './SearchBar';
import { ResponseTemplate, categoryInfo, demoTemplates } from './types';

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
  
  const handleEditTemplate = (template: ResponseTemplate) => {
    setCurrentTemplate(template);
    setIsAddOpen(true);
  };
  
  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(template => template.id !== id));
    toast({
      title: "Template deleted",
      description: "Response template has been deleted.",
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
        <TemplateForm 
          isOpen={isAddOpen}
          setIsOpen={setIsAddOpen}
          currentTemplate={currentTemplate}
          resetForm={resetForm}
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <SearchBar 
            value={searchTerm}
            onChange={setSearchTerm}
          />
          
          <TemplateList 
            templates={filteredTemplates}
            onCopy={handleCopyTemplate}
            onEdit={handleEditTemplate}
            onDelete={handleDeleteTemplate}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default ResponseTemplates;
