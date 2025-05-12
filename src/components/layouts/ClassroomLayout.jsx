import React from 'react';
import { Outlet } from 'react-router-dom';
import ClassroomContextProvider from '@contexts/ClassroomContextProvider';

const ClassroomLayout = () => {
  return (
    <ClassroomContextProvider>
      {/* Outlet은 이 레이아웃을 사용하는 자식 라우트의 element를 렌더링합니다. */}
      {/* 즉, ClassroomMainPage 또는 ClassroomPage가 여기에 렌더링됩니다. */}
      <Outlet />
    </ClassroomContextProvider>
  );
};

export default ClassroomLayout;
