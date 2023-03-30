import React from 'react';
import { OperationHistoryProps } from '@/components/OperationHistory/typings';
import { Avatar, Col, Row, Timeline, Typography } from 'antd';
import { formatDate } from '@/utils/format';

const {Text, Title} = Typography;

const OperationHistory: React.FC<OperationHistoryProps> = (props) => {
  const {operationHistory, ...timelineProps} = props;
  return (
    <Timeline
      className="w-full"
      mode="left"
      pending
      items={
        operationHistory.map(operation => ({
          label: <Text type="secondary">{formatDate(String(operation.createdTime) ?? '')}</Text>,
          children: (
            <Row gutter={12}>
              <Col flex="0 0"><Avatar size="small" src={operation.userProfile?.avgPath} /></Col>
              <Col flex="0 0 10vw">
                <Row><Title className="!m-0" level={5}>{operation.userProfile?.username ?? ''}</Title></Row>
                <Row><Text>{operation.comment}</Text></Row>
              </Col>
            </Row>
          )
        }))
      }
      {...timelineProps}
    />
  );
};

export default OperationHistory;
