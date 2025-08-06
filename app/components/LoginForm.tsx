import React, { useState } from 'react';
import { useNavigate} from '@remix-run/react';
import { supabase } from '../src/lib/supabase';
import mainLogo from '~/assets/images/Logo/mainlogo-bg-tp.png';
import SignupModal from '~/components/SignupModal';
import ForgotPasswordModal from '~/components/ForgotPasswordModal';


// 로그인 페이지의 전체 UI와 기능을 담당하는 메인 컴포넌트
export default function LoginPage() {
  const navigate = useNavigate();// 페이지 이동(네비게이션) 기능을 사용하기 위한 Remix 훅
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // API 요청 중 로딩 상태를 관리하는 상태 (true/false)
  const [error, setError] = useState<string | null>(null);// 로그인 실패 시 에러 메시지를 저장하는 상태

  const [isSignupModalOpen, setSignupModalOpen] = useState(false);// 회원가입 모달의 열림/닫힘을 관리하는 상태
  const [isForgotModalOpen, setForgotModalOpen] = useState(false);// 비밀번호 찾기 모달의 열림/닫힘을 관리하는 상태

  // 사용자가 로그인 폼을 제출할 때(로그인 버튼 클릭 시) 실행되는 함수
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 폼 제출 시 발생하는 페이지 새로고침을 막음.
    setLoading(true);       //로딩 상태를 활성화
    setError(null);         // 이전 에러 메시지를 비웁.
    try {
      // Supabase에 이메일/비밀번호로 로그인을 요청
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;// 에러가 있으면 catch 블록으로 보냅
      alert('로그인 성공!');
      navigate('/');// 성공 시 메인 페이지로 이동
    } catch (err) {// 실패 시 에러 메시지 설정
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    } finally {// 요청이 끝나면 로딩 상태를 비활성화
      setLoading(false);
    }
  };

  return (
    <>
        <div className="flex w-full max-w-5xl overflow-hidden rounded-lg shadow-lg">
          <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500 p-12 text-white lg:flex">
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold">다시 오신 것을<br/>환영합니다!</h1>
              <p className="text-lg">사이트의 다양한 기능을 탐색하고 코딩 실력을 향상시켜 보세요.</p>
            </div>
          </div>

          <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
            <div className="w-full max-w-md">
              <div className="mb-8 text-center">
                <img src={mainLogo} alt="Logo" className="mx-auto h-40" />
              </div>
              {error && <div className="mb-4 rounded-md bg-red-100 p-3 text-center text-sm text-red-700">{error}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-8 rounded-lg bg-gray-50 p-6">
                  <div className="relative">
                    <input id="email" type="email" required value={email} onChange={(e) => {setEmail(e.target.value)}} placeholder="이메일 주소" className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-2.5 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-0"/>
                    <label htmlFor="email" className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-7 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-3 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-blue-600">이메일 주소</label>
                  </div>
                  <div className="relative">
                    <input id="password" type="password" required value={password} onChange={(e) => {setPassword(e.target.value)}} placeholder="비밀번호" className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-2.5 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-0"/>
                    <label htmlFor="password" className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-7 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-3 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-blue-600">비밀번호</label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">정보 저장</label>
                  </div>
                  <div className="text-sm">
                    <button type="button" onClick={() => {setForgotModalOpen(true)}} className="bg-transparent font-medium text-blue-600 hover:text-blue-500">
                      비밀번호를 잊으셨나요?
                    </button>
                  </div>
                </div>

                <div>
                  <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed">
                    {loading ? '로그인 중...' : '로그인'}
                  </button>
                </div>
              </form>

              <div className="text-center text-sm text-gray-600 mt-4">
                계정이 없으신가요?{' '}
                <button type="button" onClick={() => {setSignupModalOpen(true)}} className="font-medium text-blue-600 hover:underline">
                  회원가입
                </button>
              </div>
            </div>
          </div>
        </div>

      <SignupModal isOpen={isSignupModalOpen} onClose={() => {setSignupModalOpen(false)}} />
      <ForgotPasswordModal isOpen={isForgotModalOpen} onClose={() => {setForgotModalOpen(false)}} />
    </>
  );
}