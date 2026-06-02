export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      service_requests: {
        Row: {
          id: string;
          request_source: string | null;
          salutation: string | null;
          first_name: string | null;
          last_name: string | null;
          name: string;
          phone: string;
          email: string | null;
          location: string | null;
          service_type: string;
          service_category: string | null;
          selected_services: Json | null;
          effort_size: string | null;
          distance_zone: string | null;
          description: string | null;
          desired_date: string | null;
          price_type: string | null;
          estimated_price: string | null;
          fixed_price_suggestion: string | null;
          calculator_data: Json | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          request_source?: string | null;
          salutation?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          name: string;
          phone: string;
          email?: string | null;
          location?: string | null;
          service_type: string;
          service_category?: string | null;
          selected_services?: Json | null;
          effort_size?: string | null;
          distance_zone?: string | null;
          description?: string | null;
          desired_date?: string | null;
          price_type?: string | null;
          estimated_price?: string | null;
          fixed_price_suggestion?: string | null;
          calculator_data?: Json | null;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          request_source?: string | null;
          salutation?: string | null;
          first_name?: string | null;
          last_name?: string | null;
          name?: string;
          phone?: string;
          email?: string | null;
          location?: string | null;
          service_type?: string;
          service_category?: string | null;
          selected_services?: Json | null;
          effort_size?: string | null;
          distance_zone?: string | null;
          description?: string | null;
          desired_date?: string | null;
          price_type?: string | null;
          estimated_price?: string | null;
          fixed_price_suggestion?: string | null;
          calculator_data?: Json | null;
          status?: string | null;
        };
        Relationships: [];
      };
      request_images: {
        Row: {
          id: string;
          request_id: string | null;
          file_url: string;
          file_name: string | null;
          file_type: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          request_id?: string | null;
          file_url: string;
          file_name?: string | null;
          file_type?: string | null;
          created_at?: string | null;
        };
        Update: {
          request_id?: string | null;
          file_url?: string;
          file_name?: string | null;
          file_type?: string | null;
          created_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
