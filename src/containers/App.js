import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavigationBar from '../components/layout/NavigationBar/NavigationBar';
import LoginPage from './Login/LoginPage';
import ForgotPasswordPage from './ForgotPassword/ForgotPasswordPage';
import ClassroomPage from './Classroom/ClassroomPage';
import Profiler from '../Dummy/Dummy-ProfilePage';

const AppContent = () => {
  const location = useLocation(); // Router 내부에서 useLocation 호출

  return (
    <>
      {/* 로그인 페이지와 비밀번호 찾기 페이지가 아닐 경우에만 NavigationBar 렌더링 */}
      {location.pathname !== '/login' && location.pathname !== '/forgot-password' && <NavigationBar />}
      <Routes>
        <Route
          path='/'
          element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h1>Home Page</h1>
            </div>
          }
        />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/classroom' element={<ClassroomPage />} />
        <Route path='/profile' element={<Profiler />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
