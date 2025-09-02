import { useState } from 'react';
import { Form, Link } from '@remix-run/react';
import type { Quest } from '~/types';
import QuestCreate from './QuestCreate';

interface QuestManagementViewProps {
  quests: Quest[];
}

export default function QuestManagementView({ quests }: QuestManagementViewProps) {
  const [viewMode, setViewMode] = useState('list');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleSelect = (id: string) => {
    setSelectedIds((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((prevId) => {
          return prevId !== id;
        });
      } else {
        return [...prevIds, id];
      }
    });
  };

  if (viewMode === 'create') {
    return (
      <QuestCreate
        onCancel={() => {
          setViewMode('list');
        }}
        header='새 퀘스트 작성'
      />
    );
  }

  return (
    <Form
      method='post'
      className='w-full'
      onSubmit={() => {
        console.log('폼 제출됨');
      }}
    >
      {/* --- 상단부: 제목과 버튼 --- */}
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h3 className='text-xl font-bold text-gray-800'>퀘스트 목록</h3>
          <p className='text-sm text-gray-500'>총 {quests.length}개의 퀘스트가 있습니다.</p>
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
            퀘스트 추가
          </button>
          <button
            type='submit'
            name='_action'
            value='deleteQuests'
            className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
          >
            선택 삭제
          </button>
        </div>
      </div>

      {selectedIds.map((id) => {
        return (
          <input
            key={id}
            type='hidden'
            name='questId'
            value={id}
          />
        );
      })}

      {/* --- 중단부: 퀘스트 테이블 --- */}
      <div className='overflow-hidden border rounded-md'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th
                scope='col'
                className='w-12 px-6 py-3'
              ></th>
              <th
                scope='col'
                className='px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase'
              >
                제목
              </th>
              <th
                scope='col'
                className='px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase w-24'
              >
                수정
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {quests.map((quest) => {
              return (
                <tr
                  key={quest.quest_id}
                  className='hover:bg-gray-50'
                >
                  <td className='px-6 py-4'>
                    <input
                      type='checkbox'
                      checked={selectedIds.includes(quest.quest_id)}
                      onChange={() => {
                        handleSelect(quest.quest_id);
                      }}
                      className='w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                    />
                  </td>
                  <td className='px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap'>
                    {quest.quest_description}
                  </td>
                  <td className='px-6 py-4 text-sm text-right'>
                    <Link
                      to={`/admin/quest/${quest.quest_id}/edit`}
                      className='font-medium text-blue-600 hover:underline'
                    >
                      수정
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Form>
  );
}
