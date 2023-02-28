import React from 'react';
import { ModalProps } from 'antd';
import { UserSearchListVo } from '@/services/api/modules/user/typings';

export type SearchType = 'all' | 'no-department' | 'custom'

export interface SearchUserDialogProps extends ModalProps {
  searchType: SearchType;
  dataFilter?: (userList: UserSearchListVo[]) => UserSearchListVo[];
  resultAction?: (item: UserSearchListVo, index: number) => React.ReactNode;
}
