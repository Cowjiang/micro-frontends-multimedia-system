import { ModalProps } from 'antd';

export interface ChatDialogProps extends ModalProps {
}

export enum ChatType {
  PRIVATE = 'private',
  GROUP = 'group'
}
