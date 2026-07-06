export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: 'admin' | 'staff'
          created_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'staff'
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'staff'
          created_at?: string
        }
      }
      service_requests: {
        Row: {
          id: string
          redemption_code: string
          category: 'affidavit' | 'newspaper'
          service_id: string
          service_name: string
          status: 'pending_payment' | 'submitted' | 'processing' | 'approved' | 'published' | 'cancelled'
          contact_phone: string | null
          contact_email: string | null
          referral_code: string | null
          form_data: Json
          payment_method: string | null
          amount_paid: number
          payment_reference: string | null
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          paid_at: string | null
          document_url: string | null
          download_available: boolean
          expires_at: string
          submitted_at: string
          estimated_ready_at: string | null
          ready_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          redemption_code: string
          category: 'affidavit' | 'newspaper'
          service_id: string
          service_name: string
          status?: 'pending_payment' | 'submitted' | 'processing' | 'approved' | 'published' | 'cancelled'
          contact_phone: string | null
          contact_email?: string | null
          referral_code?: string | null
          form_data?: Json
          payment_method?: string | null
          amount_paid?: number
          payment_reference?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          paid_at?: string | null
          document_url?: string | null
          download_available?: boolean
          expires_at: string
          submitted_at?: string
          estimated_ready_at?: string | null
          ready_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          redemption_code?: string
          category?: 'affidavit' | 'newspaper'
          service_id?: string
          service_name?: string
          status?: 'pending_payment' | 'submitted' | 'processing' | 'approved' | 'published' | 'cancelled'
          contact_phone?: string
          contact_email?: string | null
          referral_code?: string | null
          form_data?: Json
          payment_method?: string | null
          amount_paid?: number
          payment_reference?: string | null
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          paid_at?: string | null
          document_url?: string | null
          download_available?: boolean
          expires_at?: string
          submitted_at?: string
          estimated_ready_at?: string | null
          ready_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      request_timeline: {
        Row: {
          id: string
          request_id: string
          status: string
          label: string
          event_date: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          status: string
          label: string
          event_date?: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          status?: string
          label?: string
          event_date?: string
          completed?: boolean
          created_at?: string
        }
      }
      request_documents: {
        Row: {
          id: string
          request_id: string
          field_id: string
          field_label: string | null
          storage_path: string
          file_name: string | null
          mime_type: string | null
          created_at: string
        }
        Insert: {
          id?: string
          request_id: string
          field_id: string
          field_label?: string | null
          storage_path: string
          file_name?: string | null
          mime_type?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string
          field_id?: string
          field_label?: string | null
          storage_path?: string
          file_name?: string | null
          mime_type?: string | null
          created_at?: string
        }
      }
      notification_logs: {
        Row: {
          id: string
          request_id: string | null
          channel: 'sms' | 'email'
          recipient: string
          notification_type: string
          status: 'pending' | 'sent' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          request_id?: string | null
          channel: 'sms' | 'email'
          recipient: string
          notification_type: string
          status?: 'pending' | 'sent' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          request_id?: string | null
          channel?: 'sms' | 'email'
          recipient?: string
          notification_type?: string
          status?: 'pending' | 'sent' | 'failed'
          created_at?: string
        }
      }
    }
    Functions: {
      get_request_by_code: {
        Args: { p_code: string }
        Returns: Json
      }
    }
  }
}

export type ServiceRequestRow = Database['public']['Tables']['service_requests']['Row']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
