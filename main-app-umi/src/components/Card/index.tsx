import React from 'react';
import './index.less';
import { CardProps } from '@/components/Card/typings';
import classNames from 'classnames';
import { Card as AntdCard, theme, Typography } from 'antd';
import { useModel } from '@@/exports';

const {useToken} = theme;
const {Title, Text} = Typography;

const Card: React.FC<CardProps> = (props: CardProps) => {
  const {token} = useToken();
  const {darkTheme} = useModel('theme');
  const {colorPrimary, colorFillQuaternary, colorPrimaryBg, colorFillSecondary, colorFillTertiary, colorBorder} = token;

  return (
    <AntdCard
      className={
        classNames(
          'card-wrapper flex flex-col rounded-lg overflow-hidden'
        )
      }
      style={{
        ...props.wrapperStyle,
        background: darkTheme ? colorFillQuaternary : '#fff'
      }}
      {...props}
      title={undefined}
    >
      <div className="card-header w-full flex-shrink-0">
        <div className="card-border-top w-full h-[5px]" style={{backgroundColor: colorPrimary}}></div>
        {
          props.title && (
            <div className="w-full h-[60px] px-6 flex items-center">
              <div className="card-title">
                <Title
                  className="!m-0"
                  level={5}
                  ellipsis
                >
                  {props.title ?? ''}
                </Title>
              </div>
              <div className="card-action flex-shrink-0">
                {props.action ?? <></>}
              </div>
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
        {props.children}
      </div>
    </AntdCard>
  );
};

export default Card;
