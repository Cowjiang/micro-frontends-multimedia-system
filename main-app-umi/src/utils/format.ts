import dayjs from 'dayjs';
import { PRIMARY_COLOR } from '@/constants';
import { DraftType } from '@/services/api/modules/draft/typings';

export function formatDate(date: string, format: string = 'YYYY年MM月DD日 HH:mm:ss'): string {
  if (date.length !== 10) {
    return dayjs(date).format(format) ?? '';
  }
  return dayjs.unix(Number(date)).format(format) ?? '';
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

export function formatFileType(mime?: string): { tag: string, color: string, value: string } {
  if (!mime) {
    return {tag: '未知', color: PRIMARY_COLOR, value: 'unknown'}
  }
  if (mime.includes('image')) {
    return {tag: '图片', color: '#4096ff', value: 'image'}
  } else if (mime.includes('audio') || mime.includes('video')) {
    return {tag: '音视频', color: '#e95295', value: 'media'}
  } else if (mime.includes('zip')) {
    return {tag: '压缩包', color: '#389e0d', value: 'zip'}
  }
  return {tag: '其他类型', color: PRIMARY_COLOR, value: 'unknown'};
}
