import React from 'react';
import WujieReact from 'wujie-react';
import { useNavigate } from '@@/exports';

export default function Page() {
  const navigate = useNavigate()
  const { bus } = WujieReact;
  bus.$on("login", (res: any) => {
    console.log(res);
    navigate("../index", { replace: true });
  });

  return (
    <div>
      <WujieReact
        width="100%"
        height="100%"
        name="chat"
        url="http://localhost:3000/login"
        sync={false}
        fetch={fetch} />
    </div>
  );
}
