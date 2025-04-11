
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react';

// Demo data
const demoJobs = [
  { 
    id: '1',
    title: 'Roof Replacement',
    client: 'John Smith',
    address: '123 Main St, Anytown, USA',
    date: '2025-04-15',
    status: 'scheduled',
    crew: 'Team Alpha',
    notes: 'Complete tearoff and replacement with architectural shingles'
  },
  { 
    id: '2',
    title: 'Leak Repair',
    client: 'Sarah Johnson',
    address: '456 Oak Ave, Somewhere, USA',
    date: '2025-04-18',
    status: 'in-progress',
    crew: 'Team Beta',
    notes: 'Locate and repair leak near chimney flashing'
  },
  { 
    id: '3',
    title: 'Gutter Installation',
    client: 'Robert Davis',
    address: '789 Elm St, Nowhere, USA',
    date: '2025-04-20',
    status: 'completed',
    crew: 'Team Alpha',
    notes: 'Install new seamless gutters and downspouts'
  },
  { 
    id: '4',
    title: 'Roof Inspection',
    client: 'Emily Wilson',
    address: '101 Pine Rd, Somewhere, USA',
    date: '2025-04-22',
    status: 'pending',
    crew: 'Team Delta',
    notes: 'Annual roof inspection and maintenance check'
  },
  { 
    id: '5',
    title: 'Skylight Installation',
    client: 'Michael Brown',
    address: '202 Cedar Ln, Anytown, USA',
    date: '2025-04-25',
    status: 'scheduled',
    crew: 'Team Charlie',
    notes: 'Install two 2x4 skylights on north-facing roof'
  }
];

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

export default function Jobs() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Jobs</h1>
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Add New Job
          </Button>
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
                {demoJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-sm text-muted-foreground">{job.address}</div>
                    </TableCell>
                    <TableCell>{job.client}</TableCell>
                    <TableCell>{new Date(job.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <StatusBadge status={job.status} />
                    </TableCell>
                    <TableCell>{job.crew}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
