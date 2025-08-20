import Carousel, { type CarouselItem } from '../components/Carousel';
import { useLoaderData } from '@remix-run/react';
import { createSupabaseServerClient } from '../utils/supabase.server';
import { type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import type { Notice } from '~/types';

// --- DB 연결 및 데이터 로더 ---
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = createSupabaseServerClient({ request }); // Supabase 클라이언트 생성

  // Supabase에서 공지사항 최신순 요청
  const { data: notices, error } = await supabase
    .from('notice')
    .select('notice_id, notice_name, notice_content')
    .order('notice_time', { ascending: false });

  // 요청 중 오류 발생 시, 빈 데이터 반환
  if (error) {
    console.error('Supabase 데이터 조회 에러: ', error);
    return Response.json({ notices: [] });
  }
  // 성공 시, 페이지로 전달
  return Response.json({ notices });
};

// meta 함수: 이 페이지의 메타 태그를 정의
export const meta: MetaFunction = () => {
  return [{ title: '코블록스 - 공지사항' }, { name: 'description', content: '코블록스의 새로운 소식을 확인하세요!' }];
};

type LoaderData = {
  notices: Notice[];
};

// UI
export default function IntroCarouselRoute(): JSX.Element {
  const { notices } = useLoaderData<LoaderData>(); // 로더에서 가져온 공지사항 데이터

  console.log('컴포넌트가 받은 데이터 (notices):', notices); //test

  // 캐러셀에 전달할 아이템 배열 생성
  const carouselItems: CarouselItem[] =
    notices?.map((notice) => {
      return {
        id: notice.notice_id,
        title: notice.notice_name,
        content: notice.notice_content,
      };
    }) || [];

  const options = { loop: true }; // 작동 방식 (무한 반복)

  return (
    <div
      className='
        flex
        flex-col
        items-center
        justify-center
        rounded-lg
        bg-gradient-to-br
        from-blue-100
        to-indigo-100
        p-4
        shadow-xl
      '
    >
      <div className='w-full max-w-xl'>
        {/* Carousel.tsx 컴포넌트 위치 */}
        <Carousel
          slides={carouselItems}
          options={options}
        />
      </div>
      <p className='mt-8 text-gray-600'>위 캐러셀은 `/intro/carousel` 경로에서 렌더링됩니다.</p>
    </div>
  );
}
