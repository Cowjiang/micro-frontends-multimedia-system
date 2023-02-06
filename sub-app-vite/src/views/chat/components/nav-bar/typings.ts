import { ChatType } from '@/typings';

export interface NavItemList {
  // 导航项目的Url参数名
  name: string;
  // 导航项目的标题（用于tooltips）
  title: string;
  // 导航项目的图标css类名
  icon?: string;
  // 导航项目的图片背景，设置icon后该项不生效
  imgUrl?: string;
  // 若该项导航为置顶的会话
  chatType?: ChatType;
}
