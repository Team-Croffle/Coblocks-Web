import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps): JSX.Element {
  return (
    <main className='relative flex-grow bg-[linear-gradient(-5deg,rgb(202,244,255)_10%,rgb(160,222,255)_50%,rgb(90,178,255)_100%)]'>
      {/* 2. 페이지 콘텐츠(children)는 main 바로 아래에 위치시킵니다. */}
      <div className='relative z-10 mx-auto max-w-4xl px-4 py-12'>{children}</div>

      {/* 3. SVG 웨이브는 main을 기준으로 absolute 위치를 잡습니다. */}
      <div className='absolute bottom-0 left-0 hidden w-full overflow-hidden leading-none lg:block'>
        <svg
          className='relative block h-[230px] w-[calc(130%+1.3px)]'
          data-name='Layer 1'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 1200 120'
          preserveAspectRatio='none'
        >
          <path
            d='M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z'
            className='fill-white'
          />
        </svg>
      </div>
    </main>
  );
}
