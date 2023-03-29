import React from 'react';
import './index.less';
import { CardProps } from '@/components/Card/typings';
import classNames from 'classnames';
import { Card as AntdCard, Skeleton, theme, Typography } from 'antd';
import { useModel } from '@@/exports';

const {useToken} = theme;
const {Title, Text} = Typography;

const Card: React.FC<CardProps> = (props) => {
  const {loadingOptions, onActionBtnClick, wrapperStyle, ...antdCardProps} = props;
  const {token} = useToken();
  const {darkTheme} = useModel('theme');
  const {
    colorPrimary,
    colorFillQuaternary,
    colorTextDisabled
  } = token;

  // 标题右侧按钮点击事件
  const handleActionBtnClick = (action: 'more' | 'refresh') => {
    props?.onActionBtnClick && props.onActionBtnClick(action);
  };

  return (
    <AntdCard
      className={
        classNames(
          'card-wrapper flex flex-col rounded-lg overflow-hidden'
        )
      }
      style={{
        ...wrapperStyle,
        background: darkTheme ? colorFillQuaternary : '#fff'
      }}
      {...antdCardProps}
      title={undefined}
      loading={false}
    >
      <div className="card-header w-full flex-shrink-0">
        <div className="card-border-top w-full h-[5px]" style={{backgroundColor: colorPrimary}}></div>
        {
          props.title && (
            <div className="w-full h-[60px] px-6 flex items-center">
              <div className="card-title">
                <Title
                  level={5}
                  ellipsis
                >
                  {props.title ?? ''}
                </Title>
              </div>
              {
                props.action !== false && (
                  <div
                    className="card-action ml-auto flex-shrink-0 text-base"
                    style={{color: colorTextDisabled}}
                  >
                    {
                      props.action ?? (
                        <div className="flex">
                          <i
                            className="fi fi-br-refresh ml-4 cursor-pointer"
                            onClick={() => handleActionBtnClick('refresh')}
                          />
                          <i
                            className="fi fi-br-menu-dots ml-4 cursor-pointer"
                            onClick={() => handleActionBtnClick('more')}
                          />
                        </div>
                      )
                    }
                  </div>
                )
              }
            </div>
          )
        }
      </div>
      <div
        className={classNames(
          'card-content w-full px-6 pb-6 flex-grow',
          {'pt-6': !props.title}
        )}
      >
        <Skeleton
          loading={props.loading}
          title
          active
          paragraph={{rows: 4}}
          {...loadingOptions}
        >
          {props.children}
        </Skeleton>
      </div>
    </AntdCard>
  );
};

export default Card;
