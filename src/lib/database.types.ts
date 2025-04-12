
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string
          created_at: string
          name: string
          email: string | null
          phone: string | null
          address: string | null
          status: string | null
          source: string | null
          notes: string | null
          assigned_to: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: string | null
          source?: string | null
          notes?: string | null
          assigned_to?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          email?: string | null
          phone?: string | null
          address?: string | null
          status?: string | null
          source?: string | null
          notes?: string | null
          assigned_to?: string | null
        }
      }
      quotes: {
        Row: {
          id: string
          created_at: string
          lead_id: string | null
          title: string
          description: string | null
          amount: number
          status: string | null
          valid_until: string | null
          notes: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          lead_id?: string | null
          title: string
          description?: string | null
          amount: number
          status?: string | null
          valid_until?: string | null
          notes?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          lead_id?: string | null
          title?: string
          description?: string | null
          amount?: number
          status?: string | null
          valid_until?: string | null
          notes?: string | null
          created_by?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          created_at: string
          quote_id: string | null
          title: string
          client: string
          address: string
          scheduled_date: string | null
          status: string | null
          crew_id: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          quote_id?: string | null
          title: string
          client: string
          address: string
          scheduled_date?: string | null
          status?: string | null
          crew_id?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          quote_id?: string | null
          title?: string
          client?: string
          address?: string
          scheduled_date?: string | null
          status?: string | null
          crew_id?: string | null
          notes?: string | null
        }
      }
      crews: {
        Row: {
          id: string
          created_at: string
          name: string
          status: string | null
          specialties: string[] | null
          current_job: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          status?: string | null
          specialties?: string[] | null
          current_job?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          status?: string | null
          specialties?: string[] | null
          current_job?: string | null
          notes?: string | null
        }
      }
      crew_members: {
        Row: {
          id: string
          created_at: string
          crew_id: string
          name: string
          role: string | null
          phone: string | null
          email: string | null
          address: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          crew_id: string
          name: string
          role?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          crew_id?: string
          name?: string
          role?: string | null
          phone?: string | null
          email?: string | null
          address?: string | null
          notes?: string | null
        }
      }
      schedule_events: {
        Row: {
          id: string
          created_at: string
          job_id: string | null
          crew_id: string | null
          title: string
          description: string | null
          start_date: string
          end_date: string
          all_day: boolean | null
          status: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          job_id?: string | null
          crew_id?: string | null
          title: string
          description?: string | null
          start_date: string
          end_date: string
          all_day?: boolean | null
          status?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          job_id?: string | null
          crew_id?: string | null
          title?: string
          description?: string | null
          start_date?: string
          end_date?: string
          all_day?: boolean | null
          status?: string | null
        }
      }
      response_templates: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string
          category: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: string
          category?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: string
          category?: string | null
          created_by?: string | null
        }
      }
      automated_campaigns: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          trigger: string | null
          status: string | null
          created_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          trigger?: string | null
          status?: string | null
          created_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          trigger?: string | null
          status?: string | null
          created_by?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
