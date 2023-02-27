import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import classNames from 'classnames';
import { Affix, Button, Input, Select, Steps, theme, Typography } from 'antd';
import { useModel, useParams } from '@@/exports';
import { useSize } from 'ahooks';
import { MinusOutlined } from '@ant-design/icons';
import { departmentApi } from '@/services/api';
import { UserPermission, UserRole } from '@/services/api/modules/department/typings';

const {Title, Text} = Typography;
const {useToken} = theme;

const DepartmentRolesConfigPage: React.FC = () => {
  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorFillQuaternary, colorFillSecondary, colorFillTertiary} = token;
  const {messageApi} = useModel('messageApi');
  const {id: departmentId} = useParams();

  const containerRef = useRef(null);
  const containerSize = useSize(containerRef);

  const [configList, setConfigList] = useState<{
    id?: number,
    role: UserRole,
    permission: UserPermission[]
  }[]>([{
    role: {},
    permission: []
  }]);
  const [configListTemp, setConfigListTemp] = useState<typeof configList>([]);

  // 权限列表
  const [permissionList, setPermissionList] = useState<UserPermission[]>([]);
  // 获取权限列表
  const getPermissionList = () => {
    if (departmentId) {
      departmentApi.getDepartmentPermissions(departmentId).then(res => {
        setPermissionList(res.data ?? []);
      }).catch(err => {
        messageApi.error('获取权限列表失败');
      });
    }
  };

  // 角色列表
  const [roleList, setRoleList] = useState<UserRole[]>([]);
  // 获取角色列表
  const getRoleList = () => {
    if (departmentId) {
      departmentApi.getDepartmentUserRoles(departmentId).then(res => {
        setRoleList(res.data ?? []);
      }).catch(err => {
        messageApi.error('获取部门角色失败');
      });
    }
  };

  useEffect(() => {
    getPermissionList();
    getRoleList();
  }, [departmentId]);

  // 表单数据更新
  const onFormValueChange = (col: 'role' | 'permission', index: number, value: any) => {
    const newConfigList = [...configList];
    if (col === 'role' && value) {
      newConfigList[index].role = {
        departmentId: Number(departmentId),
        roleName: value
      };
      setConfigList(newConfigList);
    } else if (col === 'permission') {
      newConfigList[index].permission = value.map((v: any) => ({
        id: v.value,
        permissionName: v.label
      }));
      setConfigList(newConfigList);
    }
  };

  // 移除角色
  const removeRole = (index: number) => {
    const newConfigList = [...configList];
    newConfigList.splice(index, 1);
    setConfigList(newConfigList);
  };

  return (
    <div className="department-role-config-page w-full h-full px-16 flex justify-center">
      <div className="min-w-[500px] w-full max-w-[1200px] flex" ref={containerRef}>
        <Affix offsetTop={30} target={() => document.querySelector('.ant-tabs-content') as HTMLElement | null}>
          <div
            className={
              classNames(
                'min-w-[250px] h-[250px] mt-16',
                {'min-w-[200px]': containerSize?.width && containerSize.width < 800}
              )
            }
          >
            <Title level={1} className="mt-6">角色设置</Title>
            <Steps
              className="!mt-12 h-full"
              current={1}
              size={containerSize?.width && containerSize.width < 800 ? 'small' : 'default'}
              direction="vertical"
              items={[
                {
                  title: '填写部门信息',
                  description: '第一步'
                },
                {
                  title: '角色设置',
                  description: '第二步'
                }
              ]}
            />
          </div>
        </Affix>
        <div className="min-w-[400px] flex-grow ml-[2vw]">
          <div
            className={
              classNames(
                'w-full mt-20 flex rounded-lg overflow-hidden',
                {'flex-col': containerSize?.width && containerSize.width < 800}
              )
            }
          >
            <div
              className={
                classNames(
                  'w-2/5 min-w-[40%] p-10 pt-2',
                  {'!w-full': containerSize?.width && containerSize.width < 800}
                )
              }
              style={{background: colorFillTertiary}}
            >
              <Title level={2} className="mt-6">部门角色设置</Title>
              <span className="text-base">这里是部门的角色设置，可以自由组合用户权限。</span>
            </div>
            <div
              className={
                classNames(
                  'w-3/5 min-h-[300px] p-12 flex flex-col',
                  {'!w-full !p-10': containerSize?.width && containerSize.width < 800}
                )
              }
              style={{background: colorFillQuaternary}}
            >
              {
                configList.map((config, index) => (
                  <div
                    className={classNames('w-full flex', {'mt-4': index !== 0})}
                    key={index}
                  >
                    <div className="flex-grow">
                      <Text type="secondary" strong>角色名称</Text>
                      <Input
                        className="custom-input !mt-2"
                        style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                        size="large"
                        placeholder="角色名称"
                        value={config.role.roleName}
                        onChange={(e) => onFormValueChange('role', index, e.target.value)}
                      />
                    </div>
                    <div className="w-2/5 ml-4 flex-shrink-0">
                      <Text type="secondary" strong>选择权限</Text>
                      <Select
                        className="w-full !mt-2"
                        mode="multiple"
                        size="large"
                        options={
                          permissionList.map(permission => ({
                            label: permission.permissionName,
                            value: permission.id
                          }))
                        }
                        placeholder="请选择权限"
                        value={config.permission.map(permission => (permission.id))}
                        onChange={(v, option) => onFormValueChange('permission', index, option)}
                      />
                    </div>
                    <div className="ml-4 mt-6 flex flex-shrink-0 items-center">
                      <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        icon={<MinusOutlined />}
                        disabled={configList.length === 1}
                        onClick={() => removeRole(index)}
                      />
                    </div>
                  </div>
                ))
              }
              <div className="w-full mt-12 flex">
                <Button
                  type="primary"
                  ghost
                  size="large"
                  onClick={() => setConfigList([...configList, {role: {}, permission: []}])}
                >
                  添加角色
                </Button>
              </div>
            </div>
          </div>
          <div className="w-full mt-12 flex">
            <Button
              className="ml-auto w-36 !h-14"
              type="primary"
              size="large"
              // onClick={onSubmitConfig}
            >
              保存
            </Button>
          </div>
          {/*底部*/}
          <div className="w-full h-48"></div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentRolesConfigPage;
