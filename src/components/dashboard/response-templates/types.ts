
export interface ResponseTemplate {
  id: string;
  name: string;
  content: string;
  category: 'lead' | 'quote' | 'follow-up' | 'general';
  lastUsed?: string;
}

export const categoryInfo = {
  lead: { color: "bg-blue-100 text-blue-800", label: "Lead Response" },
  quote: { color: "bg-green-100 text-green-800", label: "Quote Related" },
  'follow-up': { color: "bg-yellow-100 text-yellow-800", label: "Follow-up" },
  general: { color: "bg-purple-100 text-purple-800", label: "General" }
};

// Demo response templates
export const demoTemplates: ResponseTemplate[] = [
  {
    id: '1',
    name: 'Initial Lead Response',
    content: "Thank you for reaching out to [Company Name]! We've received your inquiry about roofing services. One of our specialists will contact you within 24 hours to discuss your needs. For immediate assistance, please call us at [Phone Number].",
    category: 'lead',
    lastUsed: '2025-04-10'
  },
  {
    id: '2',
    name: 'Quote Follow-up',
    content: "Hello [Customer Name],\n\nI wanted to follow up on the roofing estimate we sent on [Date]. If you have any questions or would like to schedule a time to discuss further, please let me know. We're currently booking projects for next month and would love to get you on our schedule.\n\nBest regards,\n[Your Name]",
    category: 'quote',
    lastUsed: '2025-04-09'
  },
  {
    id: '3',
    name: 'Appointment Confirmation',
    content: "Your roof inspection is confirmed for [Date] at [Time]. Our inspector [Name] will arrive in a company vehicle. Please ensure access to your property is available. If you need to reschedule, please call us at [Phone Number] at least 24 hours in advance.",
    category: 'follow-up'
  },
  {
    id: '4',
    name: 'Thank You After Job',
    content: "Thank you for choosing [Company Name] for your roofing project! We appreciate your business and hope you're satisfied with our work. If you have a moment, we'd love for you to leave us a review on Google or our website. If you have any questions about your new roof, please don't hesitate to reach out.",
    category: 'general',
    lastUsed: '2025-04-08'
  }
];
