import { ModalProps } from 'antd';
import React, { ReactNode } from 'react';

export type SearchType = 'all' | 'no-department'

export interface SearchUserDialogProps extends ModalProps {
  searchType: SearchType;
  resultAction?: ReactNode;
}
