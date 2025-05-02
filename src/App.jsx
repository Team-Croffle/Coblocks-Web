import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavigationBar from '@layouts/NavigationBar';
import AuthPage from '@pages/auth/AuthPage';
import ForgotPasswordPage from '@pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@pages/auth/ResetPasswordPage';
import ClassroomMainPage from '@pages/classroom/ClassroomMainPage';
import IntroContainer from '@pages/intro/IntroContainer'; // IntroContainer 컴포넌트 가져오기

const AppContent = () => {
  const location = useLocation(); // Router 내부에서 useLocation 호출
  return (
    <>
      {/* 로그인 페이지와 비밀번호 찾기 페이지가 아닐 경우에만 NavigationBar 렌더링 */}
      {location.pathname !== '/login' && location.pathname !== '/forgot-password' && <NavigationBar />}
      <Routes>
        <Route
          path='/'
          element={<IntroContainer />} // Home Page를 IntroContainer로 변경
        />
        <Route
          path='/login'
          element={<AuthPage />}
        />
        <Route
          path='/forgot-password'
          element={<ForgotPasswordPage />}
        />
        <Route
          path='/reset-password'
          element={<ResetPasswordPage />}
        />

        <Route
          path='/classroom'
          element={<ClassroomMainPage />}
        />
        <Route
          path='/profile'
          element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>Profile Page</h1>
            </div>
          }
        />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <>
      <Router>
        <AppContent />
      </Router>
    </>
  );
};

export default App;
