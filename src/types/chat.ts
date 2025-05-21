export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  is_online: boolean;
  last_seen?: string;
}

export interface Message {
  id: string;
  content: string;
  chat_id: string;
  sender_id: string;
  created_at: string;
  read: boolean;
  sender?: User;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  url: string;
  type: 'image' | 'video' | 'document' | 'audio';
  name: string;
  size: number;
  mime_type: string;
}

export interface Chat {
  id: string;
  name: string;
  is_group: boolean;
  avatar_url?: string;
  last_message?: {
    content: string;
    created_at: string;
    sender_name: string;
  };
  unread_count: number;
  members: User[];
  created_at: string;
  updated_at: string;
}

export interface ChatMember {
  id: string;
  chat_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  user: User;
}

export interface SendMessagePayload {
  content: string;
  chatId: string;
  attachments?: File[];
  replyToId?: string;
}

export interface CreateChatPayload {
  name?: string;
  isGroup: boolean;
  memberIds: string[];
  avatarFile?: File;
}
