
import { Campaign, statusColors, typeIcons } from './types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, MessageSquare, Share2 } from 'lucide-react';

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  // Function to get the correct icon component based on type
  const getIconComponent = (type: Campaign['type']) => {
    switch (type) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'both':
        return <Share2 className="h-4 w-4" />;
    }
  };

  return (
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
                    {getIconComponent(campaign.type)}
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
  );
}
