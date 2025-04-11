
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CrewMember {
  id: string;
  name: string;
  role: string;
  status: 'available' | 'assigned' | 'off';
  avatarUrl?: string;
}

interface Crew {
  id: string;
  name: string;
  members: CrewMember[];
  jobsCompleted: number;
  activeJob?: string;
}

// Demo data
const demoCrews: Crew[] = [
  {
    id: '1',
    name: 'Team Alpha',
    members: [
      { id: 'a1', name: 'Alex Johnson', role: 'Lead', status: 'assigned', avatarUrl: 'https://i.pravatar.cc/150?u=a1' },
      { id: 'a2', name: 'Robert Chen', role: 'Roofer', status: 'assigned', avatarUrl: 'https://i.pravatar.cc/150?u=a2' },
      { id: 'a3', name: 'Carlos Rodriguez', role: 'Roofer', status: 'assigned', avatarUrl: 'https://i.pravatar.cc/150?u=a3' },
    ],
    jobsCompleted: 34,
    activeJob: 'Gutter Installation - Michael Brown'
  },
  {
    id: '2',
    name: 'Team Beta',
    members: [
      { id: 'b1', name: 'Maria Garcia', role: 'Lead', status: 'available', avatarUrl: 'https://i.pravatar.cc/150?u=b1' },
      { id: 'b2', name: 'James Wilson', role: 'Roofer', status: 'available', avatarUrl: 'https://i.pravatar.cc/150?u=b2' },
      { id: 'b3', name: 'Sarah Lee', role: 'Roofer', status: 'off', avatarUrl: 'https://i.pravatar.cc/150?u=b3' },
    ],
    jobsCompleted: 28
  }
];

// Status color mappings
const statusColors = {
  'available': 'bg-green-100 text-green-800',
  'assigned': 'bg-yellow-100 text-yellow-800',
  'off': 'bg-gray-100 text-gray-800'
};

interface CrewAvailabilityProps {
  className?: string;
}

export function CrewAvailability({ className }: CrewAvailabilityProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Crew Status</CardTitle>
        <Button size="sm" variant="outline">Manage Crews</Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {demoCrews.map((crew) => (
            <div key={crew.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">{crew.name}</h3>
                <span className="text-sm text-muted-foreground">{crew.jobsCompleted} jobs completed</span>
              </div>
              
              {crew.activeJob && (
                <div className="mb-3 text-sm bg-muted p-2 rounded">
                  <span className="font-medium">Current Job:</span> {crew.activeJob}
                </div>
              )}
              
              <div className="flex flex-wrap gap-3">
                {crew.members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2 bg-background p-2 rounded border">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      <AvatarImage src={member.avatarUrl} alt={member.name} />
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                    <Badge className={cn("ml-2 rounded-full", statusColors[member.status])}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
              
              <div className="mt-3 flex justify-end">
                <Button size="sm" variant="default" disabled={crew.activeJob !== undefined}>
                  {crew.activeJob ? 'Assigned' : 'Assign Job'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CrewAvailability;
