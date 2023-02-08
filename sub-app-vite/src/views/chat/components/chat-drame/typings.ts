import { ChatType } from '@/typings';

export interface ChatInfo {
  id: number;
  targetId: number;
  avatarUrl: string;
  targetName: string;
  remarkName?: string;
  type: ChatType;
}

export interface ChatFrameProps {
  chatInfo: ChatInfo;
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

export interface MessageSentEvent {
  id?: number;
  receiverInfo: {
    id?: number
    avgPath?: string
    name?: string
  };
  unread: number;
  content: string;
  isText: boolean;
  createdTime: number;
  chatType: ChatType;
}
