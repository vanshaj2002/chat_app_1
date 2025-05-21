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
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      chats: {
        Row: {
          id: string
          name: string | null
          is_group: boolean
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name?: string | null
          is_group?: boolean
          created_by: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          is_group?: boolean
          created_by?: string
          created_at?: string
          updated_at?: string
        }
      }
      chat_members: {
        Row: {
          id: string
          chat_id: string
          user_id: string
          joined_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          user_id: string
          joined_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          user_id?: string
          joined_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          chat_id: string
          sender_id: string
          content: string
          read_by: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          chat_id: string
          sender_id: string
          content: string
          read_by?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          chat_id?: string
          sender_id?: string
          content?: string
          read_by?: Json | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_chats: {
        Args: Record<PropertyKey, never>
        Returns: Array<{
          id: string
          name: string | null
          is_group: boolean
          last_message: string | null
          last_message_at: string | null
          unread_count: number
        }>
      }
      update_updated_at_column: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
