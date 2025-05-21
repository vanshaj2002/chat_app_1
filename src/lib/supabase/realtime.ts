import { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

type Message = Database['public']['Tables']['messages']['Row'];
type Callback = (payload: any) => void;

export class ChatRealtime {
  private channel: RealtimeChannel | null = null;
  private callbacks: Set<Callback> = new Set();
  private subscribedChats: Set<string> = new Set();

  constructor(private supabase: SupabaseClient) {}

  // Subscribe to a chat's messages
  async subscribeToChat(chatId: string, onMessage: Callback) {
    if (this.subscribedChats.has(chatId)) return;

    this.callbacks.add(onMessage);
    this.subscribedChats.add(chatId);

    if (!this.channel) {
      this.channel = this.supabase.channel('chat_messages');
    }

    this.channel
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          this.notifyCallbacks(payload);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to chat ${chatId}`);
        }
      });

    return () => {
      this.unsubscribeFromChat(chatId, onMessage);
    };
  }

  // Unsubscribe from a chat's messages
  unsubscribeFromChat(chatId: string, onMessage: Callback) {
    this.callbacks.delete(onMessage);
    
    // Check if there are any remaining callbacks for this chat
    const hasOtherSubscribers = Array.from(this.callbacks).some(
      (cb) => cb.toString() === onMessage.toString()
    );

    if (!hasOtherSubscribers) {
      this.subscribedChats.delete(chatId);
      
      // If no more chats are being listened to, remove the channel
      if (this.subscribedChats.size === 0 && this.channel) {
        this.supabase.removeChannel(this.channel);
        this.channel = null;
      }
    }
  }

  // Notify all callbacks of a new message
  private notifyCallbacks(payload: any) {
    this.callbacks.forEach((callback) => callback(payload));
  }

  // Get the current channel
  getChannel() {
    return this.channel;
  }
}

// Create a singleton instance
export let chatRealtime: ChatRealtime;

export function initChatRealtime(supabase: SupabaseClient) {
  if (!chatRealtime) {
    chatRealtime = new ChatRealtime(supabase);
  }
  return chatRealtime;
}
