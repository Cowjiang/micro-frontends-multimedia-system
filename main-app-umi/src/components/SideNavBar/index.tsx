import React, { useMemo, useState } from 'react';
import './index.less';
import classNames from 'classnames';
import { Avatar, Image, Tooltip } from 'antd';
import { NavItemConfig, SideNavBarProps } from '@/components/SideNavBar/typings';
import { useDispatch, useNavigate, useSelector } from '@@/exports';
import { UserModelState } from '@/models/user';
import { AppModelState } from '@/models/app';

const SideNavBar: React.FC<SideNavBarProps> = (
  {
    secondaryColor = '#edeef0',
    onChange
  }
) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {userInfo}: UserModelState = useSelector((state: any) => state.user);
  const {activeNavIndex}: AppModelState = useSelector((state: any) => state.app);

  const navItemList = useMemo((): NavItemConfig[] => ([
    {name: 'home', title: '主页', icon: 'fi fi-sr-house-blank', url: '/index'},
    {name: 'project', title: '项目', icon: 'fi fi-sr-apps', url: '/project'},
    {name: 'resource', title: '资源库', icon: 'fi fi-sr-cloud-upload', url: '/resource'},
    {name: 'department', title: '部门信息', icon: 'fi fi-ss-users', url: '/department'},
    {name: 'chat', title: '聊天', icon: 'fi fi-sr-comment'},
    {name: 'settings', title: '设置', icon: 'fi fi-sr-settings', url: '/settings'},
    {
      name: 'user',
      bottom: true,
      title: '我',
      ...!userInfo?.userId ? {icon: 'fi fi-sr-user'} : {imgUrl: userInfo.avgPath ?? ''}
    }
  ]), [userInfo]);

  // 导航栏当前hover的Index
  const [currentHovering, setCurrentHovering] = useState(-1);

  // 导航栏点击事件
  const handleNavItemClick = (index: number) => {
    if (index !== activeNavIndex) {
      if (onChange) {
        onChange({index, value: navItemList[index]});
      } else {
        dispatch({
          type: 'app/setActiveNavIndex',
          payload: {
            activeNavIndex: index
          }
        });
        const url = navItemList[index].url ?? '';
        url && navigate(url);
      }
    }
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
              className={
                classNames(
                  'btn-container flex flex-col justify-center items-center mb-1',
                  {'mt-auto !mb-4': navItem.bottom}
                )
              }
              onMouseOver={() => setCurrentHovering(index)}
              onMouseLeave={() => setCurrentHovering(-1)}
            >
              <div className="btn-wrapper flex justify-center items-center">
                <div
                  className={
                    classNames(
                      'btn-content flex justify-center items-center flex-grow-0 flex-shrink-0',
                      {
                        'btn-content__focus': index === activeNavIndex,
                        'btn-content__hover': currentHovering === index && index !== activeNavIndex
                      }
                    )
                  }
                  style={index === activeNavIndex ? {backgroundColor: secondaryColor} : {}}
                  onClick={() => handleNavItemClick(index)}
                >
                  {
                    navItem.icon ? (
                      <div
                        className={
                          classNames(
                            'btn-icon text-white text-xl flex justify-center items-center animate__animated',
                            {'animate__bounceIn': activeNavIndex === index}
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
                            {'animate__bounceIn': activeNavIndex === index}
                          )
                        }
                      >
                        <Avatar
                          size={50}
                          src={navItem.imgUrl}
                          icon={<i className="fi fi-sr-user"></i>}
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
                  style={index === activeNavIndex ? {color: secondaryColor} : {color: 'transparent'}}
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
