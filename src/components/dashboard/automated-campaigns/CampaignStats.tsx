
import { Campaign } from './types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface CampaignStatsProps {
  campaigns: Campaign[];
}

export function CampaignStats({ campaigns }: CampaignStatsProps) {
  // Calculate the next campaign date (if any)
  const getNextCampaign = () => {
    const nextCampaign = campaigns
      .filter(c => c.nextSend)
      .sort((a, b) => new Date(a.nextSend!).getTime() - new Date(b.nextSend!).getTime())[0];
      
    return nextCampaign;
  };

  // Calculate response rate
  const calculateResponseRate = () => {
    const totalRecipients = campaigns.reduce((sum, campaign) => sum + campaign.recipients, 0);
    const totalResponses = campaigns.reduce((sum, campaign) => sum + campaign.responses, 0);
    const rate = totalRecipients ? Math.round((totalResponses / totalRecipients) * 100) : 0;
    
    return {
      rate,
      totalRecipients,
      totalResponses
    };
  };

  const nextCampaign = getNextCampaign();
  const { rate, totalRecipients, totalResponses } = calculateResponseRate();

  return (
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
          <div className="text-2xl font-bold">{totalRecipients}</div>
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
          <div className="text-2xl font-bold">{rate}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            {totalResponses} responses from {totalRecipients} recipients
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Next Scheduled</CardTitle>
        </CardHeader>
        <CardContent>
          {nextCampaign ? (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}
