
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

// Job type definition
interface Job {
  id: string;
  title: string;
  client: string;
  address: string;
  date: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'delayed';
  crew: string;
  type: string;
}

// Demo data
const demoJobs: Job[] = [
  {
    id: '1',
    title: 'Roof Replacement',
    client: 'John Smith',
    address: '123 Main St, Anytown, USA',
    date: '2025-04-15',
    status: 'scheduled',
    crew: 'Team Alpha',
    type: 'Replacement'
  },
  {
    id: '2',
    title: 'Roof Repair',
    client: 'Sarah Johnson',
    address: '456 Oak Ave, Somewhere, USA',
    date: '2025-04-16',
    status: 'scheduled',
    crew: 'Team Beta',
    type: 'Repair'
  },
  {
    id: '3',
    title: 'Gutter Installation',
    client: 'Michael Brown',
    address: '789 Pine Rd, Nowhere, USA',
    date: '2025-04-14',
    status: 'in-progress',
    crew: 'Team Alpha',
    type: 'Installation'
  }
];

// Status color mappings
const statusColors = {
  'scheduled': 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  'completed': 'bg-green-100 text-green-800',
  'delayed': 'bg-red-100 text-red-800'
};

interface UpcomingJobsProps {
  className?: string;
}

export function UpcomingJobs({ className }: UpcomingJobsProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Upcoming Jobs</CardTitle>
        <Button size="sm" variant="outline">View Schedule</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {demoJobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.client}</p>
                </div>
                <Badge className={cn("rounded-full font-normal", statusColors[job.status])}>
                  {job.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              </div>
              
              <div className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(job.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Users className="h-3.5 w-3.5" />
                  <span>{job.crew}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground col-span-2">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{job.address}</span>
                </div>
              </div>
              
              <div className="mt-3 flex justify-end space-x-2">
                <Button size="sm" variant="outline">Details</Button>
                <Button size="sm" variant="default">Manage</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default UpcomingJobs;
