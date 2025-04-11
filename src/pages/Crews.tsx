
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Phone, Mail, MapPin, Calendar } from 'lucide-react';

// Demo crews
const demoCrews = [
  {
    id: 1,
    name: 'Team Alpha',
    members: [
      { id: 1, name: 'John Doe', role: 'Foreman', avatar: '' },
      { id: 2, name: 'Mike Smith', role: 'Installer', avatar: '' },
      { id: 3, name: 'Dave Jones', role: 'Helper', avatar: '' },
    ],
    specialties: ['Roof Replacement', 'Metal Roofing'],
    status: 'active',
    currentJob: 'Roof Replacement - 123 Main St'
  },
  {
    id: 2,
    name: 'Team Beta',
    members: [
      { id: 4, name: 'Alex Johnson', role: 'Foreman', avatar: '' },
      { id: 5, name: 'Tom Wilson', role: 'Installer', avatar: '' },
      { id: 6, name: 'Chris Lee', role: 'Helper', avatar: '' },
    ],
    specialties: ['Roof Repair', 'Shingle Installation'],
    status: 'active',
    currentJob: 'Leak Repair - 456 Oak Ave'
  },
  {
    id: 3,
    name: 'Team Charlie',
    members: [
      { id: 7, name: 'Robert Davis', role: 'Foreman', avatar: '' },
      { id: 8, name: 'Paul Roberts', role: 'Installer', avatar: '' },
    ],
    specialties: ['Skylight Installation', 'Ventilation'],
    status: 'unavailable',
    currentJob: 'On vacation until April 20'
  },
  {
    id: 4,
    name: 'Team Delta',
    members: [
      { id: 9, name: 'Mark Thompson', role: 'Foreman', avatar: '' },
      { id: 10, name: 'Kevin White', role: 'Installer', avatar: '' },
      { id: 11, name: 'Brian Miller', role: 'Helper', avatar: '' },
    ],
    specialties: ['Inspections', 'Maintenance'],
    status: 'active',
    currentJob: 'Roof Inspection - 101 Pine Rd'
  },
];

// Demo crew members (all members in a flat array)
const demoMembers = demoCrews.flatMap(crew => 
  crew.members.map(member => ({
    ...member,
    crew: crew.name,
    phone: '(555) 123-4567',
    email: `${member.name.toLowerCase().replace(' ', '.')}@roofrightco.com`,
    address: '123 Worker Lane, Anytown, USA'
  }))
);

export default function Crews() {
  const [activeTab, setActiveTab] = useState('crews');
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Crews & Personnel</h1>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Users className="mr-2 h-4 w-4" />
              New Crew
            </Button>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="crews" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-[400px] grid-cols-2">
            <TabsTrigger value="crews">
              <Users className="h-4 w-4 mr-2" />
              Crews
            </TabsTrigger>
            <TabsTrigger value="members">
              <UserPlus className="h-4 w-4 mr-2" />
              Individual Members
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="crews" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {demoCrews.map(crew => (
                <Card key={crew.id} className={crew.status === 'unavailable' ? 'border-muted' : ''}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div>
                      <CardTitle>{crew.name}</CardTitle>
                      <CardDescription>{crew.members.length} members</CardDescription>
                    </div>
                    <Badge className={crew.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {crew.status.charAt(0).toUpperCase() + crew.status.slice(1)}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium">Current Assignment</h4>
                        <p className="text-sm text-muted-foreground">{crew.currentJob}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Specialties</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {crew.specialties.map(specialty => (
                            <Badge key={specialty} variant="secondary">{specialty}</Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium">Members</h4>
                        <div className="space-y-2 mt-1">
                          {crew.members.map(member => (
                            <div key={member.id} className="flex items-center">
                              <Avatar className="h-6 w-6 mr-2">
                                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{member.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">({member.role})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button size="sm">Manage Crew</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>All Crew Members</CardTitle>
                <CardDescription>Manage individual crew members and their assignments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {demoMembers.map(member => (
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
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
