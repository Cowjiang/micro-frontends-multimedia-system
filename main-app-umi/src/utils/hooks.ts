import { useEffect, useState } from 'react';

/**
 * 设置网页标题
 * @param title
 */
export const useSetDocTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

/**
 * 判断当前设备屏幕是否收缩至指定宽度，用于响应式处理。
 * @param maxWidth 默认为 768px
 * @returns
 */
export const useIsMobile = (maxWidth = 768) => {
  const [deviceType, setDeviceType] = useState<'web' | 'mobile'>(
    window.innerWidth > maxWidth ? 'web' : 'mobile',
  );

  useEffect(() => {
    const judgeDevice = (e: UIEvent) => {
      const { innerWidth } = e.target as Window;
      if (innerWidth < maxWidth) {
        setDeviceType('mobile');
      } else {
        setDeviceType('web');
      }
    };
    window.addEventListener('resize', judgeDevice);
    return () => window.removeEventListener('resize', judgeDevice);
  }, [setDeviceType]);

  return deviceType;
};
