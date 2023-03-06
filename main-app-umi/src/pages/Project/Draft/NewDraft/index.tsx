import React from 'react';
import { Card, Col, Row, theme, Typography } from 'antd';
import { useModel, useNavigate, useParams } from '@@/exports';

const {useToken} = theme;
const {Title, Text} = Typography;

const draftTypeList = [
  {
    title: '新建H5',
    icon: <i className="fi fi-rr-link-alt" />,
    type: 'h5'
  },
  {
    title: '新建图文',
    icon: <i className="fi fi-rr-document" />,
    type: 'article'
  },
  {
    title: '新建音视频',
    icon: <i className="fi fi-rr-play-alt" />,
    type: 'media'
  },
  {
    title: '文本草稿',
    icon: <i className="fi fi-rr-box" />,
    type: 'article'
  }
]

const NewDraftPage: React.FC = () => {
  const navigate = useNavigate();
  const {id: projectId} = useParams();

  const {token} = useToken();
  const {darkTheme} = useModel('theme');

  return (
    <div className="new-draft-page w-full h-full flex flex-col justify-center items-center">
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
                onClick={() => navigate(`/project/${projectId}/draft/new/${type.type}`)}
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

export default NewDraftPage;
