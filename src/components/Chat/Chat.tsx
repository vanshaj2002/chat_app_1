'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  FiSend, 
  FiPaperclip, 
  FiMic, 
  FiSmile, 
  FiMoreVertical, 
  FiSearch, 
  FiImage,
  FiVideo,
  FiFile,
  FiX,
  FiUserPlus,
  FiUsers
} from 'react-icons/fi';
import { useChat } from '@/hooks/useChat';
import { formatDistanceToNow, format } from 'date-fns';
import type { Chat as ChatType, Message, User, SendMessagePayload } from '@/types/chat';

type ChatWithMembers = ChatType & {
  members: User[];
  last_message?: {
    content: string;
    created_at: string;
    sender_name: string;
  } | null;
  unread_count: number;
};

interface ChatProps {
  currentUser: User | null;
}

export default function Chat() {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  
  const {
    chats,
    messages,
    selectedChat,
    loading,
    error,
    newMessage,
    setNewMessage,
    sendMessage: sendChatMessage,
    selectChat,
    markAsRead,
    currentUser,
  } = useChat();

  const [searchQuery, setSearchQuery] = useState('');

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Mark messages as read when chat is selected
  useEffect(() => {
    if (selectedChat) {
      markAsRead(selectedChat);
    }
  }, [selectedChat, markAsRead]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...files]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!newMessage.trim() && attachments.length === 0) || !selectedChat) return;

    try {
      const messagePayload: SendMessagePayload = {
        content: newMessage.trim(),
        chatId: selectedChat,
        attachments,
        replyToId: replyTo?.id
      };
      
      await sendChatMessage(messagePayload);
      
      // Reset form
      setNewMessage('');
      setAttachments([]);
      setReplyTo(null);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Handle error (show toast/notification)
    }
  };
  
  const renderChatItem = (chat: ChatWithMembers) => {
    const lastMessage = chat.last_message;
    const lastMessageTime = lastMessage?.created_at || chat.updated_at;
    const unreadCount = chat.unread_count || 0;
    
    return (
      <div 
        key={chat.id}
        className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
          selectedChat === chat.id ? 'bg-blue-50' : ''
        }`}
        onClick={() => selectChat(chat.id)}
      >
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            {chat.avatar_url ? (
              <img 
                src={chat.avatar_url} 
                alt={chat.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium">
                {chat.name?.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          {chat.members?.some(member => member.is_online) && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {chat.name}
            </h3>
            {lastMessageTime && (
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(lastMessageTime), { addSuffix: true })}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center mt-1">
            <p className="text-sm text-gray-500 truncate">
              {lastMessage?.content || 'No messages yet'}
            </p>
            {unreadCount > 0 && (
              <span className="bg-blue-500 text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const filteredChats = chats.filter(chat => 
    chat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (Array.isArray(chat.members) && chat.members.some(member => 
      member?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) && 
      member.id !== currentUser?.id
    ))
  );

  const renderLastMessage = (chat: ChatType) => {
    if (!chat.last_message) return null;
    
    if (typeof chat.last_message === 'string') {
      return chat.last_message;
    }
    
    return chat.last_message.content;
  };
  
  const renderLastMessageTime = (chat: ChatType) => {
    if (!chat.last_message) return null;
    
    const timestamp = typeof chat.last_message === 'string' 
      ? chat.updated_at 
      : chat.last_message.created_at;
      
    return timestamp ? formatDistanceToNow(new Date(timestamp), { addSuffix: true }) : null;
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search or start new chat"
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {loading && !chats.length ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedChat === chat.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => selectChat(chat.id)}
              >
                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  {chat.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {chat.name || 'Unnamed Chat'}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {chat.last_message_at
                        ? formatDistanceToNow(new Date(chat.last_message_at), {
                            addSuffix: true,
                          })
                        : ''}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {chat.last_message || 'No messages yet'}
                  </p>
                </div>
                {chat.unread_count ? (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {chat.unread_count}
                  </span>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold">
                  {chats.find(c => c.id === selectedChat)?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {chats.find(c => c.id === selectedChat)?.name || 'Chat'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {chats.find(c => c.id === selectedChat)?.is_group ? 'Group' : 'Online'}
                  </p>
                </div>
              </div>
              <button 
                className="text-gray-500 hover:text-gray-700"
                title="More options"
                aria-label="More options"
              >
                <FiMoreVertical className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {loading && !messages.length ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center p-4">{error}</div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Send a message to start the conversation</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_id === 'current-user-id' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === 'current-user-id'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-white border border-gray-200 rounded-bl-none'
                        }`}
                      >
                        {message.sender_id !== 'current-user-id' && (
                          <div className="font-medium text-sm text-gray-700">
                            {message.sender?.full_name || 'Unknown User'}
                          </div>
                        )}
                        <p className="text-sm">{message.content}</p>
                        <div className="text-right mt-1">
                          <span className="text-xs opacity-70">
                            {formatDistanceToNow(new Date(message.created_at), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSubmit} className="flex items-center">
                <button 
                  type="button" 
                  className="text-gray-500 hover:text-gray-700 mr-2"
                  title="Insert emoji"
                  aria-label="Insert emoji"
                >
                  <FiSmile className="h-5 w-5" />
                </button>
                <button 
                  type="button" 
                  className="text-gray-500 hover:text-gray-700 mr-2"
                  title="Attach file"
                  aria-label="Attach file"
                >
                  <FiPaperclip className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message"
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <FiSend className="h-5 w-5" />
                  )}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-900">Select a chat</h3>
              <p className="mt-1 text-sm text-gray-500">
                Choose a conversation from the list or start a new one
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
