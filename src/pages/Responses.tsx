
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ResponseTemplates from '@/components/dashboard/response-templates';
import FollowUpTracker from '@/components/dashboard/FollowUpTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, MessageSquare, Send, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Types for automated campaigns
interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'completed' | 'paused';
  type: 'email' | 'sms' | 'both';
  recipients: number;
  responses: number;
  nextSend?: string;
}

// Demo campaign data
const demoCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Spring Roof Maintenance Reminder',
    status: 'active',
    type: 'email',
    recipients: 120,
    responses: 15,
    nextSend: '2025-04-15'
  },
  {
    id: '2',
    name: 'Storm Damage Follow-up',
    status: 'active',
    type: 'both',
    recipients: 45,
    responses: 8,
    nextSend: '2025-04-14'
  },
  {
    id: '3',
    name: 'Seasonal Discount Promotion',
    status: 'draft',
    type: 'email',
    recipients: 200,
    responses: 0
  },
  {
    id: '4',
    name: 'Customer Satisfaction Survey',
    status: 'completed',
    type: 'email',
    recipients: 78,
    responses: 32
  }
];

// Status color mapping
const statusColors = {
  active: "bg-green-100 text-green-800",
  draft: "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-800",
  paused: "bg-yellow-100 text-yellow-800"
};

// Type icons
const typeIcons = {
  email: <Mail className="h-4 w-4" />,
  sms: <MessageSquare className="h-4 w-4" />,
  both: <Share2 className="h-4 w-4" />
};

const Responses = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const [campaigns, setCampaigns] = useState<Campaign[]>(demoCampaigns);
  const { toast } = useToast();
  
  const handleSendTest = () => {
    toast({
      title: "Test Message Sent",
      description: "Your test message has been sent to your email address.",
    });
  };

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
          
          <TabsContent value="campaigns" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{campaigns.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {campaigns.filter(c => c.status === 'active').length} active
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Recipient Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {campaigns.reduce((sum, campaign) => sum + campaign.recipients, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total recipients across all campaigns
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const totalRecipients = campaigns.reduce((sum, campaign) => sum + campaign.recipients, 0);
                    const totalResponses = campaigns.reduce((sum, campaign) => sum + campaign.responses, 0);
                    const rate = totalRecipients ? Math.round((totalResponses / totalRecipients) * 100) : 0;
                    
                    return (
                      <>
                        <div className="text-2xl font-bold">{rate}%</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {totalResponses} responses from {totalRecipients} recipients
                        </p>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Next Scheduled</CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    const nextCampaign = campaigns
                      .filter(c => c.nextSend)
                      .sort((a, b) => new Date(a.nextSend!).getTime() - new Date(b.nextSend!).getTime())[0];
                      
                    return nextCampaign ? (
                      <>
                        <div className="text-2xl font-bold">{new Date(nextCampaign.nextSend!).toLocaleDateString()}</div>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {nextCampaign.name}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-bold">None</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          No campaigns scheduled
                        </p>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Campaign List</CardTitle>
                  <CardDescription>Manage your automated response campaigns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium">{campaign.name}</h3>
                            <Badge className={`rounded-full font-normal ${statusColors[campaign.status]}`}>
                              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              {typeIcons[campaign.type]}
                              <span className="ml-1 capitalize">{campaign.type}</span>
                            </div>
                            <div>Recipients: {campaign.recipients}</div>
                            <div>Responses: {campaign.responses}</div>
                          </div>
                          
                          {campaign.nextSend && (
                            <div className="flex items-center mt-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>Next send: {new Date(campaign.nextSend).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          {campaign.status === 'active' ? (
                            <Button size="sm" variant="outline">Pause</Button>
                          ) : campaign.status === 'paused' ? (
                            <Button size="sm" variant="outline">Resume</Button>
                          ) : campaign.status === 'draft' ? (
                            <Button size="sm">Activate</Button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Create Campaign</CardTitle>
                  <CardDescription>Set up a new automated response campaign</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="campaign-name">Campaign Name</Label>
                      <Input id="campaign-name" placeholder="e.g., Spring Promotion" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaign-type">Message Type</Label>
                      <Select defaultValue="email">
                        <SelectTrigger id="campaign-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="sms">SMS</SelectItem>
                          <SelectItem value="both">Email & SMS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaign-template">Message Template</Label>
                      <Select>
                        <SelectTrigger id="campaign-template">
                          <SelectValue placeholder="Select template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Initial Lead Response</SelectItem>
                          <SelectItem value="2">Quote Follow-up</SelectItem>
                          <SelectItem value="4">Thank You After Job</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaign-subject">Subject Line (Email)</Label>
                      <Input id="campaign-subject" placeholder="e.g., Your Roof Inspection Results" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="campaign-message">Message Preview</Label>
                      <Textarea 
                        id="campaign-message" 
                        placeholder="Your message will appear here based on the selected template" 
                        rows={5}
                        defaultValue="Thank you for reaching out to [Company Name]! We've received your inquiry about roofing services. One of our specialists will contact you within 24 hours to discuss your needs. For immediate assistance, please call us at [Phone Number]."
                      />
                    </div>
                    
                    <div className="pt-2 flex flex-col space-y-2">
                      <Button onClick={handleSendTest} variant="outline">
                        <Send className="mr-2 h-4 w-4" />
                        Send Test
                      </Button>
                      <Button>Save Campaign</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
