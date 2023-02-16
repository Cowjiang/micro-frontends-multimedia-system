import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import classNames from 'classnames';
import { Affix, Button, Input, message, Select, Steps, theme, Typography } from 'antd';
import { useModel } from '@@/exports';
import { useSize } from 'ahooks';
import { MinusOutlined } from '@ant-design/icons';
import { departmentApi } from '@/services/api';
import { Department } from '@/services/api/modules/department/typings';

const {Title, Text} = Typography;

const ProjectMemberConfigPage: React.FC = () => {
  const {darkTheme} = useModel('theme');
  const {defaultAlgorithm, darkAlgorithm, defaultSeed} = theme;
  const {
    colorFillQuaternary,
    colorFillSecondary,
    colorFillTertiary
  } = useMemo(
    () => darkTheme ? darkAlgorithm(defaultSeed) : defaultAlgorithm(defaultSeed),
    [darkTheme]
  );
  const {messageApi} = useModel('messageApi');

  const containerRef = useRef(null);
  const containerSize = useSize(containerRef);

  const [configList, setConfigList] = useState([{department: '', count: 0}]);

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

  // 表单数据更新
  const onFormValueChange = (col: 'department' | 'count', index: number, value: any) => {
    const newConfigList = JSON.parse(JSON.stringify(configList));
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
            <Title level={1}>项目人员设置</Title>
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
              <Title level={2}>部门设置</Title>
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
                        options={departmentList.map(department => ({label: department.name, value: department.id}))}
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
                        disabled={index === 0}
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
