
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Phone, Mail, Users } from 'lucide-react';
import { CrewMember } from '@/types/crews';

interface MembersTabContentProps {
  members: CrewMember[];
}

export default function MembersTabContent({ members }: MembersTabContentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Crew Members</CardTitle>
        <CardDescription>Manage individual crew members and their assignments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {members.map(member => (
            <div key={member.id} className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 border-b pb-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{member.crew}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
              </div>
              
              <div className="flex justify-center sm:justify-end space-x-2">
                <Button size="sm" variant="outline">View</Button>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
