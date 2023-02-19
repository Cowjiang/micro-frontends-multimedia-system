import React, { useEffect, useState } from 'react';
import './index.less';
import { Button, Divider, Input, Menu, theme, Typography } from 'antd';
import { Department } from '@/services/api/modules/department/typings';
import { departmentApi } from '@/services/api';
import { useModel, useNavigate } from '@@/exports';
import Loading from '@/components/Loading';

const {Title} = Typography;
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
        <div className="w-full px-8 mt-4">
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
          <Divider />
        </div>
        <div className="w-full">
          <div className="w-full px-8">
            <Title level={4}>部门信息</Title>
          </div>
          <div className="w-full px-1">
            <Menu
              className="!bg-transparent !border-r-0"
              mode="inline"
              selectable={false}
              items={[
                {
                  label: '我的部门',
                  key: 'my-department'
                }
              ]}
            />
          </div>
        </div>
        <div className="w-full">
          <div className="w-full px-8">
            <Divider />
            <Title level={4}>全部部门</Title>
          </div>
          <div className="w-full px-1">
            <Menu
              className="!bg-transparent !border-r-0"
              mode="inline"
              selectable={false}
              items={
                departmentList.map(department => {
                  return {
                    label: (department.name ?? '') + '（11人）',
                    key: department.id ?? '',
                    icon: <i className="fi fi-ss-circle-small" />,
                    onClick: () => navigate(`/department/${department.id}/members`)
                  };
                })
              }
            />
          </div>
        </div>
        <div className="w-full">
          <div className="w-full px-8">
            <Divider />
            <Title level={4}>部门管理</Title>
          </div>
          <div className="w-full px-1">
            <Menu
              className="!bg-transparent !border-r-0"
              mode="inline"
              selectable={false}
              items={[
                {
                  label: '新增部门',
                  key: 'create-department'
                },
                {
                  label: '导出部门信息',
                  key: 'export-department'
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
