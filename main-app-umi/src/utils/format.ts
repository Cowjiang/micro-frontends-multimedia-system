import dayjs from 'dayjs';
import { PRIMARY_COLOR } from '@/constants';

export function formatDate(date: string, format: string = 'YYYY年MM月DD日 HH:mm:ss'): string {
  return dayjs(date).format(format) ?? '';
}

export function formatDraftType(type: string): { tag: string, color: string } {
  switch (type) {
    case 'HTML5':
      return {tag: 'H5', color: '#389e0d'};
    case 'ARTICLE':
      return {tag: '图文', color: '#4096ff'};
    case 'MEDIA':
      return {tag: '音视频', color: '#e95295'};
    default:
      return {tag: type, color: PRIMARY_COLOR};
  }
}
