import { useState } from 'react';
import type { Notice } from '~/types';
import NoticeManagementView from './NoticeManage';

function ProblemManagementView() {
  return (
    <div>
      <h3 className='text-lg font-semibold text-gray-800'>문제 관리 기능</h3>
      <p className='mt-2 text-sm text-gray-600'>이곳에 문제 목록, 추가, 수정, 삭제 기능이 들어갑니다.</p>
    </div>
  );
}

// 1. 새로운 기능인 '회원 관리'를 위한 임시 컴포넌트를 추가합니다.
function UserManagementView() {
  return (
    <div>
      <h3 className='text-lg font-semibold text-gray-800'>회원 관리 기능</h3>
      <p className='mt-2 text-sm text-gray-600'>이곳에 사용자 목록, 권한 변경, 회원 정보 수정 기능 등이 들어갑니다.</p>
    </div>
  );
}

interface AdminDashboardProps {
  notices: Notice[];
}

export default function AdminDashboard({ notices }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'notice' | 'problem' | 'user'>('notice');

  return (
    <div className='w-full p-8 bg-white shadow-xl rounded-2xl'>
      {/* --- 상단부: 기능 선택 탭 --- */}
      <div className='border-b border-gray-200'>
        <nav
          className='flex -mb-px space-x-8'
          aria-label='Tabs'
        >
          <button
            type='button'
            onClick={() => {
              setActiveTab('notice');
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 focus:outline-none ${
              activeTab === 'notice'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            공지사항 관리
          </button>
          <button
            type='button'
            onClick={() => {
              setActiveTab('problem');
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 focus:outline-none ${
              activeTab === 'problem'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            문제 관리
          </button>
          <button
            type='button'
            onClick={() => {
              setActiveTab('user');
            }}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200 focus:outline-none ${
              activeTab === 'user'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            회원 관리
          </button>
        </nav>
      </div>

      {/* --- 하단부: 선택된 기능의 화면 --- */}
      <div className='mt-8 p-6 border border-gray-200 rounded-lg min-h-[400px]'>
        {activeTab === 'notice' && <NoticeManagementView notices={notices} />}
        {activeTab === 'problem' && <ProblemManagementView />}
        {activeTab === 'user' && <UserManagementView />}
      </div>
    </div>
  );
}
