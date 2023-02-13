import React from 'react';
import { SideMenuPanelProps } from '@/components/SideMenuPanel/typings';
import { useModel } from '@@/exports';

const SideMenuPanel: React.FC<SideMenuPanelProps> = (props) => {
  const {darkTheme} = useModel('theme');

  return (
    <div
      className="h-full flex-shrink-0"
      style={{
        width: props.width ?? '300px',
        background: darkTheme ? '#212121' : '#edeef0'
      }}
    >
      {props.children}
    </div>
  );
};

export default SideMenuPanel;
