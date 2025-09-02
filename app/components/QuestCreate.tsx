import { Form } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import type { Quest } from '~/types';

interface QuestCreateProps {
  onCancel: () => void;
  header: string;
  quest?: Quest;
}

export default function QuestCreate({ onCancel, header, quest }: QuestCreateProps) {
  const isEditing = !!quest;

  // 수정 시 quest_detail의 첫 번째 항목을 가져옵니다.
  const questDetail = quest?.quest_detail?.[0];

  return (
    <div className='p-6 bg-gray-50 border rounded-lg'>
      <h3 className='text-xl font-bold text-gray-800 mb-6'>{header}</h3>
      <Form
        method='post'
        className='space-y-6'
        onSubmit={() => {
          console.log('QuestCreate Form is being submitted!');
        }}
      >
        {isEditing && (
          <input
            type='hidden'
            name='quest_id'
            value={quest.quest_id}
          />
        )}

        <fieldset className='space-y-4 rounded-lg border p-4 pt-2'>
          <legend className='-ml-1 px-1 text-sm font-medium'>문제 정보</legend>
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label htmlFor='quest_type'>문제 유형</label>
              <input
                type='text'
                name='quest_type'
                id='quest_type'
                required
                defaultValue={quest?.quest_type || ''}
                className='mt-1 block w-full border rounded-md bg-white'
              />
            </div>
            <div>
              <label htmlFor='quest_difficulty'>난이도</label>
              <input
                type='number'
                name='quest_difficulty'
                id='quest_difficulty'
                required
                defaultValue={quest?.quest_difficulty || 1}
                className='mt-1 block w-full border rounded-md bg-white'
              />
            </div>
          </div>
          <div>
            <label htmlFor='quest_description'>문제 설명 (목록에 표시될 요약)</label>
            <textarea
              name='quest_description'
              id='quest_description'
              required
              defaultValue={quest?.quest_description || ''}
              rows={3}
              className='mt-1 block w-full border rounded-md bg-white'
            />
          </div>
        </fieldset>

        <fieldset className='space-y-4 rounded-lg border p-4 pt-2'>
          <legend className='-ml-1 px-1 text-sm font-medium'>문제 상세 내용</legend>
          <div>
            <label htmlFor='quest_question'>문제 내용</label>
            <textarea
              name='quest_question'
              id='quest_question'
              required
              defaultValue={questDetail?.quest_question || ''}
              rows={8}
              className='mt-1 block w-full border rounded-md bg-white'
            />
          </div>
          <div>
            <label htmlFor='answer'>정답</label>
            <input
              type='text'
              name='answer'
              id='answer'
              defaultValue={questDetail?.answer || ''}
              className='mt-1 block w-full border rounded-md bg-white'
            />
          </div>
          <div>
            <label htmlFor='hint'>힌트</label>
            <textarea
              name='hint'
              id='hint'
              defaultValue={questDetail?.hint || ''}
              rows={3}
              className='mt-1 block w-full border rounded-md bg-white'
            />
          </div>
          <div>
            <label htmlFor='default_stage'>초기 블록 상태 (JSON 형식)</label>
            <textarea
              name='default_stage'
              id='default_stage'
              defaultValue={questDetail?.default_stage ? JSON.stringify(questDetail.default_stage, null, 2) : ''}
              rows={8}
              className='mt-1 block w-full font-mono text-sm border rounded-md bg-white'
              placeholder='{ "blocks": { ... } }'
            />
          </div>
        </fieldset>

        <div className='flex justify-end space-x-2 pt-4'>
          <Button
            type='button'
            variant='outline'
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            type='submit'
            name='_action'
            value={isEditing ? 'updateQuest' : 'createQuest'}
          >
            저장
          </Button>
        </div>
      </Form>
    </div>
  );
}
