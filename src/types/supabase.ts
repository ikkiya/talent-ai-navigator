
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
      employees: {
        Row: {
          id: string
          employee_id: string
          first_name: string
          last_name: string
          email: string
          department: string
          position: string
          manager_id: string | null
          mentor_id: string | null
          hire_date: string
          status: 'active' | 'inactive' | 'onLeave'
          expected_departure_date: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          first_name: string
          last_name: string
          email: string
          department: string
          position: string
          manager_id?: string | null
          mentor_id?: string | null
          hire_date: string
          status: 'active' | 'inactive' | 'onLeave'
          expected_departure_date?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          first_name?: string
          last_name?: string
          email?: string
          department?: string
          position?: string
          manager_id?: string | null
          mentor_id?: string | null
          hire_date?: string
          status?: 'active' | 'inactive' | 'onLeave'
          expected_departure_date?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      project_assignments: {
        Row: {
          id: string
          employee_id: string
          project_id: string
          role: string
          start_date: string
          end_date: string | null
          utilization_percentage: number
          created_at: string
        }
        Insert: {
          id?: string
          employee_id: string
          project_id: string
          role: string
          start_date: string
          end_date?: string | null
          utilization_percentage: number
          created_at?: string
        }
        Update: {
          id?: string
          employee_id?: string
          project_id?: string
          role?: string
          start_date?: string
          end_date?: string | null
          utilization_percentage?: number
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          description: string
          start_date: string
          end_date: string | null
          status: 'planning' | 'active' | 'completed' | 'onHold'
          required_skills: string[]
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          start_date: string
          end_date?: string | null
          status: 'planning' | 'active' | 'completed' | 'onHold'
          required_skills: string[]
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          start_date?: string
          end_date?: string | null
          status?: 'planning' | 'active' | 'completed' | 'onHold'
          required_skills?: string[]
          created_at?: string
        }
      }
      competency_matrices: {
        Row: {
          id: string
          employee_id: string
          skills: Json
          last_updated: string
        }
        Insert: {
          id?: string
          employee_id: string
          skills: Json
          last_updated?: string
        }
        Update: {
          id?: string
          employee_id?: string
          skills?: Json
          last_updated?: string
        }
      }
      retention_matrices: {
        Row: {
          id: string
          employee_id: string
          factors: Json
          risk_score: number
          last_updated: string
        }
        Insert: {
          id?: string
          employee_id: string
          factors: Json
          risk_score: number
          last_updated?: string
        }
        Update: {
          id?: string
          employee_id?: string
          factors?: Json
          risk_score?: number
          last_updated?: string
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
      user_role: 'admin' | 'manager' | 'mentor'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]
