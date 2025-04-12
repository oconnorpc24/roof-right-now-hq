
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
  
  // Add other quote methods similar to leads
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
  
  // Add other job methods
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
  
  // Add other crew methods
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
  
  // Add other schedule methods
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
  
  // Add other template methods
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
  
  // Add other campaign methods
};
