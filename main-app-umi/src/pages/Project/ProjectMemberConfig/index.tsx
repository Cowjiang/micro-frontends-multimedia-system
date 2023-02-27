import React, { useEffect, useRef, useState } from 'react';
import './index.less';
import classNames from 'classnames';
import { Affix, Button, Input, Select, Steps, theme, Typography } from 'antd';
import { useModel, useParams } from '@@/exports';
import { useSize } from 'ahooks';
import { MinusOutlined } from '@ant-design/icons';
import { departmentApi, projectApi } from '@/services/api';
import { Department } from '@/services/api/modules/department/typings';
import NProgress from 'nprogress';

const {Title, Text} = Typography;
const {useToken} = theme;

const ProjectMemberConfigPage: React.FC = () => {
  const {darkTheme} = useModel('theme');
  const {token} = useToken();
  const {colorFillQuaternary, colorFillSecondary, colorFillTertiary} = token;
  const {messageApi} = useModel('messageApi');
  const {id: projectId} = useParams();

  const containerRef = useRef(null);
  const containerSize = useSize(containerRef);

  const [configList, setConfigList] = useState<{
    id?: number,
    department: string | number,
    count: number
  }[]>([{
    department: '',
    count: 0
  }]);
  const [configListTemp, setConfigListTemp] = useState<typeof configList>([]);

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
    });
  }, []);

  useEffect(() => {
    projectId && projectApi.getProjectMemberConfig(Number(projectId)).then(res => {
      if (res.data?.length) {
        const initConfigList = res.data.map(config => ({
          id: config.id,
          department: config.departmentId ?? '',
          count: config.num ?? 0
        }));
        setConfigList(initConfigList);
        setConfigListTemp(initConfigList);
      }
    }).catch(e => {
      console.error(e);
      messageApi.error('获取人员配置失败');
    });
  }, [projectId]);

  // 表单数据更新
  const onFormValueChange = (col: 'department' | 'count', index: number, value: any) => {
    const newConfigList = [...configList];
    if (col === 'count' && value >= 0) {
      newConfigList[index].count = value;
      setConfigList(newConfigList);
    } else if (col === 'department') {
      newConfigList[index].department = value;
      setConfigList(newConfigList);
    }
  };

  // 移除部门
  const removeDepartment = (index: number) => {
    const newConfigList = JSON.parse(JSON.stringify(configList));
    newConfigList.splice(index, 1);
    setConfigList(newConfigList);
  };

  // 提交设置
  const onSubmitConfig = () => {
    const emptyIndex = configList.findIndex(config => !config.department);
    if (emptyIndex !== -1) {
      messageApi.warning('部门或人数填写有误');
      return;
    }
    let [addPromiseList, removePromiseList, updatePromiseList]: Promise<unknown>[][] = [[], [], []];
    if (configListTemp.length) {
      // 已有初始化设置
      // 删除的配置列表
      const removeConfigList = configListTemp.filter(t => {
        return configList.every(config => t.department !== config.department);
      });
      if (removeConfigList.length) {
        // 存在删除的
        removePromiseList = removeConfigList.map(config => new Promise((resolve, reject) => {
          projectApi.deleteProjectMemberConfig(Number(config.department)).then(res => resolve(res)).catch(e => reject(e));
        }));
      }
      // 修改的配置列表
      const updateConfigList = configListTemp.filter(t => {
        return configList.every(config => t.department === config.department && t.count !== config.count);
      });
      if (updateConfigList.length) {
        // 存在修改的
        updatePromiseList = updateConfigList.map(config => new Promise((resolve, reject) => {
          projectApi.updateProjectMemberConfig({
            id: config.id as number,
            departmentId: Number(config.department),
            num: config.count,
            projectId: Number(projectId)
          }).then(res => resolve(res)).catch(e => reject(e));
        }));
      }
    }
    // 添加的配置列表
    const addConfigList = configList.filter(config => !config.id);
    if (addConfigList.length) {
      // 存在添加的
      addPromiseList = addConfigList.map(config => new Promise((resolve, reject) => {
        projectApi.addProjectMemberConfig({
          departmentId: Number(config.department),
          num: config.count,
          projectId: Number(projectId)
        }).then(res => resolve(res)).catch(e => reject(e));
      }));
    }
    NProgress.start();
    Promise.all([...addPromiseList, ...removePromiseList, ...updatePromiseList]).then(res => {
      messageApi.success('保存成功');
    }).catch(e => {
      console.error(e);
      messageApi.error('保存人员配置失败');
    }).finally(() => {
      NProgress.done();
    });
  };

  return (
    <div className="project-member-config-page w-full h-full px-16 flex justify-center">
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
            <Title level={1} className="mt-6">项目人员设置</Title>
            <Steps
              className="!mt-12 h-full"
              current={2}
              size={containerSize?.width && containerSize.width < 800 ? 'small' : 'default'}
              direction="vertical"
              items={[
                {
                  title: '填写项目基本信息',
                  description: '第一步'
                },
                {
                  title: '填写详细信息',
                  description: '第二步'
                },
                {
                  title: '设置人员',
                  description: '第三步'
                }
              ]}
            />
          </div>
        </Affix>
        <div className="min-w-[350px] flex-grow ml-[3vw]">
          <div
            className={
              classNames(
                'w-full mt-20 flex rounded-lg overflow-hidden',
                {'flex-col': containerSize?.width && containerSize.width < 800}
              )
            }
          >
            {/*基本信息*/}
            <div
              className={
                classNames(
                  'w-2/5 min-w-[40%] p-10 pt-2',
                  {'!w-full': containerSize?.width && containerSize.width < 800}
                )
              }
              style={{background: colorFillTertiary}}
            >
              <Title level={2} className="mt-6">部门设置</Title>
              <span className="text-base">这里是项目的参与部门与参与人数设置，后续仍可修改。</span>
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
                  // 部门设置
                  <div
                    className={classNames('w-full flex', {'mt-4': index !== 0})}
                    key={index}
                  >
                    <div className="flex-grow">
                      <Text type="secondary" strong>选择部门</Text>
                      <Select
                        className="w-full !mt-2"
                        size="large"
                        options={
                          departmentList.map(department => ({
                            label: department.name,
                            value: department.id
                          }))
                        }
                        placeholder="请选择部门"
                        {...{value: config.department !== '' ? {value: config.department} : null}}
                        onChange={(v) => onFormValueChange('department', index, v)}
                      />
                    </div>
                    <div className="w-1/4 ml-4 flex-shrink-0">
                      <Text type="secondary" strong>参与人数</Text>
                      <Input
                        className="custom-input !mt-2"
                        style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                        size="large"
                        placeholder="参与人数"
                        type="number"
                        value={config.count === 0 ? '' : config.count}
                        onChange={(e) => onFormValueChange('count', index, e.target.value)}
                      />
                    </div>
                    <div className="ml-4 mt-6 flex flex-shrink-0 items-center">
                      <Button
                        type="primary"
                        shape="circle"
                        size="small"
                        icon={<MinusOutlined />}
                        disabled={configList.length === 1}
                        onClick={() => removeDepartment(index)}
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
                  onClick={() => setConfigList([...configList, {department: '', count: 0}])}
                >
                  添加部门
                </Button>
              </div>
            </div>
          </div>
          {/*提交按钮*/}
          <div className="w-full mt-12 flex">
            <Button
              className="ml-auto w-36 !h-14"
              type="primary"
              size="large"
              onClick={onSubmitConfig}
            >
              下一步
            </Button>
          </div>
          {/*底部*/}
          <div className="w-full h-48"></div>
        </div>
      </div>
    </div>
  );
};

export default ProjectMemberConfigPage;
