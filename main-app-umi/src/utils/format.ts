import dayjs from 'dayjs';

export function formatDate(date: string, format: string = 'YYYY年MM月DD日 HH:mm:ss'): string {
  return dayjs(date).format(format) ?? '';
}
