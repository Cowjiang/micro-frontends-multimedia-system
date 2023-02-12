import React, { useState } from 'react';
import './index.less';
import classNames from 'classnames';
import { Image, Tooltip } from 'antd';
import { SideNavBarProps } from '@/components/SideNavBar/typings';

const SideNavBar: React.FC<SideNavBarProps> = (
  {
    secondaryColor = '#edeef0'
  }
) => {
  const navItemList = [
    {name: 'home', title: '主页', icon: 'fi fi-sr-house-blank'},
    {name: 'fullscreen', title: '切换全屏', icon: 'fas fa-up-right-and-down-left-from-center'},
    {name: 'search', title: '搜索', icon: 'fas fa-search'},
    {name: 'refresh', title: '刷新', icon: 'fas fa-rotate'},
    {
      name: '61be0f1ee7fd6865cbcd74d1',
      chatType: 0,
      title: 'Cowjiang',
      imgUrl: 'https://chat-ice.oss-cn-beijing.aliyuncs.com/chat/9138f18c-1723-4d97-b027-c92c113bd707.jpg'
    }
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentHovering, setCurrentHovering] = useState(-1);

  const handleNavItemClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="nav-container pt-5 flex flex-col items-center">
      {
        navItemList.map((navItem, index) => (
          <Tooltip
            key={index}
            title={navItem.title}
            placement="right"
          >
            <div
              className="btn-container flex flex-col justify-center items-center mb-1"
              onMouseOver={() => setCurrentHovering(index)}
              onMouseLeave={() => setCurrentHovering(-1)}
            >
              <div className="btn-wrapper flex justify-center items-center">
                <div
                  className={
                    classNames(
                      'btn-content flex justify-center items-center flex-grow-0 flex-shrink-0',
                      {
                        'btn-content__focus': index === currentIndex,
                        'btn-content__hover': currentHovering === index && index !== currentIndex
                      }
                    )
                  }
                  style={index === currentIndex ? {backgroundColor: secondaryColor} : {}}
                  onClick={() => handleNavItemClick(index)}
                >
                  {
                    navItem.icon ? (
                      <div
                        className={
                          classNames(
                            'btn-icon text-white text-xl flex justify-center items-center animate__animated',
                            {'animate__bounceIn': currentIndex === index}
                          )
                        }
                      >
                        <i className={navItem.icon} />
                      </div>
                    ) : navItem.imgUrl ? (
                      <div
                        className={
                          classNames(
                            'btn-icon text-white text-xl flex justify-center items-center overflow-hidden animate__animated',
                            {'animate__bounceIn': currentIndex === index}
                          )
                        }
                      >
                        <Image
                          width={50}
                          src={navItem.imgUrl}
                          preview={false}
                        />
                      </div>
                    ) : (
                      <div className="btn-icon text-white text-xl flex justify-center items-center overflow-hidden">
                        <span>{navItem.title.charAt(0).toUpperCase() || ''}</span>
                      </div>
                    )
                  }
                </div>
                <svg
                  style={index === currentIndex ? {color: secondaryColor} : {color: 'transparent'}}
                  width="30px"
                  height="60px"
                  viewBox="0 0 36 60"
                  version="1.1">
                  <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g transform="translate(-40.000000, -18.000000)" fill="currentColor">
                      <g>
                        <g transform="translate(10.000000, 18.000000)">
                          <g transform="translate(0.000000, -0.000000)">
                            <path
                              d="M30,0 C36.0854073,0 41.7476231,1.81189837 46.4765936,4.9256414 C49.2385783,6.65266891 52.5028196,7.65 56,7.65 C59.7003078,7.65 63.1398309,6.53344791 66.0000337,4.61887937 L66.0000337,55.3811206 C63.1398309,53.4665521 59.7003078,52.35 56,52.35 C52.5028196,52.35 49.2385783,53.3473311 46.476181,55.0730885 C41.8763772,58.1033248 36.3930422,59.900371 30.4961049,59.9959809 L30,60 L30,0 Z"></path>
                          </g>
                        </g>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
              {index === 0 && <hr className="divider my-2 mx-2" />}
            </div>
          </Tooltip>
        ))
      }
    </div>
  );
};

export default SideNavBar;
