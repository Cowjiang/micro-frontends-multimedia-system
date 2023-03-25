import React, { useEffect } from 'react';
import { UserModelState } from '@/models/user';
import { useLocation, useNavigate, useSelector } from '@@/exports';
import Empty from '@/components/Empty';

const DepartmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {userInfo}: UserModelState = useSelector((state: any) => state.user);

  useEffect(() => {
    if (location.pathname === '/department' && userInfo.department?.id) {
      navigate(`/department/${userInfo.department.id}/members`, {replace: true});
    }
  }, [location]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <Empty
        description="你还没有部门"
      />
    </div>
  );
};

export default DepartmentPage;
