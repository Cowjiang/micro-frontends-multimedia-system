import React, { useRef, useState } from 'react';
import { Button, Modal, Typography } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { DraftReviewProps } from '@/pages/Project/Draft/DraftReview/typings';
import { ContributionCheckVo } from '@/services/api/modules/draft/typings';
import { draftApi } from '@/services/api';
import Empty from '@/components/Empty';
import { formatDate } from '@/utils/format';
import { UserModelState } from '@/models/user';
import { useSelector } from '@@/exports';

const {Text, Paragraph} = Typography;

const DraftReview: React.FC<DraftReviewProps> = (props) => {
  const {draftId, isDialog, disabled, ...antdModalProps} = props;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly ContributionCheckVo[]>([]);
  const {userInfo}: UserModelState = useSelector((state: any) => state.user);

  const columns: ProColumns<ContributionCheckVo>[] = [
    {
      title: '审批时间',
      dataIndex: ['contributionCheck', 'createdTime'],
      width: 200,
      editable: false,
      render: (_, {contributionCheck}) => {
        return <Text>{formatDate(contributionCheck?.createdTime ?? '')}</Text>;
      }
    },
    {
      title: '审批操作',
      dataIndex: ['contributionCheck', 'result'],
      width: 120,
      valueEnum: {
        0: {text: '审批中', status: 'Processing'},
        1: {text: '已通过', status: 'Success'},
        2: {text: '不通过', status: 'Error'}
      },
      valueType: 'select'
    },
    {
      title: '审批人',
      editable: false,
      dataIndex: ['userProfile', 'username'],
      width: 120
    },
    {
      title: '审批意见',
      dataIndex: ['contributionCheck', 'content'],
      valueType: 'textarea',
      render: (_, {contributionCheck}) => (
        <Paragraph className="!m-0" ellipsis={{rows: 3, tooltip: true}}>
          {contributionCheck?.content ?? '无'}
        </Paragraph>
      )
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      hideInTable: disabled,
      render: (text, {contributionCheck}, _, action) => {
        return <a onClick={() => action?.startEditable?.(contributionCheck?.id ?? 0)}>编辑</a>;
      }
    }
  ];

  const tableRef = useRef<ActionType>();
  const reviewTable = (
    <EditableProTable<ContributionCheckVo>
      cardProps={false}
      actionRef={tableRef}
      columns={columns}
      params={{draftId}}
      request={async (params) => {
        const {data, success} = await draftApi.getDraftReviewList(params.draftId);
        return {
          data: data || [],
          success
        };
      }}
      recordCreatorProps={false}
      editable={{
        type: 'multiple',
        editableKeys,
        onSave: async (id, {contributionCheck}) => {
          const isUpdate = dataSource.find(data => data.contributionCheck?.id === id);
          contributionCheck && isUpdate && await draftApi.updateDraftReview(contributionCheck);
          contributionCheck && !isUpdate && await draftApi.addDraftReview({
            contributionId: draftId as number,
            content: contributionCheck.content,
            result: contributionCheck.result
          });
          tableRef.current?.reload();
        },
        onDelete: async (id, {contributionCheck}) => {
          contributionCheck?.id && await draftApi.deleteDraftReview(contributionCheck.id);
          tableRef.current?.reload();
        },
        onChange: setEditableRowKeys
      }}
      rowKey={(record) => record?.contributionCheck?.id ?? Date.now()}
      pagination={{
        showQuickJumper: true
      }}
      search={false}
      value={dataSource}
      onChange={setDataSource}
      toolBarRender={() => disabled ? [] : [
        <Button
          type="primary"
          key="primary"
          onClick={() => tableRef.current?.addEditRecord?.({
            contributionCheck: {
              id: (Math.random() * 1000000).toFixed(0),
              createdTime: Date.now(),
              contributionId: draftId,
              result: undefined,
              userId: userInfo.userId,
              content: ''
            },
            userProfile: userInfo
          })}
        >
          添加审核
        </Button>
      ]}
      size="large"
      scroll={{x: 800, y: '45vh'}}
      locale={{
        emptyText: <div className="h-[300px] flex justify-center items-center"><Empty /></div>
      }}
    />
  );

  return (
    isDialog ? (
      <Modal
        centered
        footer={null}
        destroyOnClose
        width="55vw"
        title="审批记录"
        {...antdModalProps}
      >
        {reviewTable}
      </Modal>
    ) : reviewTable
  );
};

export default DraftReview;
