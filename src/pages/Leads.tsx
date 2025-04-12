
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FilterX, Plus, Search, MoreHorizontal, Phone, Mail, Edit, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsApi } from '@/services/api';

// Lead type definition
const leadStatusColors = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  qualified: "bg-green-100 text-green-800",
  closed: "bg-purple-100 text-purple-800",
  lost: "bg-gray-100 text-gray-800"
};

type LeadStatus = keyof typeof leadStatusColors;

// Lead form component
const LeadForm = ({ onSubmit, initialData }: { onSubmit: (data: any) => void, initialData?: any }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    address: initialData?.address || '',
    status: initialData?.status || 'new',
    source: initialData?.source || '',
    notes: initialData?.notes || ''
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

  const sources = [
    'Website', 'Referral', 'Google Ads', 'Facebook', 'Instagram', 'Home Show', 'Direct Mail', 'Other'
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name *</Label>
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
          <Label htmlFor="source">Source *</Label>
          <Select
            value={formData.source}
            onValueChange={(value) => handleSelectChange('source', value)}
          >
            <SelectTrigger id="source">
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {sources.map(source => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email" 
            placeholder="Email address" 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone number" 
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
          placeholder="Full address" 
        />
      </div>
      {initialData && (
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => handleSelectChange('status', value)}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="lost">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional information about the lead" 
        />
      </div>
      <DialogFooter>
        <Button type="submit">{initialData ? 'Update Lead' : 'Save Lead'}</Button>
      </DialogFooter>
    </form>
  );
};

const Leads = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [editLeadOpen, setEditLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  
  const queryClient = useQueryClient();
  
  // Fetch leads
  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: leadsApi.getLeads,
  });
  
  // Add lead mutation
  const addLeadMutation = useMutation({
    mutationFn: leadsApi.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setAddLeadOpen(false);
    },
  });
  
  // Update lead mutation
  const updateLeadMutation = useMutation({
    mutationFn: (lead: any) => leadsApi.updateLead(lead.id, lead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setEditLeadOpen(false);
    },
  });
  
  // Delete lead mutation
  const deleteLeadMutation = useMutation({
    mutationFn: leadsApi.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
  
  // Update lead status mutation
  const updateLeadStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string, status: string }) => 
      leadsApi.updateLead(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
  
  // Filter leads based on search terms and filters
  const filteredLeads = leads.filter((lead: any) => {
    const matchesSearch = 
      (lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (lead.address?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (lead.phone?.includes(searchTerm) || false);
      
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });
  
  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSourceFilter('all');
  };
  
  // Get unique sources for filter options
  const sources = ['all', ...new Set(leads.map((lead: any) => lead.source).filter(Boolean))];

  const handleAddLead = (leadData: any) => {
    addLeadMutation.mutate(leadData);
  };

  const handleUpdateLead = (leadData: any) => {
    updateLeadMutation.mutate({ ...leadData, id: selectedLead.id });
  };

  const handleDeleteLead = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      deleteLeadMutation.mutate(id);
    }
  };

  const handleUpdateLeadStatus = (id: string, currentStatus: string) => {
    let newStatus: string;
    
    switch (currentStatus) {
      case 'new':
        newStatus = 'contacted';
        break;
      case 'contacted':
        newStatus = 'qualified';
        break;
      case 'qualified':
        newStatus = 'closed';
        break;
      default:
        newStatus = 'new';
    }
    
    updateLeadStatusMutation.mutate({ id, status: newStatus });
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Leads Management</h1>
          <Dialog open={addLeadOpen} onOpenChange={setAddLeadOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Lead
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
                <DialogDescription>
                  Enter the details of the new lead. All fields marked with * are required.
                </DialogDescription>
              </DialogHeader>
              <LeadForm onSubmit={handleAddLead} />
            </DialogContent>
          </Dialog>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search leads..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter by source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sources.map(source => (
                      <SelectItem key={source} value={source}>
                        {source === 'all' ? 'All Sources' : source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {(searchTerm || statusFilter !== 'all' || sourceFilter !== 'all') && (
                  <Button variant="outline" onClick={clearFilters}>
                    <FilterX className="mr-2 h-4 w-4" />
                    Clear
                  </Button>
                )}
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date Added</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.length > 0 ? (
                    filteredLeads.map((lead: any) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-muted-foreground">{lead.address}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col space-y-1">
                            <div className="flex items-center text-sm">
                              <Phone className="mr-1 h-3 w-3" />
                              <span>{lead.phone || 'No phone'}</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Mail className="mr-1 h-3 w-3" />
                              <span>{lead.email || 'No email'}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("rounded-full font-normal", leadStatusColors[lead.status as LeadStatus])}>
                            {lead.status ? lead.status.charAt(0).toUpperCase() + lead.status.slice(1) : 'New'}
                          </Badge>
                        </TableCell>
                        <TableCell>{lead.source || 'Unknown'}</TableCell>
                        <TableCell>{new Date(lead.created_at).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => {
                                setSelectedLead(lead);
                                setEditLeadOpen(true);
                              }}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Lead
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteLead(lead.id)}>
                                <Trash className="mr-2 h-4 w-4" />
                                Delete Lead
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateLeadStatus(lead.id, lead.status)}>
                                {lead.status === 'new' ? 'Mark as Contacted' : 
                                 lead.status === 'contacted' ? 'Mark as Qualified' : 
                                 lead.status === 'qualified' ? 'Mark as Closed' : 'Change Status'}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No leads found. Try adjusting your filters or add a new lead.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Edit Lead Dialog */}
      <Dialog open={editLeadOpen} onOpenChange={setEditLeadOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>
              Update the lead information.
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <LeadForm onSubmit={handleUpdateLead} initialData={selectedLead} />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Leads;
