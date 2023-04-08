import { ModalProps } from 'antd';

export interface DraftReviewProps extends ModalProps {
  draftId?: string | number;
  isDialog?: boolean;
  disabled?: boolean;
}
