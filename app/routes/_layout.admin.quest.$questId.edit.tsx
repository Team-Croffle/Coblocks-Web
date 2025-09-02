import { redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import QuestCreate from '~/components/QuestCreate'; 
import type { Quest } from '~/types';

// ID를 동적 라우트로 선택한 1개의 데이터를 로드
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { questId } = params;
  const { supabase } = createSupabaseServerClient({ request });
  const { data: quest } = await supabase.from('quest').select('*, quest_detail(*)').eq('quest_id', questId).single();

  if (!quest) {
    throw new Response('Not Found', { status: 404 });
  }
  return Response.json({ quest });
};

// 수정된 데이터를 DB에 업데이트
export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { questId } = params;
  const { supabase, response } = createSupabaseServerClient({ request });
  const formData = await request.formData();

  // quest 테이블에 업데이트할 데이터를 준비
  const questData = {
    quest_description: formData.get('quest_description') as string,
    quest_type: formData.get('quest_type') as string,
    quest_difficulty: Number(formData.get('quest_difficulty')),
  };

  // quest_detail 테이블에 업데이트할 데이터를 준비
  const questDetailData = {
    quest_question: formData.get('quest_question') as string,
    answer: formData.get('answer') as string,
    hint: formData.get('hint') as string,
    default_stage: JSON.parse((formData.get('default_stage') as string) || '{}'),
  };

  // 두 테이블에 대한 업데이트를 병렬로 실행
  const [questResult, detailResult] = await Promise.all([
    supabase.from('quest').update(questData).eq('quest_id', questId),
    supabase.from('quest_detail').update(questDetailData).eq('quest_id', questId),
  ]);

  if (questResult.error || detailResult.error) {
    console.error('Quest update error:', { questError: questResult.error, detailError: detailResult.error });
    return Response.json({ error: '퀘스트 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }

  return redirect('/admin?tab=problem', { headers: response.headers });
};

// loader가 반환하는 데이터의 타입 정의
type LoaderData = {
  quest: Quest;
};

export default function EditQuestPage() {
  const { quest } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  return (
    <div className='w-full p-4 md:p-8'>
      <div className='p-8 bg-white rounded-lg shadow-md'>
        <QuestCreate
          header='퀘스트 수정'
          quest={quest}
          onCancel={() => {
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
}
