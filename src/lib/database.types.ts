export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      service_requests: {
        Row: {
          id: string;
          name: string;
          phone: string;
          email: string | null;
          location: string | null;
          service_type: string;
          description: string | null;
          desired_date: string | null;
          price_type: string | null;
          estimated_price: string | null;
          calculator_data: Json | null;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          email?: string | null;
          location?: string | null;
          service_type: string;
          description?: string | null;
          desired_date?: string | null;
          price_type?: string | null;
          estimated_price?: string | null;
          calculator_data?: Json | null;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          name?: string;
          phone?: string;
          email?: string | null;
          location?: string | null;
          service_type?: string;
          description?: string | null;
          desired_date?: string | null;
          price_type?: string | null;
          estimated_price?: string | null;
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
          created_at: string | null;
        };
        Insert: {
          id?: string;
          request_id?: string | null;
          file_url: string;
          file_name?: string | null;
          created_at?: string | null;
        };
        Update: {
          request_id?: string | null;
          file_url?: string;
          file_name?: string | null;
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
