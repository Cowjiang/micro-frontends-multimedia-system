import dayjs from 'dayjs';
import { PRIMARY_COLOR, TAG_COLOR_LIST } from '@/constants';
import { DraftType } from '@/services/api/modules/draft/typings';
import { Project } from '@/services/api/modules/project/typings';

// 格式化日期
export function formatDate(date: number | string, format: string = 'YYYY年MM月DD日 HH:mm:ss'): string {
  if (date === 'Invalid Date') return '一个无人知晓的次元时间';
  if (typeof date === 'number' || date.length !== 10) return dayjs(date).format(format) ?? '';
  return dayjs.unix(Number(date)).format(format) ?? '';
}

// 格式化稿件类型
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

// 格式化文件类型
export function formatFileType(mime?: string): { tag: string, color: string, value: string } {
  if (!mime) {
    return {tag: '未知', color: PRIMARY_COLOR, value: 'unknown'};
  }
  if (mime.includes('image')) {
    return {tag: '图片', color: '#4096ff', value: 'image'};
  } else if (mime.includes('audio') || mime.includes('video')) {
    return {tag: '音视频', color: '#e95295', value: 'media'};
  } else if (mime.includes('zip')) {
    return {tag: '压缩包', color: '#389e0d', value: 'zip'};
  }
  return {tag: '其他类型', color: PRIMARY_COLOR, value: 'unknown'};
}

// 格式化项目状态
export function formatProjectStatus(project?: Project): { tag: string, color: string, value: string } {
  const random = Math.floor(Math.random() * TAG_COLOR_LIST.length);
  if (project?.stat) {
    return {tag: project.stat, color: TAG_COLOR_LIST[random], value: project.stat};
  } else if (project?.startTime && project?.endTime) {
    const now = Date.now();
    if (now >= project.startTime && now <= project.endTime) {
      return {tag: '正在进行', color: TAG_COLOR_LIST[4], value: 'normal'};
    } else if (now > project.endTime) {
      return {tag: '已结束', color: TAG_COLOR_LIST[1], value: 'expired'};
    } else {
      return {tag: '未开始', color: TAG_COLOR_LIST[2], value: 'not started'};
    }
  } else {
    return {tag: '未知', color: PRIMARY_COLOR, value: 'unknown'};
  }
}
