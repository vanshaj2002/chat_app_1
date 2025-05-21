'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { initChatRealtime } from '@/lib/supabase/realtime';
import { Chat, Message, User, SendMessagePayload } from '@/types/chat';

type ChatWithMembers = Chat & {
  members: User[];
  last_message?: {
    content: string;
    created_at: string;
    sender_name: string;
  } | null;
  unread_count: number;
};

type UseChatReturn = {
  chats: ChatWithMembers[];
  messages: Message[];
  selectedChat: string | null;
  loading: boolean;
  error: string | null;
  newMessage: string;
  currentUser: User | null;
  setNewMessage: (message: string) => void;
  sendMessage: (payload: SendMessagePayload) => Promise<void>;
  selectChat: (chatId: string) => void;
  refreshChats: () => Promise<void>;
  markAsRead: (chatId: string) => Promise<void>;
  startTyping: () => void;
  stopTyping: () => void;
};

export function useChat(): UseChatReturn {
  const [chats, setChats] = useState<ChatWithMembers[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const supabase = createClientComponentClient<Database>();
  const router = useRouter();

  // Initialize real-time subscription
  useEffect(() => {
    const chatRealtime = initChatRealtime(supabase);
    return () => {
      const channel = chatRealtime.getChannel();
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabase]);

  // Fetch user's chats
  const fetchChats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: chatsData, error: chatsError } = await supabase
        .rpc('get_user_chats');

      if (chatsError) throw chatsError;
      
      setChats(chatsData || []);
      
      // Select the first chat by default if none is selected
      if (chatsData?.length > 0 && !selectedChat) {
        setSelectedChat(chatsData[0].id);
      }
    } catch (err) {
      console.error('Error fetching chats:', err);
      setError('Failed to load chats');
    } finally {
      setLoading(false);
    }
  }, [selectedChat, supabase, router]);

  // Fetch messages for the selected chat
  const fetchMessages = useCallback(async (chatId: string) => {
    if (!chatId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data: messagesData, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users(id, full_name, avatar_url)
        `)
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;
      
      setMessages(messagesData || []);
      
      // Mark messages as read
      await markMessagesAsRead(chatId);
      
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Mark messages as read
  const markMessagesAsRead = async (chatId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get unread messages
      const { data: unreadMessages } = await supabase
        .from('messages')
        .select('id, read_by')
        .eq('chat_id', chatId)
        .neq('sender_id', user.id)
        .or(`read_by->${user.id}.isNull`);

      if (!unreadMessages?.length) return;

      // Mark messages as read
      for (const message of unreadMessages) {
        const readBy = message.read_by || {};
        readBy[user.id] = { read_at: new Date().toISOString() };
        
        await supabase
          .from('messages')
          .update({ read_by: readBy })
          .eq('id', message.id);
      }
      
      // Refresh chats to update unread count
      fetchChats();
    } catch (err) {
      console.error('Error marking messages as read:', err);
    }
  };

  // Handle sending a new message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('messages')
        .insert([
          {
            chat_id: selectedChat,
            sender_id: user.id,
            content: newMessage.trim(),
          },
        ]);

      if (error) throw error;
      
      setNewMessage('');
      
      // Update the last message in the chats list
      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === selectedChat
            ? {
                ...chat,
                last_message: newMessage.trim(),
                last_message_at: new Date().toISOString(),
              }
            : chat
        )
      );
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message');
    }
  };

  // Handle chat selection
  const selectChat = (chatId: string) => {
    setSelectedChat(chatId);
    fetchMessages(chatId);
  };

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!selectedChat) return;
    
    const chatRealtime = initChatRealtime(supabase);
    
    const handleNewMessage = (payload: any) => {
      if (payload.eventType === 'INSERT') {
        const newMessage = payload.new;
        
        // Add the new message to the current chat
        setMessages(prev => [...prev, newMessage]);
        
        // Update the last message in the chats list
        setChats(prevChats =>
          prevChats.map(chat =>
            chat.id === newMessage.chat_id
              ? {
                  ...chat,
                  last_message: newMessage.content,
                  last_message_at: newMessage.created_at,
                  unread_count: 
                    newMessage.sender_id !== supabase.auth.getUser()?.id
                      ? (chat.unread_count || 0) + 1
                      : 0,
                }
              : chat
          )
        );
        
        // Mark as read if it's the current chat
        if (selectedChat === newMessage.chat_id) {
          markMessagesAsRead(newMessage.chat_id);
        }
      }
    };
    
    const unsubscribe = chatRealtime.subscribeToChat(selectedChat, handleNewMessage);
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedChat, supabase]);

  // Initial data fetch
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  // Fetch messages when selected chat changes
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat, fetchMessages]);

  return {
    chats,
    messages,
    selectedChat,
    loading,
    error,
    newMessage,
    setNewMessage,
    sendMessage,
    selectChat,
    refreshChats: fetchChats,
  };
}
