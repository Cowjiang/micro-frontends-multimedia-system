import { DateType } from '@/common/formats/typings';

/**
 * 格式化时间（日期为今天时省略日期只显示时间），精确到分钟
 * @param time 时间字符串
 */
export const formatTime = (time: string): string => {
  if (!time) return ''
  const messageDate = new Date(time)
  const nowDate = new Date()
  const messageTime = {
    year: messageDate.getFullYear(),
    month: messageDate.getMonth() + 1,
    day: messageDate.getDate(),
    hour: messageDate.getHours().toString().padStart(2, '0'),
    min: messageDate.getMinutes().toString().padStart(2, '0'),
    second: messageDate.getSeconds()
  }
  const nowTime = {
    year: nowDate.getFullYear(),
    month: nowDate.getMonth() + 1,
    day: nowDate.getDate()
  }
  if (messageTime.year === nowTime.year && messageTime.month === nowTime.month && messageTime.day === nowTime.day) {
    return `今天 ${messageTime.hour}:${messageTime.min}`
  } else if (messageTime.year === nowTime.year && messageTime.month === nowTime.month && nowTime.day - messageTime.day === 1) {
    return `昨天 ${messageTime.hour}:${messageTime.min}`
  } else if (messageTime.year === nowTime.year) {
    return `${messageTime.month}月${messageTime.day}日 ${messageTime.hour}:${messageTime.min}`
  } else {
    return `${messageTime.year}年${messageTime.month}月${messageTime.day}日 ${messageTime.hour}:${messageTime.min}`
  }
}

/**
 * 格式化多类型时间
 * @param time 时间戳或者时间对象
 * @param type 时间类型
 */
export const formatDateTime = ((time: string | Date, type: DateType): string => {
  if (!time) return ''
  const date = time instanceof Date ? time : new Date(time)
  const y = date.getFullYear()
  const m = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  switch (type) {
    case 'yy-mm-dd hh:mm:ss':
      return `${y}-${m}-${d} ${h}:${minute}:${second}`
    case 'yy-mm-dd type':
      return `${y}-${m}-${d} ${h === 13 ? '下午' : '上午'}`
    case 'yy-mm-dd hh:mm':
      return `${y}-${m}-${d} ${h}:${minute}`
    case 'yy/mm/dd hh:mm:ss':
      return `${y}/${m}/${d} ${h}:${minute}:${second}`
    case 'yy-mm-dd':
      return `${y}-${m}-${d}`
    case 'yy.mm.dd':
      return `${y}.${m}.${d}`
    case 'yy.mm.dd hh:mm:ss':
      return `${y}.${m}.${d} ${h}:${minute}:${second}`
    case 'mm-dd hh:mm':
      return `${m}-${d} ${h}:${minute}`
  }
})
