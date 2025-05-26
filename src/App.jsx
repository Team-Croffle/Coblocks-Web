import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavigationBar from '@layouts/NavigationBar';
import AuthPage from '@pages/auth/AuthPage';
import ForgotPasswordPage from '@pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@pages/auth/ResetPasswordPage';
import IntroContainer from '@pages/intro/IntroContainer';
import ClassroomMainPage from '@pages/classroom/ClassroomMainPage';
import ClassroomPage from '@pages/classroom/ClassroomPage';
import ClassroomWorkspace from '@pages/classroom/ClassroomWorkspace';
import ClassroomLayout from './components/layouts/ClassroomLayout';
import Footer from '@layouts/Footer';
import DeveloperInfo from '@pages/developerInfo/DeveloperInfo'; // DeveloperInfo 페이지 import 추가

const AppContent = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/forgot-password' && <NavigationBar />}
      <Routes>
        <Route
          path='/'
          element={<IntroContainer />}
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
          path='/classroom-main'
          element={<ClassroomMainPage />}
        />
        <Route element={<ClassroomLayout />}>
          <Route
            path='/classroom'
            element={<ClassroomPage />}
          />
          <Route
            path='/classroom/workspace'
            element={<ClassroomWorkspace />}
          />
        </Route>
        <Route
          path='/profile'
          element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>Profile Page</h1>
            </div>
          }
        />
        <Route
          path='/developer-info'
          element={<DeveloperInfo />}
        />{' '}
        {/* 팀원소개 라우트 추가 */}
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <>
      <Router>
        <AppContent />
        <Footer />
      </Router>
    </>
  );
};

export default App;
