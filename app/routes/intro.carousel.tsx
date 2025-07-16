//app/routes/intro/carousel

import Carousel, { type CarouselItem } from '../components/Carousel';

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

// 이 컴포넌트가 '/intro/carousel' 경로로 접근했을 때 <Outlet />에 렌더링
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
