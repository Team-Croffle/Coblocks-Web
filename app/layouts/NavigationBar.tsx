import { useEffect, useState } from 'react';
import { AiOutlineUser, AiFillHome } from 'react-icons/ai';
import { FaSchool } from 'react-icons/fa';
import { Link, useNavigate } from '@remix-run/react';
import mainLogo from '../assets/images/Logo/minilogo-bg-tp.png';

interface UserMetadata {
  email?: string;
  nickname?: string;
  [key: string]: unknown; // 다른 속성들도 허용
}

interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata: UserMetadata;
  [key: string]: unknown;
}

interface SupabaseSession {
  user: SupabaseUser;
  access_token: string;
  refresh_token: string;
  expires_at: number;
  expires_in: number;
  token_type: string;
  [key: string]: unknown; // 다른 속성들도 허용 (필요에 따라 더 구체화 가능)
}

// Supabase 인증 이벤트 타입 정의
type AuthChangeEvent = 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED' | 'USER_UPDATED' | 'PASSWORD_RECOVERY';

const supabase = {
  auth: {
    getSession: async () => {
      return { data: { session: null as SupabaseSession | null } }; // session 타입 명시
    },
    // onAuthStateChange의 첫 번째 매개변수 이름을 _event로 변경해 'defined but never used' 오류 방지
    // 콜백 함수를 인자로 받아 실제 Supabase처럼 호출하는 방식을 모의(mock)
    onAuthStateChange: (callback: (event: AuthChangeEvent, session: SupabaseSession | null) => void) => {
      // 실제 Supabase에서는 인증 상태 변경을 구독하고, 이벤트 발생 시 콜백을 호출합니다.
      // 여기서는 초기 상태를 시뮬레이션하기 위해 콜백을 한 번 호출합니다.
      callback('SIGNED_OUT', null); // 초기 상태를 '로그아웃'으로 가정하여 콜백 호출

      return {
        data: {
          subscription: {
            unsubscribe: () => {
              console.log('Auth subscription unsubscribed (mock)');
            },
          },
        },
      };
    },
    signOut: async () => {
      return { error: null };
    },
  },
};

function NavigationBar(): JSX.Element {
  const navigate = useNavigate();

  // 로그인 상태와 사용자 정보를 관리하는 상태 변수
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<SupabaseUser | null>(null); // SupabaseUser 또는 null 타입 명시
  // 모바일 햄버거 메뉴 확장 상태를 관리하는 상태 변수
  const [isNavbarExpanded, setIsNavbarExpanded] = useState<boolean>(false);

  // 컴포넌트가 마운트될 때, 그리고 인증 상태가 변경될 때 실행되는 효과 훅
  useEffect(() => {
    // 현재 로그인 세션을 확인하는 비동기 함수
    const checkSession = async (): Promise<void> => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session); // 세션이 있으면 로그인 상태를 true로 업데이트
      setUser(session?.user || null); // 사용자 정보 업데이트
    };

    checkSession(); // 컴포넌트 마운트 시 세션 확인

    // Supabase 인증 상태 변경을 구독
    // 사용자가 로그인하거나 로그아웃할 때마다 이 콜백 함수가 실행
    const {
      data: { subscription }, // 'data' 속성이 존재하도록 수정
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: SupabaseSession | null) => {
      // _event 매개변수 사용 (ESLint 경고 방지)
      setIsLoggedIn(!!session); // 세션 유무에 따라 로그인 상태 업데이트
      setUser(session?.user || null); // 사용자 정보 업데이트
    });

    // 컴포넌트가 언마운트될 때 인증 상태 구독을 해제
    return (): void => {
      subscription.unsubscribe();
    };
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut(); // Supabase 로그아웃 요청
    if (!error) {
      console.log('로그아웃 되셨습니다.'); // alert 대신 콘솔 로그 사용
      navigate('/'); // 홈 페이지로 이동
    } else {
      console.error('로그아웃 오류:', error);
      console.error('로그아웃 중 오류가 발생했습니다.'); // alert 대신 콘솔 로그 사용
    }
  };

  // 사용자 아이콘 클릭 시 로그인 상태에 따라 페이지 이동
  const handleUserClick = (): void => {
    if (!isLoggedIn) {
      navigate('/login'); // 로그인하지 않았다면 로그인 페이지로 이동
    }
  };

  // 회원 버튼 (로그인 상태에 따라 드롭다운 또는 로그인 버튼 표시)
  const memberBtn = (): JSX.Element => {
    if (isLoggedIn) {
      return (
        // 로그인 상태일 때 드롭다운 메뉴를 표시합니다.
        <div className='relative'>
          {' '}
          {/* 드롭다운 위치 지정을 위한 relative */}
          <button
            className='flex items-center justify-center p-2 border-2 border-white rounded-full text-white w-12 h-12 text-2xl hover:bg-white/20 transition-colors duration-200'
            onClick={(): void => {
              setIsNavbarExpanded(!isNavbarExpanded);
            }} // 화살표 함수 본문 블록으로 감쌈
            aria-expanded={isNavbarExpanded}
            aria-haspopup='true'
          >
            <AiOutlineUser /> {/* 사용자 아이콘 */}
          </button>
          {isNavbarExpanded && ( // isNavbarExpanded 상태에 따라 드롭다운 메뉴 표시
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50'>
              <div className='block px-4 py-2 text-sm text-gray-700 text-left whitespace-pre-wrap'>
                {user?.user_metadata?.email || '이메일 없음'}
                <br />
                {user?.user_metadata?.nickname || '닉네임 없음'}
              </div>
              <Link
                to='/profile'
                className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                회원정보
              </Link>
              <button
                onClick={handleLogout}
                className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
              >
                로그아웃 {/* t('nav.logout') 제거 */}
              </button>
            </div>
          )}
        </div>
      );
    }
    // 로그인 상태가 아닐 때 로그인 버튼을 표시합니다.
    return (
      <button
        className='flex items-center justify-center p-2 border-2 border-white rounded-full text-white w-12 h-12 text-2xl hover:bg-white/20 transition-colors duration-200'
        onClick={handleUserClick}
      >
        <AiOutlineUser /> {/* 사용자 아이콘 */}
      </button>
    );
  };

  return (
    <nav
      // Tailwind CSS
      // py-3: 상하 패딩
      className='shadow py-3 bg-[#5193d9] h-24 relative z-40' // 다른 요소 위에 표시
    >
      <div className='container mx-auto px-4 flex items-center justify-between h-full'>
        {' '}
        {/* 모바일 메뉴 토글 버튼 */}
        <button
          className='lg:hidden text-white text-3xl focus:outline-none' // 큰 화면에서는 숨김
          onClick={(): void => {
            setIsNavbarExpanded(!isNavbarExpanded);
          }}
          aria-controls='basic-navbar-nav'
          aria-expanded={isNavbarExpanded}
        >
          &#9776; {/* 메뉴 토글 */}
        </button>
        {/* 로고 영역 */}
        <Link
          to='/'
          className='flex-shrink-0 text-white rounded px-2 py-1 mr-3'
        >
          <img
            src={mainLogo}
            alt='Logo'
            className='h-16' // 로고 크기 설정
          />
        </Link>
        {/* 모바일에서만 보이는 회원 버튼 */}
        <div className='lg:hidden'>{memberBtn()}</div>
        {/* 네비게이션 메뉴 (모바일에서는 숨겨지고, 메뉴 클릭 시 토글) */}
        <div
          id='basic-navbar-nav'
          className={`lg:flex lg:flex-grow lg:items-center lg:justify-between ${
            isNavbarExpanded
              ? 'block absolute top-24 left-0 w-full bg-[#5193d9] shadow-lg py-4 lg:relative lg:top-auto lg:shadow-none lg:py-0'
              : 'hidden'
          }`}
          // 모바일에서 확장 시 전체 너비, 배경색, 그림자 추가
        >
          <div className='flex flex-col lg:flex-row lg:ml-auto'>
            {' '}
            <Link
              to='/'
              className='text-white rounded px-3 py-2 mr-2 flex items-center border-2 border-white rounded-md hover:bg-white/20 transition-colors duration-200 mb-2 lg:mb-0' // 모바일에서 마진 추가
              onClick={(): void => {
                setIsNavbarExpanded(false);
              }} // 화살표 함수 본문 블록으로 감쌈
            >
              <AiFillHome className='text-xl mr-1' /> 홈
            </Link>
            <Link
              to='/classroomSetup'
              className='text-white rounded px-3 py-2 mr-2 flex items-center border-2 border-white rounded-md hover:bg-white/20 transition-colors duration-200'
              onClick={(): void => {
                setIsNavbarExpanded(false);
              }} // 화살표 함수 본문 블록으로 감쌈
            >
              <FaSchool className='text-xl mr-1' />
              강의실
            </Link>
          </div>

          {/* 데스크탑에서만 보이는 회원 버튼 (메뉴 오른쪽) */}
          <div className='hidden lg:flex items-center ml-auto'>{memberBtn()}</div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
