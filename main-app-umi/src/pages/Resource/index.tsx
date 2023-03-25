import React from 'react';
import { Card, Col, Row, theme, Typography } from 'antd';
import { useModel, useNavigate, useParams } from '@@/exports';

const {useToken} = theme;
const {Title, Text} = Typography;

const draftTypeList = [
  {
    title: '项目素材',
    icon: <i className="fi fi-rr-apps" />,
    targetTypeName: 'mfms-material',
    prefix: 'project'
  },
  {
    title: '聊天素材',
    icon: <i className="fi fi-rr-comment" />,
    targetTypeName: 'mfms-chat',
    prefix: 'group'
  },
  {
    title: '我的素材',
    icon: <i className="fi fi-rr-box-open" />,
    targetTypeName: 'temp',
    prefix: 'temp'
  },
  {
    title: '其他素材',
    icon: <i className="fi fi-rr-play-alt" />,
    targetTypeName: 'temp',
    prefix: 'temp'
  },
]

const ResourcePage: React.FC = () => {
  const navigate = useNavigate();
  const {id: projectId} = useParams();

  const {token} = useToken();
  const {darkTheme} = useModel('theme');

  return (
    <div className="resource-page w-full h-full flex flex-col justify-center items-center">
      <Row gutter={16}>
        {
          draftTypeList.map(type => (
            <Col key={type.title}>
              <Card
                className="new-draft-card w-[160px] overflow-hidden !shadow-none"
                hoverable
                bordered={false}
                size="small"
                cover={
                  <div
                    className="w-full h-[130px] !flex justify-center items-center"
                    style={{background: darkTheme ? '#212121' : '#fafafa'}}
                  >
                    <div className="text-3xl" style={{color: token.colorPrimary}}>
                      {type.icon}
                    </div>
                  </div>
                }
                bodyStyle={{background: darkTheme ? '#333' : '#f3f5f6'}}
                onClick={() => navigate(`/resource/list/${type.targetTypeName}/${type.prefix}`)}
              >
                <div className="w-full py-2 text-center">
                  <Text>
                    {type.title}
                  </Text>
                </div>
              </Card>
            </Col>
          ))
        }
      </Row>
      <div className="h-[100px]"></div>
    </div>
  );
};

export default ResourcePage;
