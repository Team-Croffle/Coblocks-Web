import { type ActionFunctionArgs, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import type { Notice } from '~/types';
import NoticeCreationForm from '~/components/NoticeCreate';

// ID를 동적 라우트로 선택한 1개의 데이터를 로드
export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const { noticeId } = params;
  const { supabase } = createSupabaseServerClient({ request });
  const { data: notice } = await supabase.from('notice').select('*').eq('notice_id', noticeId).single();

  if (!notice) {
    throw new Response('Not Found', { status: 404 });
  }
  return Response.json({ notice });
};

// 수정된 데이터를 DB에 업데이트
export const action = async ({ params, request }: ActionFunctionArgs) => {
  const { noticeId } = params;
  const { supabase, response } = createSupabaseServerClient({ request });
  const formData = await request.formData();
  const noticeName = formData.get('notice_name') as string;
  const noticeContent = formData.get('notice_content') as string;

  await supabase
    .from('notice')
    .update({ notice_name: noticeName, notice_content: noticeContent })
    .eq('notice_id', noticeId);

  // Remix의 redirect() 대신 표준 Response 객체를 직접 생성하여 리다이렉션을 처리
  // status: 303은 Form 제출 후 리다이렉트할 때 권장되는 코드
  return new Response(null, {
    status: 303,
    headers: {
      ...response.headers, // Supabase가 쿠키를 갱신할 경우를 대비해 헤더를 포함
      Location: '/admin',
    },
  });
};

// loader가 반환하는 데이터의 타입 정의
type LoaderData = {
  notice: Notice;
};

export default function EditNoticePage() {
  // <typeof loader> 대신 정의한 타입을 사용
  const { notice } = useLoaderData<LoaderData>();
  const navigate = useNavigate();

  return (
    <div className='w-full p-4 md:p-8'>
      <div className='p-8 bg-white rounded-lg shadow-md'>
        <NoticeCreationForm
          header='공지사항 수정'
          initData={{ title: notice.notice_name, content: notice.notice_content }}
          onCancel={() => {
            navigate(-1);
          }}
        />
      </div>
    </div>
  );
}
