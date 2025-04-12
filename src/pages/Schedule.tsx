
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, List, LayoutGrid, Plus, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scheduleApi, crewsApi, jobsApi } from '@/services/api';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

// Schedule event form component
const ScheduleEventForm = ({ onSubmit, initialData }: { onSubmit: (data: any) => void, initialData?: any }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    start_date: initialData?.start_date ? format(new Date(initialData.start_date), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    end_date: initialData?.end_date ? format(new Date(initialData.end_date), "yyyy-MM-dd'T'HH:mm") : format(new Date(new Date().getTime() + 3 * 60 * 60 * 1000), "yyyy-MM-dd'T'HH:mm"),
    all_day: initialData?.all_day || false,
    job_id: initialData?.job_id || 'none',
    crew_id: initialData?.crew_id || 'none',
    status: initialData?.status || 'scheduled'
  });

  // Fetch crews and jobs
  const { data: crews } = useQuery({
    queryKey: ['crews'],
    queryFn: crewsApi.getCrews,
  });

  const { data: jobs } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getJobs,
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
      id: initialData?.id,
      // Convert 'none' back to null for the backend
      job_id: formData.job_id === 'none' ? null : formData.job_id,
      crew_id: formData.crew_id === 'none' ? null : formData.crew_id
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
          value={formData.description || ''} 
          onChange={handleChange} 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_id">Related Job (Optional)</Label>
        <Select 
          value={formData.job_id} 
          onValueChange={(value) => handleSelectChange('job_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a job" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {jobs?.map((job: any) => (
              <SelectItem key={job.id} value={job.id}>
                {job.title} - {job.client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Label htmlFor="crew_id">Assign Crew</Label>
        <Select 
          value={formData.crew_id} 
          onValueChange={(value) => handleSelectChange('crew_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a crew" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {crews?.map((crew: any) => (
              <SelectItem key={crew.id} value={crew.id}>
                {crew.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
            <SelectItem value="scheduled">Scheduled</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        {initialData ? 'Update Event' : 'Add Event'}
      </Button>
    </form>
  );
};

export default function Schedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState('calendar');
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch schedule events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ['schedule'],
    queryFn: () => scheduleApi.getEvents(),
  });

  // Add event mutation
  const addEventMutation = useMutation({
    mutationFn: scheduleApi.createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      setIsEventDialogOpen(false);
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: (event: any) => scheduleApi.updateEvent(event.id, event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
      setIsEventDialogOpen(false);
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: scheduleApi.deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedule'] });
    },
  });

  // Filter events for the currently selected date
  const selectedDateEvents = date 
    ? events.filter(
        (event: any) => {
          const eventDate = new Date(event.start_date);
          return eventDate.toDateString() === date.toDateString();
        }
      )
    : [];

  const handleEventSubmit = (data: any) => {
    if (data.id) {
      updateEventMutation.mutate(data);
    } else {
      addEventMutation.mutate(data);
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEventMutation.mutate(id);
    }
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
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <Button onClick={() => {
            setSelectedEvent(null);
            setIsEventDialogOpen(true);
          }}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>
        
        <Tabs defaultValue="calendar" className="w-full" onValueChange={setView}>
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="calendar" className="flex items-center">
              <LayoutGrid className="h-4 w-4 mr-2" />
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center">
              <List className="h-4 w-4 mr-2" />
              List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calendar" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>
                    {date ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) : 'No Date Selected'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateEvents.map((event: any) => (
                        <div key={event.id} className="p-4 border rounded-md">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              {event.description && (
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                              )}
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(event.start_date), "h:mm a")} - {format(new Date(event.end_date), "h:mm a")}
                              </p>
                            </div>
                            <Badge>{event.crews?.name || 'No Crew Assigned'}</Badge>
                          </div>
                          <div className="flex justify-end mt-2 space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsEventDialogOpen(true);
                              }}
                            >
                              <Edit className="h-3.5 w-3.5 mr-1" />
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <Trash className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No events scheduled for this date
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.map((event: any) => (
                      <div key={event.id} className="p-4 border rounded-md">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium">{event.title}</h3>
                            {event.description && (
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            )}
                            {event.jobs && (
                              <p className="text-sm text-muted-foreground">Job: {event.jobs.title}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{format(new Date(event.start_date), "MMM d, yyyy")}</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(event.start_date), "h:mm a")} - {format(new Date(event.end_date), "h:mm a")}
                            </p>
                            <Badge>{event.crews?.name || 'No Crew Assigned'}</Badge>
                          </div>
                        </div>
                        <div className="flex justify-end mt-2 space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedEvent(event);
                              setIsEventDialogOpen(true);
                            }}
                          >
                            <Edit className="h-3.5 w-3.5 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleDeleteEvent(event.id)}
                          >
                            <Trash className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No upcoming events scheduled
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>
          <ScheduleEventForm 
            onSubmit={handleEventSubmit} 
            initialData={selectedEvent}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
