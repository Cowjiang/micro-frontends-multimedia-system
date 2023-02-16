import React, { useEffect, useState } from 'react';
import { SideMenuPanelProps } from '@/components/SideMenuPanel/typings';
import { useModel } from '@@/exports';
import classNames from 'classnames';

const SideMenuPanel: React.FC<SideMenuPanelProps> = (props) => {
  const {darkTheme} = useModel('theme');
  const [opacity, setOpacity] = useState(1);
  const [displayNone, setDisplayNone] = useState(props.hide);

  useEffect(() => {
    setOpacity(props.hide ? 0 : 100);
    setTimeout(() => {
      setDisplayNone(props.hide);
    }, 100);
  }, [props.hide]);

  return (
    <div
      className={
        classNames(
          'h-full flex-shrink-0 transition-all duration-200',
          {'hidden': displayNone}
        )
      }
      style={{
        width: props.width ?? '300px',
        background: darkTheme ? '#212121' : '#f6f6f6',
        opacity
      }}
    >
      <div>
        {props.children}
      </div>
    </div>
  );
};

export default SideMenuPanel;
