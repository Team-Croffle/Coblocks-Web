import type { Notice } from '~/types';
import NoticeCreate from './NoticeCreate';
import { useState } from 'react';

interface NoticeManagementViewProps {
  notices: Notice[];
}

export default function NoticeManagementView({ notices }: NoticeManagementViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list');

  // 만약 뷰 모드가 'create'이면, 작성 폼을 보여줍니다.
  if (viewMode === 'create') {
    return (
      <NoticeCreate
        onCancel={() => {
          setViewMode('list');
        }}
      />
    );
  }

  return (
    <div className='w-full'>
      {/* --- 상단부: 제목과 버튼 --- */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-xl font-bold text-gray-800'>공지사항 목록</h3>
          <p className='text-sm text-gray-500'>총 {notices.length}개의 공지사항이 있습니다.</p>
        </div>
        <div className='flex space-x-2'>
          <button
            type='button'
            onClick={(event) => {
              event.preventDefault();
              setViewMode('create');
            }}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          >
            공지 추가
          </button>
          <button
            type='button'
            className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
          >
            선택 삭제
          </button>
        </div>
      </div>

      {/* --- 중단부: 공지사항 테이블 --- */}
      <div className='overflow-hidden border rounded-md'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='w-12 px-6 py-3'
              >
                <input
                  type='checkbox'
                  className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                />
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'
              >
                제목
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase w-48'
              >
                작성일
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {notices.map((notice) => {
              return (
                <tr
                  key={notice.notice_id}
                  className='hover:bg-gray-50'
                >
                  <td className='px-6 py-4'>
                    <input
                      type='checkbox'
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                  </td>
                  <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                    {notice.notice_name}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-500 whitespace-nowrap'>
                    {new Date(notice.notice_time).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
