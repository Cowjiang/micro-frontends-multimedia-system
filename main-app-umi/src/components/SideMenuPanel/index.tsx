import React, { useEffect, useState } from 'react';
import './index.less';
import { SideMenuPanelProps } from '@/components/SideMenuPanel/typings';
import { useModel } from '@@/exports';
import classNames from 'classnames';
import logoWhite from '@/assets/images/logo/logo-white.png';
import logoBlack from '@/assets/images/logo/logo-black.png';
import { Typography } from 'antd';

const {Title} = Typography;
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
          'side-menu-panel h-full flex-shrink-0 overflow-auto transition-all duration-200',
          {'hidden': displayNone}
        )
      }
      style={{
        width: props.width ?? '300px',
        background: darkTheme ? '#212121' : '#f6f6f6',
        opacity
      }}
    >
      <div className="min-h-[80vh]">
        {props.children}
      </div>
      <div
        className="absolute bottom-6 w-full mt-8 px-16 flex items-center cursor-pointer opacity-[15%]"
        onClick={() => window.open('https://github.com/Cowjiang')}
      >
        <Title className="!mr-2" level={4}>
          <i className="fi fi-brands-github" />
        </Title>
        <img
          className="w-[130px] h-full flex-shrink-0 opacity-90"
          src={darkTheme ? logoWhite : logoBlack}
          alt=""
        />
      </div>
    </div>
  );
};

export default SideMenuPanel;
