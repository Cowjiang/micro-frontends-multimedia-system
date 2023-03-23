import React, { useEffect, useState } from 'react';
import { Avatar, Input, List, Modal, Skeleton, Image, Typography, theme, Button } from 'antd';
import Empty from '@/components/Empty';
import { chatApi, userApi } from '@/services/api';
import { UserProfileExtVo } from '@/services/api/modules/user/typings';
import { UserInfoDialogProps } from '@/components/UserInfoDialog/typings';
import { useDispatch, useModel } from '@@/exports';

const {Text, Title} = Typography;
const {useToken} = theme;

const UserInfoDialog: React.FC<UserInfoDialogProps> = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const {token} = useToken();
  const dispatch = useDispatch();
  const {messageApi} = useModel('messageApi');

  const {userId, ...antdModalProps} = props;

  const [userInfo, setUserInfo] = useState<UserProfileExtVo>({});

  // 获取个人信息
  const getUserInfo = () => {
    userApi.getUserInfo({
      userId: Number(userId)
    }).then(res => {
      setUserInfo(res.data ?? {});
    });
  };

  useEffect(() => {
    if (props.open && userId !== userInfo?.userId && userId) {
      getUserInfo();
    }
  }, [props.open, userId]);

  // 发起私聊
  const handleChatOpen = async () => {
    if (userInfo.userId) {
      try {
        const {success, message} = await chatApi.sendPrivateMessage({
          receiverId: userInfo.userId,
          content: '你好~',
          type: 'text'
        });
        if (!success) {
          await Promise.reject(message);
        }
        dispatch({
          type: 'app/setChatAppConfig',
          payload: {
            chatAppConfig: {
              url: `http://localhost:3000/chat/home/chat/private/${userId}`,
              open: true
            }
          }
        });
      } catch (e) {
        messageApi.error('发起私聊失败');
      }
    }
  };

  return (
    <Modal
      centered
      width={600}
      footer={null}
      destroyOnClose={true}
      {...antdModalProps}
    >
      <div className="p-4 flex flex-col">
        <div className="flex items-center">
          <Avatar
            src={userInfo.avgPath}
            size={80}
          />
          <div className="ml-6 flex flex-col">
            <Title level={4}>
            <span className="font-bold text-2xl">
              {userInfo?.username ?? '用户'} #{userInfo?.userId ?? 'ID'}
            </span>
            </Title>
            <Text>
              所属部门：{userInfo?.department?.name ?? '暂无'}
            </Text>
          </div>
        </div>
        <div className="mt-4">
          <Text className="font-bold">手机号：</Text>
          <Text className="!mt-1">
            {userInfo?.phone ?? '暂无'}
          </Text>
        </div>
        <div className="mt-4">
          <Text className="font-bold">电子邮箱：</Text>
          <Text className="!mt-1">
            {userInfo?.email ?? '暂无'}
          </Text>
        </div>
        <div className="mt-8 flex justify-end">
          <Button type="primary" onClick={handleChatOpen}>
            发起私信
          </Button>
          <Button className="ml-4" danger>
            屏蔽用户
          </Button>
        </div>
      </div>
      {contextHolder}
    </Modal>
  );
};

export default UserInfoDialog;
