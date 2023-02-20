import React, { useEffect, useState } from 'react';
import './index.less';
import { Button, Input, Menu, theme, Typography } from 'antd';
import { Department } from '@/services/api/modules/department/typings';
import { departmentApi } from '@/services/api';
import { useModel, useNavigate } from '@@/exports';
import Loading from '@/components/Loading';

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

  return (
    <Loading spinning={loading} size="large">
      <div className="department-menu w-full h-full">
        <div className="w-full pt-2 px-8">
          <Title level={3}>部门与人员</Title>
        </div>
        <div className="w-full px-8 mt-6">
          <div className="w-full flex">
            <Input
              className="custom-input"
              style={{background: colorFillSecondary}}
              placeholder="搜索部门/成员..."
            />
            <Button
              className="!w-[40px] ml-2"
              type="primary"
              icon={<i className="fi fi-br-search" />}
            />
          </div>
          <div className="w-full h-6"></div>
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
                      key: 'my-department'
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
                        // label: <Text>{(department.name ?? '') + '（11人）'}</Text>,
                        label: (
                          <div className="w-full flex">
                            <Text ellipsis>{department.name ?? ''}</Text>
                            <Text className="ml-auto flex-shrink-0" type="secondary">11人</Text>
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