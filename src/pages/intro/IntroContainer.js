import React from 'react';
import { Button } from 'react-bootstrap';
import IntroCarousel from './IntroCarousel';
import styles from './IntroContainer.module.css';

const IntroContainer = () => {
  return (
    <div>
      <div className={`${styles.intro} py-3 position-relative`}>
        <div className='introContainer position-relative mt-5 mx-auto'>
          <section className='introSection d-flex flex-column align-items-center'>
            <div className='introContent text-center text-white'>
              <p className='introParagraph fs-2 lh-base user-select-none'>
                <span className='text-decoration-underline'>코딩</span>, 이제 블록으로 즐겁게 시작하세요!
                <br />
                코블록스는 코딩 입문자를 위한 쉽고 재미있는 블록 코딩 테스트 플랫폼입니다.
                <br />
                코딩의 기초를 탄탄하게 다지고, 창의력을 마음껏 펼쳐보세요. 코블록스는 여러분의 코딩 여정을 응원합니다.
              </p>
            </div>
          </section>
          <section className='introCarousel'>
            <IntroCarousel />
          </section>
          <div className='introBtnContainer d-flex justify-content-center gap-2 m-4'>
            <Button variant='light' size='lg'>
              시작하기
            </Button>
            <Button variant='light' size='lg'>
              문의하기
            </Button>
          </div>
          <div className='introAddContainer text-center text-black fs-5 lh-base user-select-none'>
            <h3 className='introAddTitle'>그리고...</h3>
            <p className='introAddParagraph'>
              코블록스는 교육 기관 및 코딩 학습 단체와 협력하여 코딩 교육 활성화에 기여하고 있습니다.
              <br />
              코블록스는 지속적인 업데이트를 통해 새로운 기능과 콘텐츠를 제공할 예정입니다.
            </p>
          </div>
        </div>
        <div className={styles.introDivider}>
          <svg
            className='styles.svg'
            data-name='Layer 1'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 1200 120'
            preserveAspectRatio='none'
          >
            <path
              d='M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z'
              className={styles.shapeFill}
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default IntroContainer;
