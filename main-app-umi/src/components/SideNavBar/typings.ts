export interface SideNavBarProps {
  secondaryColor?: string;
  /**
   * 导航栏项更改事件
   * @param index 更改的序号
   * @param setIndex 设置导航栏项的序号
   */
  onChange?: (e: NavItem, setIndex: (index: number) => void) => void;
}

export interface NavItem {
  index: number;
  value: NavItemConfig;
}

export interface NavItemConfig {
  name: string;
  title: string;
  icon?: string;
  bottom?: boolean;
  imgUrl?: string;
}
