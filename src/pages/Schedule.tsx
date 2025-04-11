
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, List, LayoutGrid } from 'lucide-react';

// Demo events
const demoEvents = [
  { id: 1, title: 'Roof Replacement', client: 'John Smith', crew: 'Team Alpha', date: new Date('2025-04-15') },
  { id: 2, title: 'Leak Repair', client: 'Sarah Johnson', crew: 'Team Beta', date: new Date('2025-04-18') },
  { id: 3, title: 'Gutter Installation', client: 'Robert Davis', crew: 'Team Alpha', date: new Date('2025-04-20') },
  { id: 4, title: 'Roof Inspection', client: 'Emily Wilson', crew: 'Team Delta', date: new Date('2025-04-22') },
  { id: 5, title: 'Skylight Installation', client: 'Michael Brown', crew: 'Team Charlie', date: new Date('2025-04-25') }
];

export default function Schedule() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState('calendar');
  
  // Filter events for the currently selected date
  const selectedDateEvents = demoEvents.filter(
    event => date && event.date.toDateString() === date.toDateString()
  );
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Schedule</h1>
          <Button>
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
                      {selectedDateEvents.map(event => (
                        <div key={event.id} className="p-4 border rounded-md">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{event.title}</h3>
                              <p className="text-sm text-muted-foreground">Client: {event.client}</p>
                            </div>
                            <Badge>{event.crew}</Badge>
                          </div>
                          <div className="flex justify-end mt-2">
                            <Button size="sm" variant="outline">Details</Button>
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
                <div className="space-y-4">
                  {demoEvents.map(event => (
                    <div key={event.id} className="p-4 border rounded-md">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">Client: {event.client}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{event.date.toLocaleDateString()}</p>
                          <Badge>{event.crew}</Badge>
                        </div>
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button size="sm" variant="outline">Details</Button>
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
