
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { crewsApi } from '@/services/api';
import { useNavigate } from 'react-router-dom';
import { demoCrews } from '@/data/demoCrews';

// Status color mappings
const statusColors = {
  'available': 'bg-green-100 text-green-800',
  'assigned': 'bg-yellow-100 text-yellow-800',
  'off': 'bg-gray-100 text-gray-800',
  'unavailable': 'bg-gray-100 text-gray-800',
  'active': 'bg-green-100 text-green-800'
};

interface CrewMemberDisplay {
  id: string;
  name: string;
  role: string;
  status: string;
  avatarUrl?: string;
}

interface CrewDisplay {
  id: string;
  name: string;
  members: CrewMemberDisplay[];
  jobsCompleted: number;
  activeJob?: string;
  status: string;
}

interface CrewAvailabilityProps {
  className?: string;
}

export function CrewAvailability({ className }: CrewAvailabilityProps) {
  const navigate = useNavigate();
  
  // Try to fetch from API first
  const { data: apiCrews, isLoading } = useQuery({
    queryKey: ['crews'],
    queryFn: crewsApi.getCrews,
    enabled: true,
  });
  
  // If API doesn't return data, use demo data as fallback
  const crews = apiCrews && apiCrews.length > 0 
    ? apiCrews.map(crew => ({
        id: crew.id,
        name: crew.name,
        members: crew.members || [],
        jobsCompleted: 0, // This would need to be calculated from a real jobs history
        activeJob: crew.current_job,
        status: crew.status || 'available'
      }))
    : demoCrews.map(crew => ({
        id: crew.id,
        name: crew.name,
        members: crew.members?.map(m => ({
          id: m.id,
          name: m.name,
          role: m.role,
          status: crew.status === 'active' ? 'assigned' : 'off',
          avatarUrl: undefined
        })) || [],
        jobsCompleted: Math.floor(Math.random() * 50),
        activeJob: crew.current_job,
        status: crew.status
      }));
  
  const handleManageCrewClick = () => {
    navigate('/crews');
  };
  
  const handleAssignJob = (crewId) => {
    navigate(`/jobs/new?crew=${crewId}`);
  };
  
  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Crew Status</CardTitle>
        <Button size="sm" variant="outline" onClick={handleManageCrewClick}>
          Manage Crews
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center text-muted-foreground">Loading crew data...</div>
        ) : crews.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">No crews available</div>
        ) : (
          <div className="space-y-6">
            {crews.map((crew) => (
              <div key={crew.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">{crew.name}</h3>
                  <Badge className={cn("rounded-full font-normal", statusColors[crew.status?.toLowerCase()] || 'bg-gray-100 text-gray-800')}>
                    {crew.status?.charAt(0).toUpperCase() + crew.status?.slice(1) || 'Unknown'}
                  </Badge>
                </div>
                
                {crew.activeJob && (
                  <div className="mb-3 text-sm bg-muted p-2 rounded">
                    <span className="font-medium">Current Job:</span> {crew.activeJob}
                  </div>
                )}
                
                <div className="flex flex-wrap gap-3">
                  {crew.members && crew.members.length > 0 ? crew.members.map((member) => (
                    <div key={member.id} className="flex items-center space-x-2 bg-background p-2 rounded border">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        <AvatarImage src={member.avatarUrl} alt={member.name} />
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role}</div>
                      </div>
                      <Badge className={cn("ml-2 rounded-full", statusColors[member.status?.toLowerCase()] || 'bg-gray-100 text-gray-800')}>
                        {member.status?.charAt(0).toUpperCase() + member.status?.slice(1) || 'Available'}
                      </Badge>
                    </div>
                  )) : (
                    <div className="text-sm text-muted-foreground w-full text-center py-2">
                      No members assigned to this crew
                    </div>
                  )}
                </div>
                
                <div className="mt-3 flex justify-end">
                  <Button 
                    size="sm" 
                    variant="default" 
                    disabled={crew.status?.toLowerCase() !== 'available' && crew.status?.toLowerCase() !== 'active'}
                    onClick={() => handleAssignJob(crew.id)}
                  >
                    {crew.activeJob ? 'View Assignment' : 'Assign Job'}
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

export default CrewAvailability;
