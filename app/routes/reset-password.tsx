import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 또는 '@remix-run/react'
import { supabase } from '~/utils/supabase.client'; // 실제 supabase 클라이언트

// UI 컴포넌트 (shadcn/ui 기준)
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  // 1. 상태 관리를 더 간결하게 변경
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    // (추가적인 비밀번호 복잡도 검사도 여기에 추가)

    setLoading(true);
    setError(null);

    try {
      // 2. updateUser 로직은 동일
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err: unknown) {
      setError('비밀번호 변경 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 3. UI를 shadcn/ui와 Tailwind CSS로 변경
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">비밀번호 재설정</h2>
        
        {success ? (
          <div className="p-4 text-sm text-green-700 bg-green-100 rounded-md">
            <p>비밀번호가 성공적으로 변경되었습니다. 잠시 후 로그인 페이지로 이동합니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>
            )}
            
            <div>
              <Label htmlFor="new-password">새 비밀번호</Label>
              <Input
                id="new-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1"
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? '변경 중...' : '비밀번호 변경'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}