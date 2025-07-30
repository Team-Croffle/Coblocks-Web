import React, { useState } from 'react';
import mainLogo from '../assets/images/Logo/mainlogo-bg-tp.png';

function LoginPage() {
  // 로직 부분
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('로그인 정보:', { email, password });
    alert(`로그인 시도: ${email}`);
  };

  // --- UI 부분 ---
  return (
    // 전체 화면을 차지하고, 로그인 카드를 중앙에 배치하는 역할.
      <div className="flex w-full max-w-5xl overflow-hidden rounded-lg shadow-lg transition-shadow duration-300 ease-in-out hover:shadow-2xl">
        
        {/* 왼쪽 패널 - 환영 메시지 */}
        <div className="hidden w-1/2 items-center justify-center bg-gradient-to-br from-blue-600 to-cyan-500 p-12 text-white lg:flex
          bg-size-200 bg-gradient-to-r animate-gradient-move">
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold">다시 오신 것을</h1>
             <h1 className="mb-4 text-4xl font-bold">환영합니다!</h1>
             <br></br>
            <p className="text-lg">사이트의 다양한 기능을 탐색하고 코딩 실력을 향상시켜 보세요.</p>
          </div>
        </div>

        {/* 오른쪽 패널 - 로그인 폼 */}
        <div className="flex w-full items-center justify-center bg-white p-8 lg:w-1/2">
          <div className="w-full max-w-md">
            
            <div className="mb-8 text-center">
              <img src={mainLogo} alt="Logo" className="mx-auto h-40" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8"> {/* 간격을 조금 더 줌 */}

              {/* 섹션 2: 이메일, 비밀번호 입력 필드 그룹 */}
              <div className="space-y-8 rounded-lg bg-gray-50 p-6">
                
                {/* 이메일 입력창 */}
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                    className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-2.5 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder="이메일 주소"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-7 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-3 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-blue-600"
                  >
                    이메일 주소
                  </label>
                </div>
                
                {/* 비밀번호 입력창 */}
                <div className="relative">
                   <input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                    className="peer block w-full appearance-none rounded-md border border-gray-300 bg-transparent px-3 py-2.5 text-gray-900 placeholder-transparent focus:border-blue-600 focus:outline-none focus:ring-0"
                    placeholder="비밀번호"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-3 top-2.5 z-10 origin-[0] -translate-y-7 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-3 peer-focus:-translate-y-7 peer-focus:scale-75 peer-focus:text-blue-600"
                  >
                    비밀번호
                  </label>
                </div>
              </div>

              {/* 정보 저장 및 비밀번호 찾기 링크 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    정보 저장
                  </label>
                </div>
                <div className="text-sm">
                    <button type="button" className="bg-transparent font-medium text-blue-600 hover:text-blue-500">
                        비밀번호를 잊으셨나요?
                    </button>
                </div>
              </div>

              {/* 섹션 3: 로그인 버튼 */}
              <div>
                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600 py-3 px-4 font-semibold text-white shadow-sm transition-transform duration-150 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:scale-95"
                >
                  로그인
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

export default LoginPage;