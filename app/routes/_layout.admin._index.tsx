import { type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import AdminDashboard from '~/components/AdminDashboard';
import { createSupabaseServerClient } from '~/utils/supabase.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = createSupabaseServerClient({ request });
  const { data: notices } = await supabase.from('notice').select('*').order('notice_time', { ascending: false });

  return Response.json({ notices: notices || [] });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabase } = createSupabaseServerClient({ request });
  const formData = await request.formData();
  const actionType = formData.get('_action');

  // 공지사항 생성
  if (actionType === 'createNotice') {
    const noticeName = formData.get('notice_name');
    const noticeContent = formData.get('notice_content');

    if (!noticeName || !noticeContent) {
      return Response.json({ error: '제목과 내용을 모두 입력해야 합니다.' }, { status: 400 });
    }

    const { error } = await supabase
      .from('notice')
      .insert([{ notice_name: noticeName, notice_content: noticeContent }]);

    if (error) {
      console.error('공지사항 생성 오류:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }

  // 공지사항 삭제
  if (actionType === 'deleteNotices') {
    const noticeIds = formData.getAll('noticeId') as string[];
    if (!noticeIds || noticeIds.length === 0) {
      return Response.json({ error: '삭제할 공지사항을 선택하세요.' }, { status: 400 });
    }

    const { error } = await supabase.from('notice').delete().in('notice_id', noticeIds);

    if (error) {
      console.error('공지사항 삭제 오류:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }
  }
  return null;
};

export default function AdminPage() {
  const { notices } = useLoaderData<typeof loader>();

  return (
    <div className='w-full p-4 md:p-8'>
      <AdminDashboard notices={notices} />
    </div>
  );
}
