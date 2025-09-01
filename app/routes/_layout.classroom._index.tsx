import { type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import { Quest } from '~/components/QuestList';
import ClassroomPage from '~/components/ClassroomPage';
import NavigationBar from '~/layouts/NavigationBar';
import Footer from '~/layouts/Footer';

// Loader 함수 - 서버에서 실행
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = createSupabaseServerClient({ request });

  try {
    // RPC 함수 호출
    const { data, error } = await supabase.rpc('get_questlist');

    if (error) {
      console.error('Supabase RPC 함수 호출 에러: ', error);
      return Response.json({ questList: [] });
    }

    return Response.json({ questList: data as Quest[] });
  } catch (error) {
    console.error('퀘스트 로딩 에러:', error);
    return Response.json({ questList: [] }); //respone 타입지정
  }
};

// 라우트 컴포넌트 - 데이터를 컴포넌트에 전달
export default function ClassroomRoute(): JSX.Element {
  const { questList } = useLoaderData<typeof loader>();

  // 컴포넌트에 데이터 전달
  return (
    <>
      <ClassroomPage questList={questList} />
    </>
  );
}
