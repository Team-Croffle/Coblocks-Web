import { useState } from 'react';
import { json, redirect } from '@remix-run/node';
import { useNavigate} from '@remix-run/react';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';

// 서버용 Supabase 클라이언트 생성 함수
import { createSupabaseServerClient } from '~/utils/supabase.server';
// 브라우저용 Supabase 클라이언트
import { supabase } from '~/utils/supabase.client';

// UI 컴포넌트 및 에셋
import { Button } from '~/components/ui/button';
import SignupModal from '~/components/SignupModal';
import ForgotPasswordModal from '~/components/ForgotPasswordModal';
import mainLogo from '~/assets/images/Logo/mainlogo-bg-tp.png';

// --- 페이지 정보 설정 ---
export const meta: MetaFunction = () => {
  return [
    { title: '코블록스 - 로그인' },
    { name: 'description', content: '코블록스에 로그인하여 학습을 시작하세요.' },
  ];
};

// --- 서버 측 로직: 페이지 로딩 전 실행 ---
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, response } = createSupabaseServerClient({ request });
  const { data: { session } } = await supabase.auth.getSession();

  if (session) {
    return redirect('/', { headers: response.headers });
  }

  return json(null, { headers: response.headers });
};

// --- 브라우저 측 UI 및 로직 ---
export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      navigate('/');

    } catch (err: unknown) {
      let errorMessage = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
      if (err instanceof Error && err.message.includes('Invalid login credentials')) {
        errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
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
                <ForgotPasswordModal />
              </div>
            </div>
            <div>
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm text-gray-600 mt-4">
            계정이 없으신가요?{' '}
            <SignupModal />
          </div>
        </div>
      </div>
    </div>
  );
}