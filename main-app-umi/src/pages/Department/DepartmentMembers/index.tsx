import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import { useModel, useNavigate, useParams } from '@@/exports';
import { departmentApi } from '@/services/api';
import { DepartMemberListVo, Department, UserRole } from '@/services/api/modules/department/typings';
import { Avatar, Breadcrumb, Button, Dropdown, Image, message, Table, Tag, theme, Typography } from 'antd';
import { useSetDocTitle } from '@/utils/hooks';
import { ColumnsType } from 'antd/es/table';
import { useSize } from 'ahooks';
import Empty from '@/components/Empty';
import SearchUserDialog from '@/components/SearchUserDialog';
import { UserRoleTag } from '@/pages/Department/DepartmentMembers/typings';
import { TAG_COLOR_LIST } from '@/constants';

const {Title, Text} = Typography;
const {useToken} = theme;

const DepartmentMembersPage: React.FC = () => {
  const navigate = useNavigate();
  const {token} = useToken();
  const {messageApi} = useModel('messageApi');

  const tableContainerRef = useRef(null);
  const tableContainerSize = useSize(tableContainerRef);
  const bodySize = useSize(document.body);
  const [tableContainerHeight, setTableContainerHeight] = useState(0);
  useEffect(() => {
    if (tableContainerSize?.height) {
      setTableContainerHeight(tableContainerSize.height - 130);
    }
  }, [tableContainerSize, bodySize]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [tableLoading, setTableLoading] = useState(true);

  const {id: departmentId} = useParams();
  const [departmentInfo, setDepartmentInfo] = useState<Department>({});
  let departmentName: string;
  useEffect(() => {
    if (departmentId) {
      departmentApi.getDepartmentDetail(departmentId).then(res => {
        if (res.data) {
          setDepartmentInfo(res.data);
          departmentName = res.data.name ?? '';
          getUserRoles().then(() => {
            getDepartmentMemberList();
          });
        }
      }).catch(e => {
        console.error(e);
        setTableLoading(false);
      });
    }
  }, []);
  useSetDocTitle(`部门成员${departmentInfo.name ? ' - ' + departmentInfo.name : ''}`);

  // 部门角色
  const [userRoleList, setUserRoleList] = useState<UserRoleTag[]>([]);
  // 获取部门角色
  const getUserRoles = async () => {
    if (departmentId) {
      try {
        const {data} = await departmentApi.getDepartmentUserRoles(departmentId);
        const roleList: UserRoleTag[] = data?.map((role, index) => ({...role, color: TAG_COLOR_LIST[index]})) ?? [];
        setUserRoleList(roleList);
      } catch (e) {
        messageApi.error('获取成员角色失败');
      }
    }
  };

  // 部门成员列表
  const [memberList, setMemberList] = useState<DepartMemberListVo[]>([]);
  // 获取表格数据
  const getDepartmentMemberList = () => {
    if (departmentId) {
      setTableLoading(true);
      setMemberList([]);
      departmentApi.getDepartmentUser(departmentId).then(res => {
        setMemberList(res.data ?? []);
      }).finally(() => {
        setSelectedRowKeys([]);
        setTableLoading(false);
      });
    }
  };

  // 编辑状态
  const [editStatus, setEditStatus] = useState(false);
  // 切换编辑状态
  const changeEditStatus = () => {
    setEditStatus(!editStatus);
    setSelectedRowKeys([]);
  };
  // 表格行多选更改事件
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: DepartMemberListVo[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 显示搜索用户弹窗
  const [showSearchUser, setShowSearchUser] = useState(false);

  // 添加部门成员
  const addDepartmentMember = (userId?: number) => {
    if (userId && departmentId) {
      departmentApi.addDepartmentUser({
        departmentId, userId
      }).then(() => {
        messageApi.success('添加成功');
        setShowSearchUser(false);
      }).catch(() => {
        messageApi.error('添加失败');
      }).finally(() => {
        getDepartmentMemberList();
      });
    }
  };

  // 移除部门成员
  const removeDepartmentMember = async (userId?: number) => {
    if (userId && departmentId) {
      await departmentApi.removeDepartmentUser({
        departmentId, userId
      }).then(() => {
        messageApi.success('移除成功');
      }).catch(() => {
        messageApi.error('移除失败');
      }).finally(() => {
        getDepartmentMemberList();
      });
    }
  };

  // 批量移除
  const multipleRemoveMember = (keys: React.Key[]) => {
    const removePromiseList = keys.map(key => {
      const userId = memberList.find(member => member.userProfile?.userId === key)?.userProfile?.userId;
      return departmentId && userId && departmentApi.removeDepartmentUser({
        departmentId, userId
      });
    });
    Promise.all(removePromiseList).then(() => {
      messageApi.success('移除成功');
    }).catch(() => {
      messageApi.error('移除失败');
    }).finally(() => {
      getDepartmentMemberList();
    });
  };

  const columns: ColumnsType<DepartMemberListVo> = [
    {
      title: '编号',
      width: 60,
      dataIndex: 'id',
      key: 'id',
      fixed: 'left',
      render: (_, {userProfile}) => (
        <Text>{userProfile?.userId ?? ''}</Text>
      ),
      sorter: (a, b) => {
        if (a.userProfile?.userId && b.userProfile?.userId) {
          return a.userProfile.userId - b.userProfile.userId;
        } else {
          return 0;
        }
      }
    },
    {
      title: '成员',
      width: 120,
      dataIndex: 'username',
      key: 'username',
      fixed: 'left',
      render: (_, {userProfile}) => (
        <div className="w-full flex items-center">
          <Avatar icon={<Image src={userProfile?.avgPath ?? ''} alt="" />} />
          <Text className="ml-2">
            {userProfile?.username ?? ''}
          </Text>
        </div>
      )
    },
    {
      title: '角色',
      width: 200,
      dataIndex: 'role',
      key: 'role',
      render: (_, {userRoles}) => (
        <div>
          {userRoles?.map(role => (
            <Tag
              key={role.id}
              color={userRoleList.find(roleTag => roleTag.id === role.id)?.color}
            >
              {role.roleName}
            </Tag>
          ))}
        </div>
      ),
      filters: userRoleList.map(role => ({
        text: role.roleName ?? '',
        value: role.id ?? ''
      })),
      onFilter: (value, {userRoles}) => (
        userRoles?.findIndex(role => role.id === value) !== -1
      )
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 180,
      render: (_, {userProfile}) => <Text>{userProfile?.phone ?? ''}</Text>
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      ellipsis: true,
      key: 'email',
      width: 200,
      render: (_, {userProfile}) => <Text>{userProfile?.email ?? ''}</Text>
    },
    {
      title: '',
      key: 'operation',
      fixed: 'right',
      width: 60,
      render: (_, {userProfile}) => (
        <Dropdown
          menu={{
            items: [
              {
                label: '编辑',
                key: '1'
              },
              {
                label: '查看详细',
                key: '2'
              },
              {
                label: '移出部门',
                key: '3',
                danger: true,
                // disabled: true,
                onClick: () => removeDepartmentMember(userProfile?.userId)
              }
            ]
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text"><i className="fi fi-bs-menu-dots" /></Button>
        </Dropdown>
      )
    }
  ];

  return (
    <div className="department-members-page w-full h-full px-12 flex flex-col">
      <div className="w-full mt-2 flex flex-shrink-0">
        <div className="w-full mr-4 flex flex-col overflow-hidden">
          <Breadcrumb className="!mt-2">
            <Breadcrumb.Item>
              部门列表
            </Breadcrumb.Item>
            <Breadcrumb.Item>{departmentInfo.name ?? ''}</Breadcrumb.Item>
            <Breadcrumb.Item>部门成员</Breadcrumb.Item>
          </Breadcrumb>
          <Title level={3} className="mt-6">{departmentInfo.name ?? ''}(10人)</Title>
          <Text ellipsis={true}>部门简介：{departmentInfo.description ?? ''}</Text>
        </div>
        <div className="h-full ml-auto flex flex-shrink-0 items-end">
          <Button ghost type="primary" onClick={() => navigate(`/department/${departmentId}/detail`)}>
            部门详情
          </Button>
          <Button className="ml-4" type="primary" onClick={changeEditStatus}>
            {editStatus ? '取消' : '编辑人员'}
          </Button>
          {
            editStatus && (
              <Button className="ml-4" type="primary" danger onClick={changeEditStatus}>
                保存更改
              </Button>
            )
          }
        </div>
      </div>
      <div className="w-full h-[30px] flex-shrink-0"></div>
      <div className="w-full min-h-[400px] flex-grow" ref={tableContainerRef}>
        <Table
          columns={columns}
          dataSource={memberList.map(member => ({...member, key: member.userProfile?.userId}))}
          scroll={{x: 1500, y: tableContainerHeight ?? 800}}
          loading={{
            size: 'large',
            spinning: tableLoading
          }}
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
            showTotal: () => (
              editStatus && (
                <div className="w-full h-full flex items-center">
                  {
                    selectedRowKeys.length > 0 && (
                      <>
                        <Text strong style={{color: token.colorPrimary}}>
                          当前已选中 {selectedRowKeys.length} 人
                        </Text>
                        <Button
                          className="mx-4"
                          danger
                          onClick={() => multipleRemoveMember(selectedRowKeys)}
                        >
                          移出部门
                        </Button>
                      </>
                    )
                  }
                  <Button type="primary" onClick={() => setShowSearchUser(true)}>
                    新增成员
                  </Button>
                  <Button
                    className="ml-4"
                    type="primary"
                    ghost
                    onClick={() => navigate(`/department/${departmentId}/roles/config`)}
                  >
                    部门角色编辑
                  </Button>
                  <SearchUserDialog
                    open={showSearchUser}
                    title="添加部门成员"
                    searchType="no-department"
                    resultAction={
                      (user, _) => (
                        <Text className="ml-auto">
                          <a
                            style={{color: token.colorPrimary}}
                            onClick={() => addDepartmentMember(user.userProfile.userId)}
                          >
                            添加
                          </a>
                        </Text>
                      )
                    }
                    onCancel={() => setShowSearchUser(false)}
                  />
                </div>
              )
            )
          }}
          {
            ...{
              rowSelection: editStatus ? {
                selectedRowKeys,
                onChange: onSelectChange
              } : undefined
            }
          }
          locale={{
            emptyText: () => (
              <div className="w-full my-[22vh]">
                <Empty />
              </div>
            )
          }}
        />
      </div>
    </div>
  );
};

export default DepartmentMembersPage;
