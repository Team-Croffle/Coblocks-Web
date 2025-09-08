import { useState } from 'react';
import type { Notice, Quest } from '~/types';
import NoticeManagementView from './NoticeManage';
import QuestManagementView from './QuestManage';

interface AdminDashboardProps {
  notices: Notice[];
  quests: Quest[];
}

export default function AdminDashboard({ notices, quests }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'notice' | 'problem'>('notice');

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
        </nav>
      </div>

      {/* --- 하단부: 선택된 기능의 화면 --- */}
      <div className='mt-8 p-6 border border-gray-200 rounded-lg min-h-[400px]'>
        {activeTab === 'notice' && <NoticeManagementView notices={notices} />}
        {activeTab === 'problem' && <QuestManagementView quests={quests} />}
      </div>
    </div>
  );
}
