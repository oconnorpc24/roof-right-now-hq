
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ResponseTemplates from '@/components/dashboard/response-templates';
import FollowUpTracker from '@/components/dashboard/FollowUpTracker';
import AutomatedCampaigns from '@/components/dashboard/automated-campaigns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Responses = () => {
  const [activeTab, setActiveTab] = useState("templates");
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Automated Responses & Follow-ups</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="templates">Response Templates</TabsTrigger>
            <TabsTrigger value="campaigns">Automated Campaigns</TabsTrigger>
            <TabsTrigger value="followups">Follow-up Tracker</TabsTrigger>
          </TabsList>
          
          <TabsContent value="templates">
            <ResponseTemplates className="shadow-none rounded-none border-0" />
          </TabsContent>
          
          <TabsContent value="campaigns">
            <AutomatedCampaigns />
          </TabsContent>
          
          <TabsContent value="followups">
            <FollowUpTracker className="shadow-none rounded-none border-0" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Responses;
