import React, { useEffect, useState } from 'react';
import './index.less';
import { Button, Input, Menu, theme, Typography } from 'antd';
import { Department } from '@/services/api/modules/department/typings';
import { departmentApi } from '@/services/api';
import { useModel, useNavigate } from '@@/exports';
import Loading from '@/components/Loading';
import SearchUserDialog from '@/components/SearchUserDialog';

const {Title, Text} = Typography;
const {useToken} = theme;

const DepartmentMenu: React.FC = () => {
  const {messageApi} = useModel('messageApi');
  const navigate = useNavigate();
  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorFillSecondary} = token;

  const [loading, setLoading] = useState(true);
  // 部门列表
  const [departmentList, setDepartmentList] = useState<Department[]>([]);
  useEffect(() => {
    departmentApi.getDepartmentList().then(res => {
      if (res.data?.length) {
        setDepartmentList(res.data);
      }
    }).catch(e => {
      console.error(e);
      messageApi.error('获取部门列表失败');
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  // 显示搜索用户弹窗
  const [showSearchUser, setShowSearchUser] = useState(false);

  return (
    <Loading spinning={loading} size="large">
      <div className="department-menu w-full h-full">
        <div className="w-full pt-8 px-8">
          <Title level={3}>部门与人员</Title>
        </div>
        <div className="w-full px-8 mt-6">
          <div className="w-full flex">
            <Input
              className="custom-input"
              style={{background: colorFillSecondary}}
              placeholder="搜索部门/成员..."
              value=""
              onClick={() => setShowSearchUser(true)}
            />
            <Button
              className="!w-[40px] ml-2"
              type="primary"
              icon={<i className="fi fi-br-search" />}
              onClick={() => setShowSearchUser(true)}
            />
          </div>
          <div className="w-full h-6"></div>
          <SearchUserDialog
            open={showSearchUser}
            title="搜索部门/成员成员"
            dataFilter={(data) => data.filter(r => r.department?.id)}
            resultAction={
              (user, _) => (
                <Text className="ml-auto">
                  <a style={{color: token.colorPrimary}}>
                    查看
                  </a>
                </Text>
              )
            }
            onCancel={() => setShowSearchUser(false)}
          />
        </div>
        <div className="w-full">
          <div className="w-full px-4">
            <Menu
              className="!bg-transparent !border-r-0"
              mode="inline"
              selectable={false}
              items={[
                {
                  label: '部门概览',
                  key: 'department-overview',
                  type: 'group',
                  children: [
                    {type: 'divider'},
                    {
                      label: '我的部门',
                      key: 'my-department',
                      onClick: () => navigate(`/department`)
                    }
                  ]
                },
                {
                  label: '部门列表',
                  key: 'department-list',
                  type: 'group',
                  children: [
                    {type: 'divider'},
                    ...departmentList.length
                      ? departmentList.map(department => ({
                        label: (
                          <div className="w-full flex">
                            <Text ellipsis>{department.name ?? ''}</Text>
                            <Text className="ml-auto flex-shrink-0" type="secondary">{department?.num ?? 0} 人</Text>
                          </div>
                        ),
                        key: department.id ?? '',
                        onClick: () => navigate(`/department/${department.id}/members`)
                      }))
                      : [{
                        label: '空空如也',
                        key: 'empty',
                        disabled: true
                      }]
                  ]
                },
                {
                  label: '部门管理',
                  key: 'department-manage',
                  type: 'group',
                  children: [
                    {type: 'divider'},
                    {
                      label: '新增部门',
                      key: 'create-department'
                    },
                    {
                      label: '导出部门信息',
                      key: 'export-department'
                    }
                  ]
                }
              ]}
            />
          </div>
        </div>
      </div>
    </Loading>
  );
};

export default DepartmentMenu;
