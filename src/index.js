import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/modules/i18n/i18n'; // i18n 초기화
import App from './App'; // App 컴포넌트 가져오기

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
