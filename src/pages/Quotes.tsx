
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Plus, FileText, FileCheck, Download, Send, Printer, Edit, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { quotesApi, leadsApi, jobsApi } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

// Status color mappings
const quoteStatusColors = {
  'draft': 'bg-gray-100 text-gray-800',
  'sent': 'bg-blue-100 text-blue-800',
  'accepted': 'bg-green-100 text-green-800',
  'declined': 'bg-red-100 text-red-800'
};

// Roof types and materials for quote generator
const roofTypes = [
  { label: 'Gable', value: 'gable' },
  { label: 'Hip', value: 'hip' },
  { label: 'Flat', value: 'flat' },
  { label: 'Mansard', value: 'mansard' },
  { label: 'Gambrel', value: 'gambrel' }
];

const roofingMaterials = [
  { label: 'Asphalt Shingles (Standard)', value: 'asphalt-standard', pricePerSqFt: 4.50 },
  { label: 'Asphalt Shingles (Premium)', value: 'asphalt-premium', pricePerSqFt: 6.00 },
  { label: 'Metal Roof', value: 'metal', pricePerSqFt: 10.00 },
  { label: 'Clay Tiles', value: 'clay', pricePerSqFt: 12.50 },
  { label: 'Slate', value: 'slate', pricePerSqFt: 15.00 }
];

// Job form for converting quote to job
const CreateJobForm = ({ quote, onSubmit }: { quote: any, onSubmit: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    title: quote.title || '',
    client: quote.leads?.name || '',
    address: quote.leads?.address || '',
    scheduled_date: '',
    status: 'pending',
    crew_id: '',
    notes: quote.notes || '',
    quote_id: quote.id
  });

  const { data: crews } = useQuery({
    queryKey: ['crews'],
    queryFn: () => import('@/services/api').then(module => module.crewsApi.getCrews()),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Job Title</Label>
        <Input 
          id="title" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="client">Client Name</Label>
        <Input 
          id="client" 
          name="client" 
          value={formData.client} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Address</Label>
        <Input 
          id="address" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="scheduled_date">Scheduled Date</Label>
        <Input 
          id="scheduled_date" 
          name="scheduled_date" 
          type="date" 
          value={formData.scheduled_date} 
          onChange={handleChange} 
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="crew_id">Assign Crew</Label>
        <Select 
          value={formData.crew_id} 
          onValueChange={(value) => handleSelectChange('crew_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a crew" />
          </SelectTrigger>
          <SelectContent>
            {crews?.map((crew: any) => (
              <SelectItem key={crew.id} value={crew.id}>
                {crew.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          name="notes" 
          value={formData.notes} 
          onChange={handleChange} 
        />
      </div>

      <Button type="submit" className="w-full">
        Create Job
      </Button>
    </form>
  );
};

const Quotes = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("existing");
  const [quoteForm, setQuoteForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    address: '',
    roofType: '',
    material: '',
    area: '',
    additionalServices: [] as string[],
    notes: ''
  });
  const [quoteEstimate, setQuoteEstimate] = useState({
    materialCost: 0,
    laborCost: 0,
    additionalCosts: 0,
    totalEstimate: 0
  });
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  const queryClient = useQueryClient();

  // Fetch quotes
  const { data: quotes = [], isLoading: quotesLoading } = useQuery({
    queryKey: ['quotes'],
    queryFn: quotesApi.getQuotes,
  });

  // Fetch leads for dropdown
  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getLeads,
  });

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: jobsApi.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      setIsJobDialogOpen(false);
      toast.success('Job created successfully');
    },
  });

  // Update quote status mutation
  const updateQuoteStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      quotesApi.updateQuote(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
      toast.success('Quote status updated');
    },
  });

  // Update quote form and calculate estimate
  const handleQuoteFormChange = (field: string, value: string) => {
    setQuoteForm(prev => ({ ...prev, [field]: value }));
    
    if (field === 'material' || field === 'area') {
      calculateEstimate({ ...quoteForm, [field]: value });
    }
  };

  // Calculate cost estimate based on form values
  const calculateEstimate = (formData: typeof quoteForm) => {
    let materialCost = 0;
    let laborCost = 0;
    let additionalCosts = 0;
    
    if (formData.material && formData.area) {
      const selectedMaterial = roofingMaterials.find(m => m.value === formData.material);
      const area = parseFloat(formData.area);
      
      if (selectedMaterial && !isNaN(area)) {
        materialCost = selectedMaterial.pricePerSqFt * area;
        laborCost = area * 3.5; // Labor cost estimate based on area
        additionalCosts = (materialCost + laborCost) * 0.1; // 10% for additional costs
      }
    }
    
    const totalEstimate = materialCost + laborCost + additionalCosts;
    
    setQuoteEstimate({
      materialCost,
      laborCost,
      additionalCosts,
      totalEstimate
    });
  };

  const handleGenerateQuote = async () => {
    if (!quoteForm.clientName || !quoteForm.material || !quoteForm.area) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Check if we have a lead, or create one
      let leadId = null;
      
      // Try to find existing lead by email if provided
      if (quoteForm.clientEmail) {
        const existingLeads = leads.filter((lead: any) => 
          lead.email === quoteForm.clientEmail
        );
        
        if (existingLeads.length > 0) {
          leadId = existingLeads[0].id;
        }
      }
      
      // If no existing lead found, create a new one
      if (!leadId) {
        const newLead = await leadsApi.createLead({
          name: quoteForm.clientName,
          email: quoteForm.clientEmail,
          phone: quoteForm.clientPhone,
          address: quoteForm.address,
          source: 'Quote Generator',
          status: 'new'
        });
        
        leadId = newLead.id;
      }
      
      // Create the quote
      const quoteData = {
        lead_id: leadId,
        title: `Roof ${quoteForm.roofType} - ${roofingMaterials.find(m => m.value === quoteForm.material)?.label}`,
        description: `Roof Type: ${quoteForm.roofType}, Material: ${quoteForm.material}, Area: ${quoteForm.area} sq.ft.`,
        amount: quoteEstimate.totalEstimate,
        status: 'draft',
        notes: quoteForm.notes,
        created_by: user?.id
      };
      
      await quotesApi.createQuote(quoteData);
      
      toast.success('Quote generated successfully');
      
      // Reset form and switch to existing quotes tab
      setQuoteForm({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        address: '',
        roofType: '',
        material: '',
        area: '',
        additionalServices: [],
        notes: ''
      });
      
      setQuoteEstimate({
        materialCost: 0,
        laborCost: 0,
        additionalCosts: 0,
        totalEstimate: 0
      });
      
      setActiveTab('existing');
      queryClient.invalidateQueries({ queryKey: ['quotes'] });
    } catch (error) {
      console.error('Error generating quote:', error);
      toast.error('Failed to generate quote');
    }
  };

  const handleSendQuote = (quoteId: string) => {
    updateQuoteStatusMutation.mutate({ id: quoteId, status: 'sent' });
  };

  const handleCreateJob = (jobData: any) => {
    createJobMutation.mutate(jobData);
    updateQuoteStatusMutation.mutate({ id: jobData.quote_id, status: 'accepted' });
  };

  if (quotesLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-[calc(100vh-200px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Quotes Management</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing">Existing Quotes</TabsTrigger>
            <TabsTrigger value="new">Create New Quote</TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Quotes</CardTitle>
                <CardDescription>Manage and view all your existing quotes.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quote #</TableHead>
                        <TableHead>Client</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotes.length > 0 ? (
                        quotes.map((quote: any) => (
                          <TableRow key={quote.id}>
                            <TableCell className="font-medium">
                              {quote.id.substring(0, 8)}...
                            </TableCell>
                            <TableCell>
                              <div>
                                <div>{quote.leads?.name || 'Unknown'}</div>
                                <div className="text-sm text-muted-foreground">{quote.leads?.address || 'No address'}</div>
                              </div>
                            </TableCell>
                            <TableCell>{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>${quote.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
                            <TableCell>
                              <Badge className={cn(
                                "rounded-full font-normal",
                                quoteStatusColors[quote.status as keyof typeof quoteStatusColors] || "bg-gray-100 text-gray-800"
                              )}>
                                {quote.status ? quote.status.charAt(0).toUpperCase() + quote.status.slice(1) : 'Draft'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" size="sm">
                                  <FileText className="mr-1 h-4 w-4" />
                                  View
                                </Button>
                                {quote.status === 'draft' && (
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleSendQuote(quote.id)}
                                  >
                                    <Send className="mr-1 h-4 w-4" />
                                    Send
                                  </Button>
                                )}
                                {(quote.status === 'sent' || quote.status === 'accepted') && (
                                  <Button 
                                    size="sm" 
                                    variant="default"
                                    onClick={() => {
                                      setSelectedQuote(quote);
                                      setIsJobDialogOpen(true);
                                    }}
                                  >
                                    <FileCheck className="mr-1 h-4 w-4" />
                                    Convert to Job
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No quotes found. Create a new quote to get started.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="new">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Quote Generator</CardTitle>
                  <CardDescription>Fill in the details to generate a new quote.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Client Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="clientName">Client Name</Label>
                        <Input 
                          id="clientName" 
                          placeholder="Full name" 
                          value={quoteForm.clientName}
                          onChange={(e) => handleQuoteFormChange('clientName', e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientEmail">Email Address</Label>
                        <Input 
                          id="clientEmail" 
                          type="email" 
                          placeholder="Email" 
                          value={quoteForm.clientEmail}
                          onChange={(e) => handleQuoteFormChange('clientEmail', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="clientPhone">Phone Number</Label>
                        <Input 
                          id="clientPhone" 
                          placeholder="Phone" 
                          value={quoteForm.clientPhone}
                          onChange={(e) => handleQuoteFormChange('clientPhone', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Property Address</Label>
                        <Input 
                          id="address" 
                          placeholder="Full address" 
                          value={quoteForm.address}
                          onChange={(e) => handleQuoteFormChange('address', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Project Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="roofType">Roof Type</Label>
                        <Select 
                          value={quoteForm.roofType}
                          onValueChange={(value) => handleQuoteFormChange('roofType', value)}
                        >
                          <SelectTrigger id="roofType">
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {roofTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="material">Material</Label>
                        <Select 
                          value={quoteForm.material}
                          onValueChange={(value) => handleQuoteFormChange('material', value)}
                        >
                          <SelectTrigger id="material">
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            {roofingMaterials.map((material) => (
                              <SelectItem key={material.value} value={material.value}>
                                {material.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Roof Area (sq. ft.)</Label>
                        <Input 
                          id="area" 
                          placeholder="Area in square feet" 
                          value={quoteForm.area}
                          onChange={(e) => handleQuoteFormChange('area', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea 
                      id="notes" 
                      placeholder="Any additional information about the project" 
                      rows={4}
                      value={quoteForm.notes}
                      onChange={(e) => handleQuoteFormChange('notes', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quote Summary</CardTitle>
                  <CardDescription>Estimated costs based on inputs</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Materials Cost:</span>
                      <span>${quoteEstimate.materialCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Labor Cost:</span>
                      <span>${quoteEstimate.laborCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Additional Costs:</span>
                      <span>${quoteEstimate.additionalCosts.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                      <span>Total Estimate:</span>
                      <span>${quoteEstimate.totalEstimate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-muted-foreground mt-2">
                    <p>This estimate is based on the provided measurements and selected materials. The final price may vary based on inspection findings.</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button 
                    className="w-full"
                    onClick={handleGenerateQuote}
                    disabled={!quoteForm.clientName || !quoteForm.material || !quoteForm.area}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Generate Quote
                  </Button>
                  <div className="flex space-x-2 w-full">
                    <Button variant="outline" className="flex-1">
                      <Printer className="mr-2 h-4 w-4" />
                      Print
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Export PDF
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Convert to Job Dialog */}
      <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Convert Quote to Job</DialogTitle>
          </DialogHeader>
          {selectedQuote && (
            <CreateJobForm 
              quote={selectedQuote} 
              onSubmit={handleCreateJob} 
            />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Quotes;
