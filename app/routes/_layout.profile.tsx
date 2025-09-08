import { useState, useEffect } from 'react';
import { useNavigate } from '@remix-run/react';
import { supabase } from '~/utils/supabase.client';
import type { User } from '@supabase/supabase-js';

// UI 컴포넌트 임포트
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Separator } from '~/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 닉네임 변경 상태
  const [name, setName] = useState('');
  const [isNameLoading, setIsNameLoading] = useState(false);
  const [nameMessage, setNameMessage] = useState({ type: '', text: '' });

  // 비밀번호 변경 상태
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // 회원 탈퇴 상태
  const [isWithdrawLoading, setIsWithdrawLoading] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

// 페이지 로드 시 사용자가 로그인했는지 확인하고, 필요한 정보를 가져오는 역할을 합니다.
useEffect(() => {
  // Supabase에 현재 사용자의 로그인 정보(세션)를 비동기적으로 요청합니다.
  supabase.auth.getSession().then(({ data: { session } }) => {
    
    // 만약 유효한 세션과 사용자 정보가 있다면 (즉, 로그인 상태라면),
    if (session?.user) {
      // 'user' 상태 변수에 받아온 사용자 정보를 저장합니다.
      setUser(session.user);
      // 'name' 상태 변수에 Supabase의 user_metadata에 저장된 이름을 채워넣습니다.
      // user_metadata.name 값이 없을 경우(null 또는 undefined)를 대비해 빈 문자열('')을 기본값으로 사용합니다.
      setName(session.user.user_metadata.name || '');
      // 데이터 로딩이 완료되었으므로, 로딩 상태를 false로 변경하여 페이지 내용을 보여줍니다.
      setIsLoading(false);
    } else {
      // 만약 로그인 정보가 없다면, 사용자를 로그인 페이지로 강제로 보냅니다.
      navigate('/login');
    }
  });
  // [navigate] : navigate 함수가 변경될 때마다 이 로직을 다시 실행하도록 설정합니다.
  // (Remix에서는 일반적으로 변경되지 않으므로, 이 useEffect는 처음에 한 번만 실행됩니다.)
}, [navigate]);

// '닉네임 변경' 폼(form)이 제출(submit)될 때 실행될 함수입니다.
const handleNameUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
  // 폼의 기본 제출 동작(페이지가 새로고침되는 현상)을 막습니다.
  e.preventDefault();
  // '변경 중...' 같은 로딩 표시를 위해 로딩 상태를 true로 설정합니다.
  setIsNameLoading(true);
  // 이전에 표시되었을 수 있는 성공/실패 메시지를 초기화합니다.
  setNameMessage({ type: '', text: '' });

  // Supabase Auth 시스템에 현재 로그인된 사용자의 정보를 업데이트하라고 요청합니다.
  // data 객체에 담긴 내용이 Supabase의 user_metadata 필드에 JSON 형태로 저장됩니다.
  const { error } = await supabase.auth.updateUser({
    data: { name: name } // 'name' 상태 변수에 저장된 새로운 닉네임 값을 보냅니다.
  });

  if (error) { // 만약 Supabase로부터 에러를 받았다면,
    // 에러 메시지를 상태에 저장하여 화면에 표시하도록 합니다.
    setNameMessage({ type: 'error', text: '닉네-임 변경 중 오류가 발생했습니다.' });
  } else { // 에러 없이 성공했다면,
    // 성공 메시지를 상태에 저장합니다.
    setNameMessage({ type: 'success', text: '닉네임이 성공적으로 변경되었습니다.' });
  }
  // 작업이 성공하든 실패하든, 로딩 상태를 다시 false로 변경하여 버튼을 활성화합니다.
  setIsNameLoading(false);
};

// '비밀번호 변경' 폼이 제출될 때 실행될 함수입니다.
const handlePasswordUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setPasswordMessage({ type: '', text: '' });

  // '새 비밀번호'와 '새 비밀번호 확인' 값이 일치하는지 확인합니다.
  if (password !== confirmPassword) {
    setPasswordMessage({ type: 'error', text: '비밀번호가 일치하지 않습니다.' });
    return; // 일치하지 않으면 여기서 함수 실행을 중단합니다.
  }
  // 비밀번호가 최소 8자 이상인지 확인합니다.
  if (password.length < 8) {
    setPasswordMessage({ type: 'error', text: '비밀번호는 8자 이상이어야 합니다.' });
    return; // 조건을 만족하지 않으면 함수 실행을 중단합니다.
  }

  setIsPasswordLoading(true); // 로딩 상태를 켭니다.
  // Supabase Auth 시스템에 비밀번호를 업데이트하라고 요청합니다.
  // 이 작업은 Supabase가 안전하게 처리합니다.
  const { error } = await supabase.auth.updateUser({ password });
  
  if (error) {
    setPasswordMessage({ type: 'error', text: '오류가 발생했습니다. 다시 시도해주세요.' });
  } else {
    setPasswordMessage({ type: 'success', text: '비밀번호가 성공적으로 변경되었습니다.' });
    // 보안을 위해, 성공 후에는 입력 필드에 있던 비밀번호 값을 지워줍니다.
    setPassword('');
    setConfirmPassword('');
  }
  setIsPasswordLoading(false); // 로딩 상태를 끕니다.
};

// '계정 삭제' 버튼의 최종 확인을 눌렀을 때 실행될 함수입니다.
const handleWithdrawal = async () => {
  setIsWithdrawLoading(true);
  setWithdrawError('');

  // 우리 앱 내부의 서버 API인 '/api/withdraw'에 POST 요청을 보냅니다.
  // 이 요청은 서버에서만 실행되는 api.withdraw.ts 파일이 안전하게 처리합니다.
  const response = await fetch('/api/withdraw', { method: 'POST' });

  // 서버로부터 받은 응답이 성공적인지(HTTP 상태 코드가 200-299) 확인합니다.
  if (response.ok) {
    // 서버에서 계정 삭제가 성공했으므로, 클라이언트에서도 로그아웃 처리를 합니다.
    await supabase.auth.signOut();
    // 사용자를 메인 페이지로 보냅니다.
    navigate('/');
  } else {
    // 서버에서 오류가 발생했다면, 응답에 포함된 에러 메시지를 읽습니다.
    const result = await response.json();
    // 읽어온 에러 메시지를 상태에 저장하여 화면에 표시합니다.
    setWithdrawError(result.error || '회원 탈퇴 중 오류가 발생했습니다.');
  }
  setIsWithdrawLoading(false);
};

  if (isLoading) {
    return <div className="p-8">페이지를 불러오는 중...</div>;
  }

  return (
    <div className="container mx-auto max-w-2xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold mb-8">회원정보</h1>

      {/* --- 닉네임 변경 --- */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">닉네임 변경</h2>
        <form onSubmit={handleNameUpdate} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-500">이메일</Label>
            <Input id="email" type="email" value={user?.email || ''} disabled className="mt-1 bg-gray-100" />
          </div>
          <div>
            <Label htmlFor="name">닉네임</Label>
            <Input id="name" type="text" value={name} onChange={(e) => {setName(e.target.value)}} required className="mt-1" />
          </div>
          {nameMessage.text && (
            <p className={`text-sm ${nameMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {nameMessage.text}
            </p>
          )}
          <Button type="submit" disabled={isNameLoading}>{isNameLoading ? '변경 중...' : '닉네임 변경'}</Button>
        </form>
      </section>

      <Separator />

      {/* --- 비밀번호 변경 --- */}
      <section className="my-10">
        <h2 className="text-xl font-semibold mb-4">비밀번호 변경</h2>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <Label htmlFor="new-password">새 비밀번호</Label>
            <Input id="new-password" type="password" value={password} onChange={e => {setPassword(e.target.value)}} required className="mt-1" placeholder="8자 이상 입력" />
          </div>
          <div>
            <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={e => {setConfirmPassword(e.target.value)}} required className="mt-1" />
          </div>
          {passwordMessage.text && (
            <p className={`text-sm ${passwordMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
              {passwordMessage.text}
            </p>
          )}
          <Button type="submit" disabled={isPasswordLoading}>{isPasswordLoading ? '변경 중...' : '비밀번호 변경'}</Button>
        </form>
      </section>

      <Separator />

      {/* --- 회원 탈퇴 --- */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-2">회원 탈퇴</h2>
        <p className="text-sm text-gray-600 mb-4">계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.</p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">계정 삭제</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>정말로 계정을 삭제하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                이 작업은 되돌릴 수 없으며, 사용자와 관련된 모든 데이터가 영구적으로 삭제됩니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>취소</AlertDialogCancel>
              <AlertDialogAction onClick={handleWithdrawal} disabled={isWithdrawLoading}>
                {isWithdrawLoading ? '삭제 중...' : '확인'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {withdrawError && <p className="mt-2 text-sm text-red-600">{withdrawError}</p>}
      </section>
    </div>
  );
}