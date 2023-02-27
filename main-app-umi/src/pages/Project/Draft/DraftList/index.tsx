import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, useSearchParams } from '@@/exports';
import { Breadcrumb, Button, Dropdown, Input, Skeleton, Table, Tabs, Tag, theme, Typography } from 'antd';
import { useSetDocTitle } from '@/utils/hooks';
import { ColumnsType } from 'antd/es/table';
import Empty from '@/components/Empty';
import { PlusOutlined } from '@ant-design/icons';

const {useToken} = theme;
const {Title, Text, Paragraph} = Typography;

const draftListTypes: { [key: string]: string } = {
  all: '全部',
  h5: 'H5',
  article: '图文',
  media: '音视频',
  others: '其它'
};

interface ProjectListDataType {
  id: number;
  draftName: string;
  username: string;
  status: string[];
}

const DraftListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {id: projectId} = useParams();

  const {token} = useToken();
  const {colorPrimaryText} = token;

  const [draftListType, setDraftListType] = useState(
    draftListTypes[searchParams.get('type') ?? '']
  );
  useEffect(() => {
    if (/\/project\/+[a-zA-Z0-9]+\/draft\/list/.test(location.pathname)) {
      setDraftListType(draftListTypes[searchParams.get('type') ?? '']);
      if (!draftListType) {
        setSearchParams({type: 'all'});
      }
    }
  }, [draftListType, searchParams]);
  const projectInfo = {
    projectName: '大美中国科技之美'
  };
  useSetDocTitle(`稿件 - ${projectInfo.projectName}`);

  const columns: ColumnsType<ProjectListDataType> = [
    {
      title: '编号',
      dataIndex: 'draftId',
      key: 'draftId',
      width: 60,
      ellipsis: true
    },
    {
      title: '缩略图',
      dataIndex: 'draftImg',
      key: 'draftImg',
      width: 120,
      render: () => (
        <Skeleton.Node active className="!w-[80px] !h-[80px]">
          <i className="fi fi-br-picture text-xl opacity-50"></i>
        </Skeleton.Node>
      )
    },
    {
      title: '类型',
      dataIndex: 'draftType',
      key: 'draftType',
      width: 70,
      render: () => (
        <Tag color="#93ce47">
          H5
        </Tag>
      )
    },
    {
      title: '标题 / 发布渠道',
      dataIndex: 'draftName',
      key: 'draftName',
      width: '60%',
      render: (_, {draftName, id}) => (
        <div className="flex flex-col">
          <Paragraph ellipsis={{rows: 2}}>{draftName}</Paragraph>
          <div className="mt-auto flex flex-wrap">
            <Tag className="!mt-1" color="purple">客户端</Tag>
            <Tag className="!mt-1" color="green">微信</Tag>
            <Tag className="!mt-1" color="red">新浪</Tag>
            <Tag className="!mt-1" color="cyan">百家号</Tag>
          </div>
        </div>
      )
    },
    {
      title: '作者',
      dataIndex: 'username',
      key: 'username',
      width: '25%',
      ellipsis: true
    },
    {
      title: '稿件状态',
      key: 'status',
      dataIndex: 'status',
      width: 120,
      ellipsis: true,
      render: (_, {status}) => (
        <>
          {status.map((tag) => {
            let color = tag !== '已发送' ? 'geekblue' : 'green';
            if (tag === '审核不通过') {
              color = 'red';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      )
    },
    {
      title: '素材数',
      key: 'resourceCount',
      dataIndex: 'resourceCount',
      width: 100,
      ellipsis: true
    },
    {
      title: '更新时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      width: '25%',
      ellipsis: true
    },
    {
      title: <div className="!ml-2">操作</div>,
      key: 'action',
      width: 90,
      render: () => (
        <Dropdown
          menu={{
            items: [
              {
                label: '查看稿件',
                key: '1'
              },
              {
                label: '编辑稿件',
                key: '2'
              },
              {
                label: '操作记录',
                key: '3'
              },
              {
                label: '删除稿件',
                key: '4',
                danger: true
              }
            ]
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button type="text">
            <i className="fi fi-bs-menu-dots" />
          </Button>
        </Dropdown>
      )
    }
  ];

  const data: ProjectListDataType[] = [
    {
      id: 0,
      draftName: '大美湾区科技之美大美湾区科技之美大美湾区科技之美大美湾区科技之美',
      username: '破壁机',
      status: ['已发送']
    },
    {
      id: 1,
      draftName: '大美湾区科技之美',
      username: '破壁机',
      status: ['审核不通过']
    },
    {
      id: 2,
      draftName: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    },
    {
      id: 3,
      draftName: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    },
    {
      id: 4,
      draftName: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    },
    {
      id: 5,
      draftName: '大美湾区科技之美',
      username: '破壁机',
      status: ['已结束']
    }
  ];

  const handleTabsChange = (newTabKey: string) => {
    setSearchParams({type: newTabKey});
  };

  // 编辑状态
  const [editStatus, setEditStatus] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  // 切换编辑状态
  const changeEditStatus = () => {
    setEditStatus(!editStatus);
    setSelectedRowKeys([]);
  };
  // 表格行多选更改事件
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: ProjectListDataType[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  return (
    <div className="draft-list-page w-full h-full px-12 flex flex-col">
      <div>
        <Breadcrumb className="!mt-2">
          <Breadcrumb.Item>
            <a onClick={() => navigate(`/project/${projectId}/detail`)}>
              {projectInfo.projectName}
            </a>
          </Breadcrumb.Item>
          <Breadcrumb.Item>稿件列表</Breadcrumb.Item>
        </Breadcrumb>
        <Title level={3} className="mt-6">稿件列表</Title>
      </div>
      <div>
        <Tabs
          className="!h-auto"
          defaultActiveKey={searchParams.get('type') ?? 'all'}
          size="large"
          items={[
            {
              key: 'all',
              label: `全部稿件`,
              children: (
                <Table
                  className="mt-4"
                  columns={columns}
                  dataSource={data}
                  scroll={{x: 1200}}
                  locale={{
                    emptyText: () => (
                      <div className="w-full my-48">
                        <Empty />
                      </div>
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
                />
              )
            },
            {
              key: 'article',
              label: `图文`
            },
            {
              key: 'h5',
              label: `H5`
            },
            {
              key: 'media',
              label: `音视频`
            },
            {
              key: 'others',
              label: `其它`
            }
          ]}
          tabBarExtraContent={{
            right: (
              <div className="flex">
                <Input.Search placeholder="搜索稿件..." enterButton />
                <Button className="ml-4" type="primary" icon={<PlusOutlined />}>
                  新建稿件
                </Button>
                <Button className="ml-4" type="primary" ghost onClick={changeEditStatus}>
                  {editStatus ? '取消' : '编辑'}
                </Button>
                {
                  editStatus && (
                    <Button className="ml-4" type="primary" danger onClick={changeEditStatus}>
                      保存更改
                    </Button>
                  )
                }
              </div>
            )
          }}
          onChange={handleTabsChange}
        />
      </div>
    </div>
  );
};

export default DraftListPage;
