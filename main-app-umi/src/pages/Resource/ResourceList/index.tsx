import React, { useRef, useState } from 'react';
import './index.less';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProDescriptionsItemProps,
  ProTable
} from '@ant-design/pro-components';
import { Breadcrumb, Button, Divider, Dropdown, Tag, theme, Typography } from 'antd';
import { FileInfo, GetResourceFilesParams } from '@/services/api/modules/resource/typings';
import { formatDate, formatFileType } from '@/utils/format';
import { resourceApi } from '@/services/api';
import { TargetTypeName } from '@/services/api/modules/auth/typings';
import { useNavigate, useParams } from '@@/exports';
import { setClipboard } from '@/utils';

const {useToken} = theme;
const {Title, Text} = Typography;

const ResourceListPage = () => {
  const navigate = useNavigate();
  const {targetType, prefix} = useParams();

  const {token} = useToken();
  const {colorPrimary, colorTextBase} = token;

  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<FileInfo[]>([]);

  const initParams: GetResourceFilesParams = {
    targetTypeName: 'mfms-material',
    preKey: 'project'
  };
  const [searchParams, setSearchParams] = useState<GetResourceFilesParams>(initParams);

  const columns: ProColumns<FileInfo>[] = [
    {
      title: '文件类型',
      dataIndex: 'mimeType',
      valueType: 'text',
      valueEnum: {
        0: {text: '所有类型', status: 'all'},
        1: {text: '图片', status: 'image'},
        2: {text: '音视频', status: 'media'},
        3: {text: '文档', status: 'document'},
        4: {text: '压缩包', status: 'zip'},
        5: {text: '其它类型', status: 'others'}
      },
      initialValue: '所有类型',
      width: 120,
      render: (_, {mimeType}) => {
        const {color, tag, value} = formatFileType(mimeType);
        return <Tag color={color}>{tag}</Tag>;
      }
    },
    {
      title: '文件名称',
      dataIndex: 'key',
      valueType: 'text',
      width: 200,
      render: (_, {key}) => {
        const linkArr = key?.replaceAll(`${targetType}/` ?? '/', '')?.split('/') ?? [];
        return <Text>{linkArr.length > 0 ? linkArr[linkArr.length - 1] : ''}</Text>;
      }
    },
    {
      title: '文件路径',
      dataIndex: 'key',
      valueType: 'text',
      search: false,
      width: 250,
      render: (_, {key}) => {
        const linkArr = key?.replaceAll(`${targetType}/` ?? '/', '')?.split('/') ?? [];
        return linkArr.map((path, i) => (
          i !== linkArr.length - 1
            ? (
              <Text
                onClick={() => {
                  setSearchParams({
                    ...searchParams,
                    preKey: linkArr.splice(0, i + 1).join('/').replaceAll(`${targetType}/` ?? '/', '')
                  });
                }}
              >
                <a style={{color: colorPrimary}}>
                  /{path}
                </a>
              </Text>
            )
            : <></>
        ));
      }
    },
    {
      title: '文件大小',
      dataIndex: 'fsize',
      valueType: 'text',
      search: false,
      width: 120,
      render: (_, {fsize}) => (
        <Text>{((fsize ?? 0) / 1000000).toFixed(2)} MB</Text>
      )
    },
    {
      title: 'MD5',
      dataIndex: 'md5',
      valueType: 'text',
      search: false,
      width: 280
    },
    {
      title: '最近更新',
      dataIndex: 'putTime',
      valueType: 'text',
      search: false,
      width: 200,
      render: (_, {putTime}) => formatDate(String(putTime).slice(0, 10) ?? '') ?? ''
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      search: false,
      fixed: 'right',
      width: 60,
      render: (_, {key}) => (
        <Dropdown
          menu={{
            items: [
              {
                label: '预览素材',
                key: '1',
                onClick: () => window.open(`${process.env.OSS_BASE_URL}${key}`)
              },
              {
                label: '下载素材',
                key: '2',
                onClick: () => window.open(`${process.env.OSS_BASE_URL}${key}`)
              },
              {
                label: '复制链接',
                key: '3',
                onClick: () => setClipboard(`${process.env.OSS_BASE_URL}${key}`)
              },
              {
                label: '删除素材',
                key: '4',
                danger: true
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
    <div className="resource-list-page w-full h-full px-12 flex flex-col">
      <div>
        <Breadcrumb
          className="!mt-2"
          items={[
            {title: <a onClick={() => navigate(`/resource`)}>资源库</a>},
            {title: '项目素材'}
          ]}
        />
      </div>
      <div className="w-full flex items-center">
        <div>
          <Title level={3} className="mt-6">项目素材</Title>
        </div>
      </div>
      <Divider />
      <ProTable<FileInfo>
        actionRef={actionRef}
        tableClassName="!px-0"
        rowKey="key"
        columns={columns}
        params={searchParams}
        request={async (params, sorter, filter) => {
          const {data, success} = await resourceApi.getResourceFiles(searchParams);
          return {
            data: data || [],
            success
          };
        }}
        search={{
          labelWidth: 'auto',
          className: '!p-0 !mb-0',
          span: {
            xs: 8,
            sm: 8,
            md: 8,
            lg: 8,
            xl: 6,
            xxl: 6
          }
        }}
        toolbar={{
          title: <>
            <Breadcrumb
              className="!mt-2"
              items={[
                {title: targetType ?? '根目录'},
                ...searchParams.preKey.split('/').map((key, i) => ({
                  title: (
                    <a
                      onClick={() => {
                        setSearchParams({
                          ...searchParams,
                          preKey: searchParams.preKey
                            .split('/')
                            .splice(0, i + 1)
                            .join('/')
                            .replaceAll(`${targetType}/` ?? '/', '')
                        });
                      }}
                    >
                      {key}
                    </a>
                  )
                }))
              ]}
            />
          </>
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            上传素材
          </Button>
        ]}
        scroll={{x: 1500}}
        size="large"
        onReset={() => setSearchParams(initParams)}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows)
        }}
      />
    </div>
  );
};

export default ResourceListPage;
