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
