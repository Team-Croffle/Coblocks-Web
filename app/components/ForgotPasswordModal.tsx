import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { supabase } from '~/utils/supabase.client';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export default function ForgotPasswordModal() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // 1. Supabase에 비밀번호 재설정 이메일(resetPasswordForEmail) 요청
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // 2. 사용자가 이메일 링크를 클릭했을 때 이동할 우리 웹사이트 페이지 주소
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }

    setSuccess(true);

  } catch (err: unknown) {
    setError('비밀번호 재설정 이메일 전송에 실패했습니다.');
  } finally {
    setLoading(false);
  }
};
  
  return (
    <Dialog onOpenChange={(isOpen) => { if (!isOpen) { setSuccess(false); setError(null); } }}>
      <DialogTrigger asChild>
        <button className="bg-transparent font-medium text-blue-600 hover:text-blue-500">
          비밀번호를 잊으셨나요?
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>비밀번호 찾기</DialogTitle>
          <DialogDescription>가입 시 사용한 이메일을 입력하시면 재설정 링크를 보내드립니다.</DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="mt-4 text-center">
            <p className="p-4 text-sm text-green-700 bg-green-100 rounded-md">비밀번호 재설정 링크를 이메일로 보냈습니다.</p>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary">닫기</Button>
              </DialogClose>
            </DialogFooter>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {error && <p className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>}
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email-forgot">이메일</Label>
              <Input type="email" id="email-forgot" required placeholder="email@example.com" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => {setEmail(e.target.value)}} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>{loading ? '전송 중...' : '재설정 링크 받기'}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}