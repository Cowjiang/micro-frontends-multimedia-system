import dayjs from 'dayjs';
import { PRIMARY_COLOR } from '@/constants';
import { DraftType } from '@/services/api/modules/draft/typings';

export function formatDate(date: string, format: string = 'YYYY年MM月DD日 HH:mm:ss'): string {
  return dayjs(date).format(format) ?? '';
}

export function formatDraftType(type: DraftType | string): { tag: string, color: string, value: string } {
  switch (type) {
    case DraftType.HTML5:
      return {tag: 'H5', color: '#389e0d', value: 'h5'};
    case DraftType.ARTICLE:
      return {tag: '图文', color: '#4096ff', value: 'article'};
    case DraftType.MEDIA:
      return {tag: '音视频', color: '#e95295', value: 'media'};
    default:
      return {tag: type, color: PRIMARY_COLOR, value: 'others'};
  }
}
