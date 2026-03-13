export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12'
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          birth_date: string
          gender: 'male' | 'female'
          has_hypertension: boolean
          has_diabetes: boolean
          is_pregnant: boolean
          preset_morning: string
          preset_lunch: string
          preset_dinner: string
          preset_bedtime: string
          is_onboarded: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string
          birth_date?: string
          gender?: 'male' | 'female'
          has_hypertension?: boolean
          has_diabetes?: boolean
          is_pregnant?: boolean
          preset_morning?: string
          preset_lunch?: string
          preset_dinner?: string
          preset_bedtime?: string
          is_onboarded?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          birth_date?: string
          gender?: 'male' | 'female'
          has_hypertension?: boolean
          has_diabetes?: boolean
          is_pregnant?: boolean
          preset_morning?: string
          preset_lunch?: string
          preset_dinner?: string
          preset_bedtime?: string
          is_onboarded?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      pill_histories: {
        Row: {
          id: string
          user_id: string
          pill_name: string
          item_seq: string
          start_date: string
          end_date: string | null
          times: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pill_name: string
          item_seq: string
          start_date: string
          end_date?: string | null
          times: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          pill_name?: string
          item_seq?: string
          start_date?: string
          end_date?: string | null
          times?: string[]
          is_active?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      pill_taken_records: {
        Row: {
          id: string
          user_id: string
          pill_history_id: string
          taken_date: string
          time_slot: 'morning' | 'lunch' | 'dinner' | 'bedtime'
          taken_at: string
        }
        Insert: {
          id?: string
          user_id: string
          pill_history_id: string
          taken_date: string
          time_slot: 'morning' | 'lunch' | 'dinner' | 'bedtime'
          taken_at?: string
        }
        Update: {
          taken_at?: string
        }
        Relationships: []
      }
      pill_information: {
        Row: {
          id: string
          item_seq: string
          item_name: string
          entp_name: string
          class_name: string
          etc_otc_name: string
          item_image: string | null
          efcy_qesitm: string | null
          use_method_qesitm: string | null
          atpn_qesitm: string | null
          created_at: string
        }
        Insert: {
          id?: string
          item_seq: string
          item_name: string
          entp_name: string
          class_name: string
          etc_otc_name: string
          item_image?: string | null
          efcy_qesitm?: string | null
          use_method_qesitm?: string | null
          atpn_qesitm?: string | null
          created_at?: string
        }
        Update: {
          item_name?: string
          entp_name?: string
          class_name?: string
          etc_otc_name?: string
          item_image?: string | null
          efcy_qesitm?: string | null
          use_method_qesitm?: string | null
          atpn_qesitm?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
