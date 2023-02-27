import React, { useEffect, useState } from 'react';
import { Avatar, Input, List, Modal, Skeleton, Image, Typography, theme } from 'antd';
import './index.less';
import { SearchUserDialogProps } from '@/components/SearchUserDialog/typings';
import Empty from '@/components/Empty';
import { userApi } from '@/services/api';
import { UserSearchListVo } from '@/services/api/modules/user/typings';

const {Text} = Typography;
const {useToken} = theme;

const SearchUserDialog: React.FC<SearchUserDialogProps> = (props) => {
  const [modal, contextHolder] = Modal.useModal();
  const {token} = useToken();

  const {searchType, resultAction, ...antdModalProps} = props;

  const [searchResult, setSearchResult] = useState<UserSearchListVo[]>([]);
  const [searching, setSearching] = useState(false);

  const onSearch = async (value: string) => {
    setSearching(true);
    const {data: userList} = await userApi.searchUser({keywords: value});
    setSearchResult(userList ?? []);
    setSearching(false);
  };

  useEffect(() => {
    if (!props.open) {
      setSearchResult([]);
    }
  }, [props.open]);

  return (
    <Modal
      centered
      width={600}
      footer={null}
      destroyOnClose={true}
      {...antdModalProps}
    >
      <div className="my-4">
        <Input.Search
          placeholder="请输入用户名称..."
          onSearch={onSearch}
          enterButton
        />
      </div>
      <div className="w-full h-[300px] overflow-y-auto">
        <List
          itemLayout="horizontal"
          dataSource={searchResult}
          // dataSource={searchResult.filter(user => !user?.department)}
          renderItem={(user, index) => (
            <List.Item>
              <Skeleton avatar={{shape: 'circle'}} title paragraph={false} loading={searching} active>
                <div className="w-full flex items-center">
                  <Avatar icon={<Image src={user.userProfile.avgPath ?? ''} alt="" />} />
                  <Text className="ml-4">
                    {user.userProfile.username}
                  </Text>
                  {resultAction && resultAction(user, index)}
                </div>
              </Skeleton>
            </List.Item>
          )}
          locale={{
            emptyText: <div className="pt-12"><Empty /></div>
          }}
        />
      </div>
      {contextHolder}
    </Modal>
  );
};

export default SearchUserDialog;