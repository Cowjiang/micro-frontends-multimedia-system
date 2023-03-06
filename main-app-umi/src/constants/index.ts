import { DraftType } from '@/services/api/modules/draft/typings';

/**
 * 全局主要颜色
 */
export const PRIMARY_COLOR = '#ff8f00';

/**
 * 标签颜色列表
 */
export const TAG_COLOR_LIST = [
  '#ff8f00',
  '#f50',
  '#108ee9',
  '#c3d94e',
  '#4c8045',
  '#a6559d'
];

/**
 * 稿件发布渠道
 */
export const DRAFT_RELEASE_CHANNEL = [
  {
    label: '客户端',
    value: 'app',
    color: 'orange'
  },
  {
    label: '微信',
    value: 'wechat',
    color: 'green'
  },
  {
    label: '新浪',
    value: 'sina',
    color: 'red'
  },
  {
    label: '今日头条',
    value: 'toutiao',
    color: 'blue'
  },
  {
    label: '百家号',
    value: 'baijiahao',
    color: 'purple'
  }
];

export const DRAFT_TYPE_LABEL: { [key: string]: { label: string; type: DraftType } } = {
  'article': {label: '图文', type: DraftType.ARTICLE},
  'h5': {label: 'H5', type: DraftType.HTML5},
  'media': {label: '音视频', type: DraftType.MEDIA}
};
