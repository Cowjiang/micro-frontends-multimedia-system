import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useModel, useNavigate, useParams, useSearchParams } from '@@/exports';
import { Breadcrumb, Button, Dropdown, Input, Skeleton, Table, Tabs, Tag, theme, Typography } from 'antd';
import { useSetDocTitle } from '@/utils/hooks';
import { ColumnsType } from 'antd/es/table';
import Empty from '@/components/Empty';
import { PlusOutlined } from '@ant-design/icons';
import { ProjectVo } from '@/services/api/modules/project/typings';
import { draftApi, projectApi } from '@/services/api';
import { DraftType, ProjectContributionVo } from '@/services/api/modules/draft/typings';
import { formatDate, formatDraftType } from '@/utils/format';
import { DRAFT_RELEASE_CHANNEL } from '@/constants';

const {useToken} = theme;
const {Title, Text, Paragraph} = Typography;

const draftListTypes: { [key: string]: string } = {
  all: '全部',
  h5: 'H5',
  article: '图文',
  media: '音视频',
  others: '其它'
};

const DraftListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {id: projectId} = useParams();
  const {messageApi} = useModel('messageApi');

  const {token} = useToken();
  const {colorPrimary} = token;

  const [draftListType, setDraftListType] = useState(draftListTypes[searchParams.get('type') ?? '']);
  useEffect(() => {
    if (/\/project\/+[a-zA-Z0-9]+\/draft\/list/.test(location.pathname)) {
      setDraftListType(draftListTypes[searchParams.get('type') ?? '']);
      if (!draftListType) {
        setSearchParams({type: 'all'});
      }
    }
  }, [draftListType, searchParams]);

  // 表格加载状态
  const [tableLoading, setTableLoading] = useState(true);
  // 项目信息
  const [projectInfo, setProjectInfo] = useState<ProjectVo>();
  // 获取项目信息
  const getProjectInfo = async () => {
    if (projectId) {
      const {data: projectInfo} = await projectApi.getProjectDetail(Number(projectId));
      setProjectInfo(projectInfo ?? undefined);
    }
  };

  //稿件列表
  const [draftList, setDraftList] = useState<ProjectContributionVo[]>([]);
  // 获取稿件列表
  const getDraftList = async () => {
    if (projectId) {
      const {data: draftList} = await draftApi.getProjectDraftList(projectId);
      setDraftList((draftList ?? []).map(draft => ({key: draft.projectContribution.id, ...draft})));
    }
  };

  // 删除稿件
  const deleteDraftList = async (draftId?: number | string) => {
    if (draftId) {
      try {
        await draftApi.deleteDraft(draftId);
        messageApi.success('删除成功');
      } catch (e) {
        messageApi.error('删除失败');
      }
      await getDraftList();
    }
  };

  useEffect(() => {
    Promise.all([getProjectInfo(), getDraftList()]).then(() => {
      setTableLoading(false);
    });
  }, []);
  useSetDocTitle(`稿件 - ${projectInfo?.project.projectName}`);

  const columns: ColumnsType<ProjectContributionVo> = [
    {
      title: '编号',
      dataIndex: 'draftId',
      key: 'draftId',
      width: 60,
      ellipsis: true,
      render: (_, {projectContribution: {id}}) => (
        <Text type="secondary"># {id}</Text>
      )
    },
    {
      title: '缩略图',
      dataIndex: 'draftImg',
      key: 'draftImg',
      width: 120,
      render: (_, {projectContribution: {imgUrl}}) => (
        <Skeleton.Node active className="!w-[80px] !h-[80px]">
          <i className="fi fi-br-picture text-xl opacity-50"></i>
        </Skeleton.Node>
      )
    },
    {
      title: '类型',
      dataIndex: 'draftType',
      key: 'draftType',
      width: 100,
      render: (_, {projectContribution: {type}}) => (
        <Tag color={formatDraftType(type ?? '').color}>
          {formatDraftType(type ?? '').tag}
        </Tag>
      )
    },
    {
      title: '标题 / 发布渠道',
      dataIndex: 'draftName',
      key: 'draftName',
      width: '60%',
      render: (_, {projectContribution: {name, channels, id, type}}) => (
        <div className="flex flex-col">
          <Paragraph
            className="cursor-pointer"
            ellipsis={{rows: 2}}
            onClick={() => navigate(`/project/${projectId}/draft/detail/${formatDraftType(type ?? '').value}/${id}`)}
          >
            {name}
          </Paragraph>
          <div className="mt-auto flex flex-wrap">
            {
              JSON.parse(channels || '[]').map((channel: string) => {
                const defaultChannel = DRAFT_RELEASE_CHANNEL.find(c => c.value === channel);
                return (
                  <Tag
                    className="!mt-1"
                    color={defaultChannel?.color ?? colorPrimary}
                    key={channel}
                  >
                    {defaultChannel?.label ?? channel}
                  </Tag>
                );
              })
            }
          </div>
        </div>
      )
    },
    {
      title: '作者',
      dataIndex: 'username',
      key: 'username',
      width: '25%',
      ellipsis: true,
      render: (_, {creatorInfo: {username}}) => (
        <Text>{username}</Text>
      )
    },
    {
      title: '稿件状态',
      key: 'status',
      dataIndex: 'status',
      width: 120,
      ellipsis: true,
      render: (_, {projectContribution: {stat}}) => (
        <>
          {/*{status.map((tag) => {*/}
          {/*  let color = tag !== '已发送' ? 'geekblue' : 'green';*/}
          {/*  if (tag === '审核不通过') {*/}
          {/*    color = 'red';*/}
          {/*  }*/}
          {/*  return (*/}
          {/*    <Tag color={color} key={tag}>*/}
          {/*      {tag.toUpperCase()}*/}
          {/*    </Tag>*/}
          {/*  );*/}
          {/*})}*/}
        </>
      )
    },
    {
      title: '素材数',
      key: 'resourceCount',
      dataIndex: 'resourceCount',
      width: 100,
      ellipsis: true,
      render: (_, {projectContribution: {materialNum}}) => (
        <Text>{materialNum}</Text>
      )
    },
    {
      title: '更新时间',
      key: 'updatedTime',
      dataIndex: 'updatedTime',
      width: '25%',
      ellipsis: true,
      render: (_, {projectContribution: {updatedTime}}) => (
        <Text>{formatDate(updatedTime ?? '')}</Text>
      )
    },
    {
      title: <div className="!ml-2">操作</div>,
      key: 'action',
      width: 90,
      render: (_, {projectContribution: {id, type}}) => (
        <Dropdown
          menu={{
            items: [
              {
                label: '查看稿件',
                key: '1',
                onClick: () => navigate(`/project/${projectId}/draft/detail/${formatDraftType(type ?? '').value}/${id}`)
              },
              {
                label: '编辑稿件',
                key: '2',
                onClick: () => navigate(`/project/${projectId}/draft/edit/${formatDraftType(type ?? '').value}/${id}`)
              },
              {
                label: '操作记录',
                key: '3'
              },
              {
                label: '删除稿件',
                key: '4',
                danger: true,
                onClick: () => deleteDraftList(id)
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
  const onSelectChange = (newSelectedRowKeys: React.Key[], selectedRows: ProjectContributionVo[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const tableContext = useMemo(() => (
    (filter?: (draft: ProjectContributionVo[]) => ProjectContributionVo[]) => (
      <Table
        className="mt-4"
        columns={columns}
        dataSource={filter ? filter(draftList) : draftList}
        scroll={{x: 1200}}
        loading={{
          size: 'large',
          spinning: tableLoading
        }}
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
  ), [draftList, draftListType, tableLoading]);

  return (
    <div className="draft-list-page w-full h-full px-12 flex flex-col">
      <div>
        <Breadcrumb
          className="!mt-2"
          items={[
            {title: <a onClick={() => navigate(`/project/${projectId}/detail`)}>{projectInfo?.project.projectName}</a>},
            {title: '稿件列表'}
          ]}
        />
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
              children: tableContext()
            },
            {
              key: 'article',
              label: `图文`,
              children: tableContext(
                draftList => draftList.filter(draft => draft.projectContribution.type === DraftType.ARTICLE)
              )
            },
            {
              key: 'h5',
              label: `H5`,
              children: tableContext(
                draftList => draftList.filter(draft => draft.projectContribution.type === DraftType.HTML5)
              )
            },
            {
              key: 'media',
              label: `音视频`,
              children: tableContext(
                draftList => draftList.filter(draft => draft.projectContribution.type === DraftType.MEDIA)
              )
            },
            {
              key: 'others',
              label: `其它`,
              children: tableContext(() => [])
            }
          ]}
          tabBarExtraContent={{
            right: (
              <div className="flex">
                <Input.Search placeholder="搜索稿件..." enterButton />
                <Button
                  className="ml-4"
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate(`/project/${projectId}/draft/new`)}
                >
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
