
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, CheckCircle, Clock, Calendar, Edit, Trash } from 'lucide-react';
import { jobsApi, scheduleApi } from '@/services/api';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { format } from 'date-fns';

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap: Record<string, { color: string, icon: React.ReactNode }> = {
    'scheduled': { color: 'bg-blue-100 text-blue-800', icon: <Clock className="h-3.5 w-3.5 mr-1" /> },
    'in-progress': { color: 'bg-yellow-100 text-yellow-800', icon: <AlertCircle className="h-3.5 w-3.5 mr-1" /> },
    'completed': { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="h-3.5 w-3.5 mr-1" /> },
    'pending': { color: 'bg-gray-100 text-gray-800', icon: <Clock className="h-3.5 w-3.5 mr-1" /> }
  };

  const { color, icon } = statusMap[status] || { color: '', icon: null };
  
  return (
    <Badge className={`flex items-center ${color}`}>
      {icon}
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </Badge>
  );
};

// Job form component
const JobForm = ({ onSubmit, initialData }: { onSubmit: (data: any) => void, initialData?: any }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    client: initialData?.client || '',
    address: initialData?.address || '',
    date: initialData?.scheduled_date ? new Date(initialData.scheduled_date).toISOString().split('T')[0] : '',
    status: initialData?.status || 'pending',
    crew_id: initialData?.crew_id || '',
    notes: initialData?.notes || ''
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
    onSubmit({
      ...formData,
      scheduled_date: formData.date
    });
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
        <Label htmlFor="date">Scheduled Date</Label>
        <Input 
          id="date" 
          name="date" 
          type="date" 
          value={formData.date} 
          onChange={handleChange} 
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
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="crew">Assign Crew</Label>
        <Select 
          value={formData.crew_id || ''} 
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
        {initialData ? 'Update Job' : 'Create Job'}
      </Button>
    </form>
  );
};

// Schedule form component
const ScheduleJobForm = ({ job, onSubmit }: { job: any, onSubmit: (data: any) => void }) => {
  const jobDate = job.scheduled_date ? new Date(job.scheduled_date) : new Date();
  
  const [formData, setFormData] = useState({
    title: job.title || '',
    description: '',
    start_date: format(jobDate, "yyyy-MM-dd'T'HH:mm"),
    end_date: format(new Date(jobDate.getTime() + 3 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
    all_day: false,
    status: 'scheduled',
    crew_id: job.crew_id || ''
  });

  const { data: crews } = useQuery({
    queryKey: ['crews'],
    queryFn: () => import('@/services/api').then(module => module.crewsApi.getCrews()),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      job_id: job.id
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Event Title</Label>
        <Input 
          id="title" 
          name="title" 
          value={formData.title} 
          onChange={handleChange} 
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          value={formData.description} 
          onChange={handleChange} 
        />
      </div>

      <div className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          id="all_day"
          name="all_day"
          checked={formData.all_day}
          onChange={handleChange}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="all_day" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          All Day Event
        </Label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date/Time</Label>
          <Input 
            id="start_date" 
            name="start_date" 
            type="datetime-local" 
            value={formData.start_date} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="end_date">End Date/Time</Label>
          <Input 
            id="end_date" 
            name="end_date" 
            type="datetime-local" 
            value={formData.end_date} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="crew">Assign Crew</Label>
        <Select 
          value={formData.crew_id || ''} 
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

      <Button type="submit" className="w-full">
        Add to Schedule
      </Button>
    </form>
  );
};

export default function Jobs() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch jobs
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getJobs,
  });

  // Add job mutation
  const addJobMutation = useMutation({
    mutationFn: jobsApi.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsAddDialogOpen(false);
      toast.success('Job added successfully');
    },
  });

  // Edit job mutation
  const editJobMutation = useMutation({
    mutationFn: (job: any) => jobsApi.updateJob(job.id, job),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setIsEditDialogOpen(false);
      toast.success('Job updated successfully');
    },
  });

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: jobsApi.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      toast.success('Job deleted successfully');
    },
  });

  // Schedule job mutation
  const scheduleJobMutation = useMutation({
    mutationFn: scheduleApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      setIsScheduleDialogOpen(false);
      toast.success('Job added to schedule successfully');
    },
  });

  const handleAddJob = (data: any) => {
    addJobMutation.mutate(data);
  };

  const handleEditJob = (data: any) => {
    editJobMutation.mutate({ ...data, id: selectedJob.id });
  };

  const handleDeleteJob = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      deleteJobMutation.mutate(id);
    }
  };

  const handleScheduleJob = (data: any) => {
    scheduleJobMutation.mutate(data);
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-destructive">Error loading jobs</h2>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Add New Job
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Job</DialogTitle>
              </DialogHeader>
              <JobForm onSubmit={handleAddJob} />
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Crew</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs && jobs.length > 0 ? (
                  jobs.map((job: any) => (
                    <TableRow key={job.id}>
                      <TableCell>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">{job.address}</div>
                      </TableCell>
                      <TableCell>{job.client}</TableCell>
                      <TableCell>{job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString() : 'Not scheduled'}</TableCell>
                      <TableCell>
                        <StatusBadge status={job.status || 'pending'} />
                      </TableCell>
                      <TableCell>{job.crews?.name || 'Unassigned'}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSelectedJob(job);
                              setIsScheduleDialogOpen(true);
                            }}
                          >
                            <Calendar className="h-4 w-4 mr-1" />
                            Schedule
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedJob(job);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteJob(job.id)}
                          >
                            <Trash className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <FileText className="h-10 w-10 text-muted-foreground" />
                        <div className="text-lg font-medium">No jobs found</div>
                        <p className="text-sm text-muted-foreground">Get started by creating a new job</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Edit Job Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Job</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <JobForm onSubmit={handleEditJob} initialData={selectedJob} />
          )}
        </DialogContent>
      </Dialog>

      {/* Schedule Job Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Job to Schedule</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <ScheduleJobForm job={selectedJob} onSubmit={handleScheduleJob} />
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
