import React from 'react';
import { ModalProps } from 'antd';
import { UserSearchListVo } from '@/services/api/modules/user/typings';

export interface SearchUserDialogProps extends ModalProps {
  dataFilter?: (userList: UserSearchListVo[]) => UserSearchListVo[];
  resultAction?: (item: UserSearchListVo, index: number) => React.ReactNode;
}
