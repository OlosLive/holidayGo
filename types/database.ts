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
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          role: string | null
          department: string | null
          hire_date: string | null
          status: string
          avatar_url: string | null
          vacation_balance: number
          vacation_used: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          role?: string | null
          department?: string | null
          hire_date?: string | null
          status?: string
          avatar_url?: string | null
          vacation_balance?: number
          vacation_used?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string | null
          department?: string | null
          hire_date?: string | null
          status?: string
          avatar_url?: string | null
          vacation_balance?: number
          vacation_used?: number
          created_at?: string
          updated_at?: string
        }
      }
      vacations: {
        Row: {
          id: string
          user_id: string
          vacation_date: string
          year: number
          month: number
          day: number
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          vacation_date: string
          year: number
          month: number
          day: number
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          vacation_date?: string
          year?: number
          month?: number
          day?: number
          status?: string
          created_at?: string
          updated_at?: string
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

// Helper types for easier usage
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export type Vacation = Database['public']['Tables']['vacations']['Row'];
export type VacationInsert = Database['public']['Tables']['vacations']['Insert'];
export type VacationUpdate = Database['public']['Tables']['vacations']['Update'];

