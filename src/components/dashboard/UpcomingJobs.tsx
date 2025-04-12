
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';

// Status color mappings
const statusColors = {
  'scheduled': 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
  'delayed': 'bg-red-100 text-red-800',
  'pending': 'bg-gray-100 text-gray-800',
  'cancelled': 'bg-red-100 text-red-800'
};

interface UpcomingJobsProps {
  className?: string;
}

export function UpcomingJobs({ className }: UpcomingJobsProps) {
  const navigate = useNavigate();
  
  const { data: jobs, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getJobs
  });
  
  // Get upcoming jobs (pending or scheduled, sorted by date)
  const upcomingJobs = jobs
    ?.filter(job => ['pending', 'scheduled', 'in-progress'].includes(job.status?.toLowerCase()))
    .sort((a, b) => {
      if (!a.scheduled_date) return 1;
      if (!b.scheduled_date) return -1;
      return new Date(a.scheduled_date).getTime() - new Date(b.scheduled_date).getTime();
    })
    .slice(0, 3) || [];
  
  const formatStatus = (status) => {
    if (!status) return 'Pending';
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Jobs</CardTitle>
        <Button size="sm" variant="outline" onClick={() => navigate('/schedule')}>
          View Schedule
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading upcoming jobs...</div>
        ) : upcomingJobs.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No upcoming jobs scheduled</div>
        ) : (
          <div className="space-y-4">
            {upcomingJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{job.title}</h3>
                    <p className="text-sm text-muted-foreground">{job.client}</p>
                  </div>
                  <Badge className={cn("rounded-full font-normal", statusColors[job.status?.toLowerCase()] || 'bg-gray-100 text-gray-800')}>
                    {formatStatus(job.status)}
                  </Badge>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>{job.scheduled_date ? new Date(job.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Not scheduled'}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Users className="h-3.5 w-3.5" />
                    <span>{job.crews?.name || 'No crew assigned'}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground col-span-2">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{job.address}</span>
                  </div>
                </div>
                
                <div className="mt-3 flex justify-end space-x-2">
                  <Button size="sm" variant="outline" onClick={() => navigate(`/jobs/${job.id}`)}>
                    Details
                  </Button>
                  <Button size="sm" variant="default" onClick={() => navigate(`/jobs/${job.id}/edit`)}>
                    Manage
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default UpcomingJobs;
