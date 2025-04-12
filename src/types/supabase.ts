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
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          role: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          role?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          password: string
          first_name: string
          last_name: string
          role: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          first_name: string
          last_name: string
          role: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          first_name?: string
          last_name?: string
          role?: string
          is_active?: boolean
          created_at?: string
        }
      }
      managers: {
        Row: {
          id: string
          user_id: string
          responsibility: string | null
          team_name: string | null
          is_active: boolean
          notification_setting: string | null
        }
        Insert: {
          id?: string
          user_id: string
          responsibility?: string | null
          team_name?: string | null
          is_active?: boolean
          notification_setting?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          responsibility?: string | null
          team_name?: string | null
          is_active?: boolean
          notification_setting?: string | null
        }
      }
      collaborators: {
        Row: {
          id: string
          user_id: string
          manager_id: string | null
          date_hired: string | null
          job_title: string | null
          department: string | null
          level: string | null
          years_experience: number | null
          is_active: boolean
        }
        Insert: {
          id?: string
          user_id: string
          manager_id?: string | null
          date_hired?: string | null
          job_title?: string | null
          department?: string | null
          level?: string | null
          years_experience?: number | null
          is_active?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          manager_id?: string | null
          date_hired?: string | null
          job_title?: string | null
          department?: string | null
          level?: string | null
          years_experience?: number | null
          is_active?: boolean
        }
      }
      competences: {
        Row: {
          id: string
          name: string
          description: string | null
          category: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          category?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          category?: string | null
          is_active?: boolean
        }
      }
      collaborator_competences: {
        Row: {
          id: string
          collaborator_id: string
          competence_id: string
          proficiency_level: number | null
          date_acquired: string
        }
        Insert: {
          id?: string
          collaborator_id: string
          competence_id: string
          proficiency_level?: number | null
          date_acquired?: string
        }
        Update: {
          id?: string
          collaborator_id?: string
          competence_id?: string
          proficiency_level?: number | null
          date_acquired?: string
        }
      }
      missions: {
        Row: {
          id: string
          name: string
          description: string | null
          responsibility: string | null
          start_date: string | null
          end_date: string | null
          status: string | null
          notification_setting: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          responsibility?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string | null
          notification_setting?: string | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          responsibility?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string | null
          notification_setting?: string | null
          is_active?: boolean
        }
      }
      collaboration_matrix: {
        Row: {
          id: string
          collaborator_id: string
          matrix_data: Json | null
          last_updated: string
          date_specific: string | null
          status: string | null
        }
        Insert: {
          id?: string
          collaborator_id: string
          matrix_data?: Json | null
          last_updated?: string
          date_specific?: string | null
          status?: string | null
        }
        Update: {
          id?: string
          collaborator_id?: string
          matrix_data?: Json | null
          last_updated?: string
          date_specific?: string | null
          status?: string | null
        }
      }
      collaborator_projects: {
        Row: {
          id: string
          collaborator_id: string
          project_id: string
          role: string | null
          start_date: string
          end_date: string | null
          allocation_percentage: number | null
        }
        Insert: {
          id?: string
          collaborator_id: string
          project_id: string
          role?: string | null
          start_date?: string
          end_date?: string | null
          allocation_percentage?: number | null
        }
        Update: {
          id?: string
          collaborator_id?: string
          project_id?: string
          role?: string | null
          start_date?: string
          end_date?: string | null
          allocation_percentage?: number | null
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
