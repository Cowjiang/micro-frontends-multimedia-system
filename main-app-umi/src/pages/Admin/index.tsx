import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useModel, useNavigate, useParams } from '@@/exports';
import WujieReact from 'wujie-react';
import wujieDefaultProps from '@/config/wujieProps';
import NProgress from 'nprogress';
import { Typography } from 'antd';
import { useSetDocTitle } from '@/utils/hooks';

const {Title} = Typography;
const adminItemObj: { [key: string]: { title: string; value: string } } = {
  'role': {title: '角色编辑', value: 'role'},
  'permission': {title: '权限管理', value: 'permission'},
  'request-path': {title: '路径权限', value: 'request-path'},
  'user': {title: '用户管理', value: 'user'}
};

const AdminPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const {messageApi} = useModel('messageApi');
  const location = useLocation();
  const navigate = useNavigate();
  const {item: adminItem} = useParams();

  useEffect(() => {
    if (location.pathname.includes('/admin')) {
      if (!adminItem || !adminItemObj[adminItem]) {
        navigate('/admin/permission', {replace: true});
      } else {
        const url = `http://localhost:5000/admin/client/admin/user/${adminItem}`;
        setTitle(adminItemObj[adminItem].title)
        WujieReact.destroyApp('admin');
        setWujieInstance(
          <WujieReact
            name="admin"
            width="100%"
            height="100%"
            url={url}
            // alive={true}
            props={{
              ...wujieDefaultProps
            }}
            beforeLoad={() => {
              NProgress.start();
              setLoading(true);
            }}
            beforeMount={() => {
              NProgress.done();
              setLoading(false);
            }}
            loadError={() => {
              messageApi.error('加载失败');
              NProgress.done();
              setLoading(false);
            }}
          />
        )
      }
    }
  }, [location, adminItem]);
  const [title, setTitle] = useState('后台管理')
  const [wujieInstance, setWujieInstance] = useState<React.ReactNode | null>(null);
  useSetDocTitle(title);

  return (
    <>
      <div className="p-6">
        <Title level={2}>{adminItemObj[adminItem ?? '']?.title ?? '后台管理'}</Title>
      </div>
      {wujieInstance}
    </>
  );
};

export default AdminPage;
