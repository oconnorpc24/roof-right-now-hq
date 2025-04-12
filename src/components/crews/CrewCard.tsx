
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Crew } from '@/types/crews';

interface CrewCardProps {
  crew: Crew;
  onEdit?: () => void;
  onAddMember?: () => void;
}

export default function CrewCard({ crew, onEdit, onAddMember }: CrewCardProps) {
  return (
    <Card key={crew.id} className={crew.status === 'unavailable' ? 'border-muted' : ''}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{crew.name}</CardTitle>
          <CardDescription>{crew.members?.length || 0} members</CardDescription>
        </div>
        <Badge className={crew.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
          {crew.status.charAt(0).toUpperCase() + crew.status.slice(1)}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium">Current Assignment</h4>
            <p className="text-sm text-muted-foreground">{crew.current_job || 'None assigned'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Specialties</h4>
            <div className="flex flex-wrap gap-2 mt-1">
              {crew.specialties && crew.specialties.length > 0 ? (
                crew.specialties.map(specialty => (
                  <Badge key={specialty} variant="secondary">{specialty}</Badge>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No specialties listed</span>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium">Members</h4>
            <div className="space-y-2 mt-1">
              {crew.members && crew.members.length > 0 ? (
                crew.members.map(member => (
                  <div key={member.id} className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{member.name}</span>
                    <span className="text-xs text-muted-foreground ml-2">({member.role})</span>
                  </div>
                ))
              ) : (
                <span className="text-sm text-muted-foreground">No members assigned</span>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            {onAddMember && (
              <Button size="sm" variant="outline" onClick={onAddMember}>
                Add Member
              </Button>
            )}
            {onEdit && (
              <Button size="sm" onClick={onEdit}>
                Manage Crew
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
