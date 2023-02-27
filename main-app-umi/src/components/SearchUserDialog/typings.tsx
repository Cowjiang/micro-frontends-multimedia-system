import React from 'react';
import { ModalProps } from 'antd';
import { UserSearchListVo } from '@/services/api/modules/user/typings';

export type SearchType = 'all' | 'no-department'

export interface SearchUserDialogProps extends ModalProps {
  searchType: SearchType;
  resultAction?: (item: UserSearchListVo, index: number) => React.ReactNode;
}
