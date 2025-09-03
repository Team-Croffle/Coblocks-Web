import { WorkspaceWrapper } from '~/components/WorkspaceWrapper';
import { useEffect, useState } from 'react';

// 라우트 컴포넌트 - 데이터를 컴포넌트에 전달
export default function WorkspaceRoute(): JSX.Element {
  // const socket = useSocket();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // 컴포넌트에 데이터 전달
  return <>{isClient && <WorkspaceWrapper />}</>;
}
