import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { supabase } from '../utils/supabase.client';

function PlusIcon() {
  //새 강의실 개설 버튼에 사용될 플러스 아이콘 컴포넌트
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-5 h-5 mr-2'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M12 4.5v15m7.5-7.5h-15'
      />
    </svg>
  );
}

function EnterIcon() {
  //강의실 재접속 버튼에 사용될 입장 아이콘 컴포넌트
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      viewBox='0 0 24 24'
      strokeWidth={1.5}
      stroke='currentColor'
      className='w-5 h-5 mr-2'
    >
      <path
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9'
      />
    </svg>
  );
}

function ClassroomSetup() {
  const navigate = useNavigate();
  //현재 활성화된 탭 관리 개설 또는 재접속
  const [activeTab, setActiveTab] = useState<'create' | 'reconnect'>('create');
  //새로 생성할 강의실 이름 저장
  const [classroomName, setClassroomName] = useState('');
  //로딩 상태 관리
  const [loading, setLoading] = useState(false);
  //초대 코드 입력을 위한 상태
  const [inviteCode, setInviteCode] = useState('');

  // 토큰 가져오는 함수
  const getSupabaseAccessToken = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session) {
        return null;
      }
      return session.access_token;
    } catch (error) {
      console.error('토큰 가져오기 실패:', error);
      return null;
    }
  };

  // 사용자 정보 가져오는 함수
  const getCurrentUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        return null;
      }
      return user;
    } catch (error) {
      console.error('사용자 정보 가져오기 실패:', error);
      return null;
    }
  };

  // 랜덤 강의실 코드 생성 함수
  const generateClassroomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  //강의실 이름 공백 유무 검사 변수
  const isClassroomNameValid = classroomName.trim() !== '';

  //강의실 생성 핸들러
  const handleCreate = async () => {
    if (!isClassroomNameValid) {
      alert('강의실 이름을 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const token = await getSupabaseAccessToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const user = await getCurrentUser();
      if (!user) {
        alert('사용자 정보를 가져올 수 없습니다.');
        navigate('/login');
        return;
      }

      const classroomCode = generateClassroomCode();

      const { data, error } = await supabase.rpc('handle_create_classroom', {
        p_classroom_code: classroomCode,
        p_manager_users_id: user.id,
        p_classroom_name: classroomName,
      });

      if (error) {
        console.error('강의실 생성 오류:', error);
        alert('강의실 생성 중 오류가 발생했습니다.');
        return;
      }

      // 성공 시 강의실 정보 저장
      const classroomInfo = {
        classroom_id: data.classroom_id,
        classroom_code: data.classroom_code,
        manager_users_id: data.manager_users_id,
        classroom_name: data.classroom_name,
        isManager: true,
        joinedAt: new Date().toISOString(),
      };

      localStorage.setItem('classroom', JSON.stringify(classroomInfo));

      // 강의실 페이지로 이동
      navigate('/classroom');
    } catch (error) {
      console.error('강의실 생성 오류:', error);
      alert('강의실 생성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleReconnect = async () => {
    //재접속 버튼 클릭 시 방장 재접속
    setLoading(true);
    try {
      const token = await getSupabaseAccessToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.rpc('get_last_classroom');

      if (error || !data) {
        console.error('재접속 오류:', error);
        alert('이전 강의실을 찾을 수 없습니다.');
        return;
      }

      // 성공 시 강의실 정보 저장
      const classroomInfo = {
        classroom_id: data.classroom_id,
        classroom_code: data.classroom_code,
        manager_users_id: data.manager_users_id,
        classroom_name: data.classroom_name,
        isManager: data.is_manager,
        joinedAt: new Date().toISOString(),
      };

      localStorage.setItem('classroom', JSON.stringify(classroomInfo));

      // 강의실 페이지로 이동
      navigate('/classroom');
    } catch (error) {
      console.error('재접속 오류:', error);
      alert('재접속 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinWithCode = async () => {
    const trimmedCode = inviteCode.trim();
    if (!trimmedCode) {
      alert('초대 코드를 입력해주세요.');
      return;
    }

    setLoading(true);
    try {
      const token = await getSupabaseAccessToken();
      if (!token) {
        alert('로그인이 필요합니다.');
        navigate('/login');
        return;
      }

      const { data, error } = await supabase.rpc('join_classroom_by_code', {
        p_invite_code: trimmedCode.toUpperCase(),
      });

      if (error) {
        console.error('강의실 참여 오류:', error);
        alert('초대 코드가 올바르지 않거나 강의실을 찾을 수 없습니다.');
        return;
      }

      // 성공 시 강의실 정보 저장
      const classroomInfo = {
        classroom_id: data.classroom_id,
        classroom_code: data.classroom_code,
        manager_users_id: data.manager_users_id,
        classroom_name: data.classroom_name,
        isManager: false,
      };

      localStorage.setItem('classroom', JSON.stringify(classroomInfo));

      // 강의실 페이지로 이동
      navigate('/classroom');
    } catch (error) {
      console.error('강의실 참여 오류:', error);
      alert('강의실 참여 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
      setInviteCode(''); //입력 후 코드 초기화
    }
  };

  return (
    <div className='w-full max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 p-8'>
      <div className='flex justify-center border-b border-gray-200 mb-8'>
        <button
          onClick={() => {
            setActiveTab('create');
          }}
          className={`px-6 py-3 text-base font-semibold transition-colors duration-200 ${
            activeTab === 'create' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          강의실 개설
        </button>
        <button
          onClick={() => {
            setActiveTab('reconnect');
          }}
          className={`px-6 py-3 text-base font-semibold transition-colors duration-200 ${
            activeTab === 'reconnect' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          강의실 접속
        </button>
      </div>

      <div>
        {activeTab === 'create' ? (
          <div className='space-y-8'>
            <div>
              <label
                htmlFor='classroomName'
                className='block text-base font-semibold text-gray-700 mb-2'
              >
                강의실 이름
              </label>
              <input
                id='classroomName'
                type='text'
                value={classroomName}
                onChange={(e) => {
                  setClassroomName(e.target.value);
                }}
                placeholder='방 이름을 입력하세요'
                className='w-full px-4 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition'
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={loading || !isClassroomNameValid}
              className='w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all'
            >
              <PlusIcon />
              {loading ? '생성 중...' : '강의실 개설하기'}
            </button>
          </div>
        ) : (
          <div className='space-y-6'>
            <h3 className='text-xl font-bold text-gray-800 text-center'>초대 코드로 참여하기</h3>
            <div>
              <label
                htmlFor='inviteCode'
                className='block text-base font-semibold text-gray-700 mb-2'
              >
                초대 코드
              </label>
              <input
                id='inviteCode'
                type='text'
                value={inviteCode}
                onChange={(e) => {
                  setInviteCode(e.target.value);
                }}
                placeholder='초대 코드 또는 링크를 입력하세요'
                className='w-full px-4 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition'
              />
            </div>
            <button
              onClick={handleJoinWithCode}
              disabled={!inviteCode.trim()}
              className='w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-all'
            >
              <EnterIcon />
              접속하기
            </button>
            <div className='relative border-t border-gray-200 my-4'>
              <span className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500'>
                또는
              </span>
            </div>

            <button
              onClick={handleReconnect}
              className='w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-700 transition-colors'
            >
              재접속하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassroomSetup;
