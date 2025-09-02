import { Button } from '~/components/ui/button';
import { Form } from '@remix-run/react';

interface NoticeCreationFormProps {
  onCancel: () => void;
  header: string;
  initData?: {
    title: string;
    content: string;
  };
}

export default function NoticeCreationForm({ onCancel, header, initData }: NoticeCreationFormProps) {

  return (
    <div>
      <h3 className='text-xl font-bold text-gray-800 mb-6'>{header}</h3>

      <Form
        method='post'
        className='space-y-4'
      >
        <div>
          <label
            htmlFor='notice_name'
            className='block text-sm font-medium text-gray-700'
          >
            제목
          </label>
          <input
            type='text'
            name='notice_name'
            id='notice_name'
            required
            defaultValue={initData?.title || ''}
            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          />
        </div>
        <div>
          <label
            htmlFor='notice_content'
            className='block text-sm font-medium text-gray-700'
          >
            내용
          </label>
          <textarea
            name='notice_content'
            id='notice_content'
            rows={10}
            required
            defaultValue={initData?.content || ''}
            className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
          />
        </div>
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
            value='createNotice'
          >
            저장
          </Button>
        </div>
      </Form>
    </div>
  );
}
