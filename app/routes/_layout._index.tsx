import Carousel, { type CarouselItem } from '../components/Carousel'; // 캐러셀 컴포넌트 임포트
import type { MetaFunction } from '@remix-run/node'; // MetaFunction 임포트

// meta 함수: 이 페이지의 메타 태그를 정의합니다.
// 이 메타 정보는 부모 라우트 (_index.tsx)의 메타 정보와 병합됩니다.
export const meta: MetaFunction = () => {
  return [
    { title: '코블록스 - 핵심 기능' }, // 이 페이지의 구체적인 제목
    { name: 'description', content: '코블록스 플랫폼의 핵심 기능을 미리 볼 수 있습니다.' }, // 이 페이지의 구체적인 설명
  ];
};

// 캐러셀에 표시할 데이터 (예시)
const DUMMY_SLIDES: CarouselItem[] = [
  {
    id: 1,
    title: '블록코딩',
    content: '블록으로 코딩하세요.',
  },
  {
    id: 2,
    title: '협업코딩',
    content: '사용자들과 함께 코딩하세요.',
  },
  {
    id: 3,
    title: 'asdf',
    content: 'asdfgasdfasdf',
  },
  {
    id: 4,
    title: 'qwer',
    content: 'qwerqwerqwer',
  },
];

export default function IntroCarouselRoute(): JSX.Element {
  const options = { loop: true }; // 캐러셀에 전달할 옵션

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
      <h2 className='mb-6 text-3xl font-bold text-gray-800'>✨ 핵심 기능 미리보기 ✨</h2>
      <div className='w-full max-w-xl'>
        {/* Carousel.tsx 컴포넌트 위치 */}
        <Carousel
          slides={DUMMY_SLIDES}
          options={options}
        />
      </div>
      <p className='mt-8 text-gray-600'>위 캐러셀은 `/intro/carousel` 경로에서 렌더링됩니다.</p>
    </div>
  );
}
