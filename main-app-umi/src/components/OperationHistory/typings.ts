import { OperationHistoryVo } from '@/services/typings';
import type { TimelineProps } from 'antd';

export interface OperationHistoryProps extends TimelineProps {
  operationHistory: OperationHistoryVo[];
}
