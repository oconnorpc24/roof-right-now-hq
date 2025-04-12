
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

// Leads API
export const leadsApi = {
  getLeads: async () => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch leads');
      throw error;
    }
    
    return data;
  },
  
  getLead: async (id: string) => {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      toast.error('Failed to fetch lead');
      throw error;
    }
    
    return data;
  },
  
  createLead: async (lead: any) => {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to create lead');
      throw error;
    }
    
    toast.success('Lead created successfully');
    return data;
  },
  
  updateLead: async (id: string, lead: any) => {
    const { data, error } = await supabase
      .from('leads')
      .update(lead)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to update lead');
      throw error;
    }
    
    toast.success('Lead updated successfully');
    return data;
  },
  
  deleteLead: async (id: string) => {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete lead');
      throw error;
    }
    
    toast.success('Lead deleted successfully');
  }
};

// Quotes API
export const quotesApi = {
  getQuotes: async () => {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, leads(*)')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch quotes');
      throw error;
    }
    
    return data;
  },
  
  getQuote: async (id: string) => {
    const { data, error } = await supabase
      .from('quotes')
      .select('*, leads(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      toast.error('Failed to fetch quote');
      throw error;
    }
    
    return data;
  },
  
  createQuote: async (quote: any) => {
    const { data, error } = await supabase
      .from('quotes')
      .insert(quote)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to create quote');
      throw error;
    }
    
    toast.success('Quote created successfully');
    return data;
  },
  
  updateQuote: async (id: string, quote: any) => {
    const { data, error } = await supabase
      .from('quotes')
      .update(quote)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to update quote');
      throw error;
    }
    
    toast.success('Quote updated successfully');
    return data;
  },
  
  deleteQuote: async (id: string) => {
    const { error } = await supabase
      .from('quotes')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete quote');
      throw error;
    }
    
    toast.success('Quote deleted successfully');
  }
};

// Jobs API
export const jobsApi = {
  getJobs: async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, quotes(*), crews(*)')
      .order('scheduled_date', { ascending: true });
    
    if (error) {
      toast.error('Failed to fetch jobs');
      throw error;
    }
    
    return data;
  },
  
  getJob: async (id: string) => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*, quotes(*), crews(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      toast.error('Failed to fetch job');
      throw error;
    }
    
    return data;
  },
  
  createJob: async (job: any) => {
    const { data, error } = await supabase
      .from('jobs')
      .insert(job)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to create job');
      throw error;
    }
    
    toast.success('Job created successfully');
    return data;
  },
  
  updateJob: async (id: string, job: any) => {
    const { data, error } = await supabase
      .from('jobs')
      .update(job)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to update job');
      throw error;
    }
    
    toast.success('Job updated successfully');
    return data;
  },
  
  deleteJob: async (id: string) => {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete job');
      throw error;
    }
    
    toast.success('Job deleted successfully');
  },
  
  addToSchedule: async (jobId: string, scheduleEvent: any) => {
    const { data, error } = await supabase
      .from('schedule_events')
      .insert({
        ...scheduleEvent,
        job_id: jobId
      })
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add job to schedule');
      throw error;
    }
    
    toast.success('Job added to schedule successfully');
    return data;
  }
};

// Crews API
export const crewsApi = {
  getCrews: async () => {
    const { data, error } = await supabase
      .from('crews')
      .select('*');
    
    if (error) {
      toast.error('Failed to fetch crews');
      throw error;
    }
    
    return data;
  },
  
  getCrew: async (id: string) => {
    const { data, error } = await supabase
      .from('crews')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      toast.error('Failed to fetch crew');
      throw error;
    }
    
    return data;
  },
  
  getCrewWithMembers: async (id: string) => {
    const { data, error } = await supabase
      .from('crews')
      .select('*, crew_members(*)')
      .eq('id', id)
      .single();
    
    if (error) {
      toast.error('Failed to fetch crew details');
      throw error;
    }
    
    return data;
  },
  
  createCrew: async (crew: any) => {
    const { data, error } = await supabase
      .from('crews')
      .insert(crew)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to create crew');
      throw error;
    }
    
    toast.success('Crew created successfully');
    return data;
  },
  
  updateCrew: async (id: string, crew: any) => {
    const { data, error } = await supabase
      .from('crews')
      .update(crew)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to update crew');
      throw error;
    }
    
    toast.success('Crew updated successfully');
    return data;
  },
  
  deleteCrew: async (id: string) => {
    const { error } = await supabase
      .from('crews')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete crew');
      throw error;
    }
    
    toast.success('Crew deleted successfully');
  },
  
  // Crew Members
  createCrewMember: async (member: any) => {
    const { data, error } = await supabase
      .from('crew_members')
      .insert(member)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to add crew member');
      throw error;
    }
    
    toast.success('Crew member added successfully');
    return data;
  },
  
  updateCrewMember: async (id: string, member: any) => {
    const { data, error } = await supabase
      .from('crew_members')
      .update(member)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to update crew member');
      throw error;
    }
    
    toast.success('Crew member updated successfully');
    return data;
  },
  
  deleteCrewMember: async (id: string) => {
    const { error } = await supabase
      .from('crew_members')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete crew member');
      throw error;
    }
    
    toast.success('Crew member deleted successfully');
  }
};

// Schedule API
export const scheduleApi = {
  getEvents: async (startDate?: string, endDate?: string) => {
    let query = supabase
      .from('schedule_events')
      .select('*, jobs(*), crews(*)');
    
    if (startDate) {
      query = query.gte('start_date', startDate);
    }
    
    if (endDate) {
      query = query.lte('end_date', endDate);
    }
    
    const { data, error } = await query.order('start_date', { ascending: true });
    
    if (error) {
      toast.error('Failed to fetch schedule events');
      throw error;
    }
    
    return data;
  },
  
  createEvent: async (event: any) => {
    const { data, error } = await supabase
      .from('schedule_events')
      .insert(event)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to create event');
      throw error;
    }
    
    toast.success('Event created successfully');
    return data;
  },
  
  updateEvent: async (id: string, event: any) => {
    const { data, error } = await supabase
      .from('schedule_events')
      .update(event)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to update event');
      throw error;
    }
    
    toast.success('Event updated successfully');
    return data;
  },
  
  deleteEvent: async (id: string) => {
    const { error } = await supabase
      .from('schedule_events')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete event');
      throw error;
    }
    
    toast.success('Event deleted successfully');
  }
};

// Response Templates API
export const templatesApi = {
  getTemplates: async () => {
    const { data, error } = await supabase
      .from('response_templates')
      .select('*')
      .order('title', { ascending: true });
    
    if (error) {
      toast.error('Failed to fetch templates');
      throw error;
    }
    
    return data;
  },
  
  createTemplate: async (template: any) => {
    const { data, error } = await supabase
      .from('response_templates')
      .insert(template)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to create template');
      throw error;
    }
    
    toast.success('Template created successfully');
    return data;
  },
  
  updateTemplate: async (id: string, template: any) => {
    const { data, error } = await supabase
      .from('response_templates')
      .update(template)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to update template');
      throw error;
    }
    
    toast.success('Template updated successfully');
    return data;
  },
  
  deleteTemplate: async (id: string) => {
    const { error } = await supabase
      .from('response_templates')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete template');
      throw error;
    }
    
    toast.success('Template deleted successfully');
  }
};

// Automated Campaigns API
export const campaignsApi = {
  getCampaigns: async () => {
    const { data, error } = await supabase
      .from('automated_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to fetch campaigns');
      throw error;
    }
    
    return data;
  },
  
  createCampaign: async (campaign: any) => {
    const { data, error } = await supabase
      .from('automated_campaigns')
      .insert(campaign)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to create campaign');
      throw error;
    }
    
    toast.success('Campaign created successfully');
    return data;
  },
  
  updateCampaign: async (id: string, campaign: any) => {
    const { data, error } = await supabase
      .from('automated_campaigns')
      .update(campaign)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      toast.error('Failed to update campaign');
      throw error;
    }
    
    toast.success('Campaign updated successfully');
    return data;
  },
  
  deleteCampaign: async (id: string) => {
    const { error } = await supabase
      .from('automated_campaigns')
      .delete()
      .eq('id', id);
    
    if (error) {
      toast.error('Failed to delete campaign');
      throw error;
    }
    
    toast.success('Campaign deleted successfully');
  }
};
