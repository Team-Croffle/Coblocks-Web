import { redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import AdminDashboard from '~/components/AdminDashboard';
import { createSupabaseServerClient } from '~/utils/supabase.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = createSupabaseServerClient({ request });
  const { data: notices } = await supabase.from('notice').select('*').order('notice_time', { ascending: false });
  const { data: quests } = await supabase.from('quest').select('*');

  return Response.json({ notices: notices || [], quests: quests || [] });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabase, response } = createSupabaseServerClient({ request });
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
    return redirect('/admin?tab=notice', { headers: response.headers });
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

  if (actionType === 'createQuest') {
    const questData = {
      quest_description: formData.get('quest_description') as string,
      quest_type: formData.get('quest_type') as string,
      quest_difficulty: Number(formData.get('quest_difficulty')),
    };
    const questDetailData = {
      quest_question: formData.get('quest_question') as string,
      answer: formData.get('answer') as string,
      hint: formData.get('hint') as string,
      default_stage: JSON.parse((formData.get('default_stage') as string) || '{}'),
      quest_context: JSON.parse(String(formData.get('quest_context') || '{}')),
    };

    // quest 테이블에 데이터를 삽입, 생성된 데이터를 반환
    const { data: newQuest, error: questError } = await supabase
      .from('quest')
      .insert({ ...questData, solve_status: 1 })
      .select()
      .single();

    if (questError || !newQuest) {
      console.error('Quest creation error:', questError);
      return Response.json({ error: '퀘스트 생성 중 1단계 오류' }, { status: 500 });
    }

    // 성공적으로 생성된 questID를 사용해서 quest_detail에 데이터를 삽입
    const { error: detailError } = await supabase.from('quest_detail').insert({
      ...questDetailData,
      quest_id: newQuest.quest_id,
    });

    if (detailError) {
      console.error('Quest detail creation error:', detailError);
      // 참고: 이 경우 quest는 생성되었지만 detail은 실패한 상태
      return Response.json({ error: '퀘스트 생성 중 2단계 오류' }, { status: 500 });
    }

    return redirect('/admin?tab=problem', { headers: response.headers });
  }

  if (actionType === 'deleteQuests') {
    const questIds = formData.getAll('questId') as string[];
    if (questIds.length === 0) {
      return Response.json({ error: '삭제할 퀘스트를 선택하세요.' }, { status: 400 });
    }
    const { error } = await supabase.from('quest').delete().in('quest_id', questIds);
    if (error) {
      return Response.json({ error: '퀘스트 삭제 오류' }, { status: 500 });
    }
    return redirect('/admin?tab=problem', { headers: response.headers });
  }

  return null;
};

export default function AdminPage() {
  const { notices, quests } = useLoaderData<typeof loader>();

  return (
    <div className='w-full p-4 md:p-8'>
      <AdminDashboard
        notices={notices}
        quests={quests}
      />
    </div>
  );
}
