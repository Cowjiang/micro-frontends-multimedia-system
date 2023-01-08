import { Outlet, useModel } from '@@/exports';
import { Spin } from 'antd';

export default () => {
  const {loading} = useModel('global');

  return (
    <Spin
      spinning={loading}
      size="large"
      className="!h-screen !max-h-screen"
    >
      <Outlet />
    </Spin>
  );
};
