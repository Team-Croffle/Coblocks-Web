import { Link } from '@remix-run/react';

export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='bg-black text-white py-2 text-sm z-50'>
      <div className='container mx-auto px-4 text-center'>
        <div className='flex flex-col items-center justify-center space-y-1 md:space-y-0 md:flex-row md:space-x-4'>
          <p className='mb-0'>
            <strong className='whitespace-nowrap'>Create by Team.Croffle</strong>
            <span className='hidden md:inline'> | </span>
            <Link
              to='/developer-info'
              className='text-white underline hover:no-underline whitespace-nowrap'
            >
              팀원소개
            </Link>
            <span className='hidden md:inline'> | </span>
            <strong className='whitespace-nowrap'>이메일:</strong> croffledev@gmail.com
            <span className='hidden md:inline'> | </span>
            <strong className='whitespace-nowrap'>학교:</strong>{' '}
            <a
              href='https://www.wku.ac.kr/'
              target='_blank'
              rel='noopener noreferrer'
              className='text-white underline hover:no-underline whitespace-nowrap'
            >
              원광대학교
            </a>
            <span className='hidden md:inline'> | </span>
            <strong className='whitespace-nowrap'>학과:</strong> 컴퓨터소프트웨어공학과
            <span className='hidden md:inline'> | </span>
            <strong className='whitespace-nowrap'>주소:</strong> 전북특별자치도 익산시 익산대로 460
          </p>
        </div>
        <div className='mt-1'>
          <small>&copy; {currentYear} Coblocks. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
}
