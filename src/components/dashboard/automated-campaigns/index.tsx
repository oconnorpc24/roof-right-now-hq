
import { useState } from 'react';
import { CampaignStats } from './CampaignStats';
import { CampaignList } from './CampaignList';
import { CampaignForm } from './CampaignForm';
import { demoCampaigns, Campaign } from './types';

interface AutomatedCampaignsProps {
  className?: string;
}

export function AutomatedCampaigns({ className = "" }: AutomatedCampaignsProps) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(demoCampaigns);
  
  return (
    <div className={`space-y-6 ${className}`}>
      <CampaignStats campaigns={campaigns} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CampaignList campaigns={campaigns} />
        <CampaignForm />
      </div>
    </div>
  );
}

export default AutomatedCampaigns;
