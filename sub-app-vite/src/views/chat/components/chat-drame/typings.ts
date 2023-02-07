export interface ChatInfo {
  id: number;
  avatarUrl: string;
  username: string;
  remarkName?: string;
  lastMessage: string;
  time: number;
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
}
