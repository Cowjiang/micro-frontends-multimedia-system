import { ModalProps } from 'antd';
import { UserSearchListVo } from '@/services/api/modules/user/typings';
import React from 'react';

export interface UserInfoDialogProps extends ModalProps {
  userId: number | string;
}
