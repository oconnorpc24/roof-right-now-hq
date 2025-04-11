
// Types for automated campaigns
export interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'completed' | 'paused';
  type: 'email' | 'sms' | 'both';
  recipients: number;
  responses: number;
  nextSend?: string;
}

// Status color mapping
export const statusColors = {
  active: "bg-green-100 text-green-800",
  draft: "bg-blue-100 text-blue-800",
  completed: "bg-gray-100 text-gray-800",
  paused: "bg-yellow-100 text-yellow-800"
};

// Type icons
export const typeIcons = {
  email: "Mail",
  sms: "MessageSquare",
  both: "Share2"
};

// Demo campaign data
export const demoCampaigns: Campaign[] = [
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
