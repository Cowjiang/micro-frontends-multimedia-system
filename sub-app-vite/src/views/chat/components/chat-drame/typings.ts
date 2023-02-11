import { ChatType } from '@/typings';

export interface ChatInfo {
  id: number;
  targetId: number;
  avatarUrl: string;
  targetName: string;
  remarkName?: string;
  type: ChatType;
}

// 重封装消息结构（仅用于模板渲染）
export interface Message {
  id?: number;
  content?: string;
  isPhoto?: boolean;
  isMe?: boolean;
  time?: number;
  userInfo: {
    username?: string,
    userId?: number,
    avatarUrl?: string
  };
}
