export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group'
}

// Socket的状态，-1:未连接，0:正在连接，1:已连接
export type SocketStatus = -1 | 0 | 1
