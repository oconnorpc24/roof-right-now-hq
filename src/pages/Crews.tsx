
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';
import CrewsTabContent from '@/components/crews/CrewsTabContent';
import MembersTabContent from '@/components/crews/MembersTabContent';
import { demoCrews, demoMembers } from '@/data/demoCrews';

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
            <CrewsTabContent crews={demoCrews} />
          </TabsContent>
          
          <TabsContent value="members" className="mt-6">
            <MembersTabContent members={demoMembers} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
