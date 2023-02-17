import React, { useEffect, useMemo, useRef, useState } from 'react';
import './index.less';
import { Affix, Button, Input, Steps, theme, Typography } from 'antd';
import { useModel, useNavigate, useParams } from '@@/exports';
import { useInViewport, useSize } from 'ahooks';
import classNames from 'classnames';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { departmentApi } from '@/services/api';
import { Department } from '@/services/api/modules/department/typings';
import { useSetDocTitle } from '@/utils/hooks';

const {Title, Text} = Typography;
const {TextArea} = Input;

const DepartmentDetailPage: React.FC = () => {
  const navigate = useNavigate();
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

  const {id: departmentId} = useParams();
  useEffect(() => {
    if (departmentId) {
      departmentApi.getDepartmentDetail(departmentId).then(res => {
        if (res.data) {
          setFormValue(res.data);
        }
      }).catch(e => {
        console.error(e);
        messageApi.error('获取部门详情失败');
      });
    }
  }, []);

  const containerRef = useRef(null);
  const containerSize = useSize(containerRef);

  const formRefList = [useRef(null), useRef(null)];
  const formInViewport = [
    useInViewport(formRefList[0], {threshold: 1}),
    useInViewport(formRefList[1], {threshold: 1})
  ];
  useEffect(() => {
    const index = formInViewport.findIndex(item => item[0]);
    if (index !== -1) {
      setCurrentFormIndex(index);
    }
  }, [formInViewport]);

  const [imgUploading, setImgUploading] = useState(false);
  const uploadButton = <div>{imgUploading ? <LoadingOutlined /> : <PlusOutlined />}</div>;

  const [formValue, setFormValue] = useState<Department>({});
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  useSetDocTitle(`部门详情${formValue.name ? ' - ' + formValue.name : ''}`)

  return (
    <div className="department-detail-page w-full h-full px-16 flex justify-center">
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
            <Title level={1}>{formValue.name ?? '部门详情'}</Title>
            <Steps
              className="!mt-12 h-full"
              current={currentFormIndex}
              size={containerSize?.width && containerSize.width < 800 ? 'small' : 'default'}
              direction="vertical"
              items={[
                {
                  title: '部门基本信息'
                },
                {
                  title: '部门人员信息'
                },
                {
                  title: '更多信息'
                }
              ]}
            />
          </div>
        </Affix>
        <div className="flex-grow ml-[3vw]">
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
              ref={formRefList[0]}
              className={
                classNames(
                  'w-2/5 min-w-[40%] p-10 pt-2',
                  {'!w-full': containerSize?.width && containerSize.width < 800}
                )
              }
              style={{background: colorFillTertiary}}
            >
              <Title level={2}>部门信息</Title>
              <span className="text-base">这里是部门的基本信息，包括部门名称、简介等信息。</span>
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
              {/*基本信息*/}
              <div className="w-full">
                <Text type="secondary" strong>部门名称</Text>
                <Input
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  size="large"
                  value={formValue.name}
                  placeholder="部门的名称"
                />
              </div>
              <div className="w-full mt-6">
                <Text type="secondary" strong>部门简介</Text>
                <TextArea
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  autoSize={{minRows: 2}}
                  size="large"
                  value={formValue.description}
                  placeholder="关于部门的介绍"
                />
              </div>
            </div>
          </div>
          {/*人员信息*/}
          <div
            ref={formRefList[1]}
            className={
              classNames(
                'w-full mt-10 flex rounded-lg overflow-hidden',
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
              <Title level={2}>人员信息</Title>
              <span className="text-base">这里是部门的人员信息。</span>
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
              <div className="w-full flex flex-col">
                <Text type="secondary" strong>负责人</Text>
                <Input
                  className="custom-input !mt-2"
                  style={{background: darkTheme ? colorFillSecondary : '#fff'}}
                  size="large"
                  // value={formValue.name}
                  placeholder="负责人名称"
                />
              </div>
              <div className="w-full mt-6 flex flex-col">
                <Text type="secondary" strong>负责人信息</Text>
                <Button
                  className="w-36 !h-12 !mt-2"
                  type="primary"
                  ghost
                  size="large"
                >
                  查看负责人
                </Button>
              </div>
              <div className="w-full mt-6 flex flex-col">
                <Text type="secondary" strong>部门成员</Text>
                <Button
                  className="w-36 !h-12 !mt-2"
                  type="primary"
                  size="large"
                >
                  成员信息
                </Button>
              </div>
            </div>
          </div>
          {/*按钮*/}
          <div className="w-full mt-12 flex">
            <Button
              className="ml-auto w-36 !h-14"
              type="primary"
              size="large"
            >
              更多信息
            </Button>
          </div>
          {/*底部*/}
          <div className="w-full h-48"></div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetailPage;
