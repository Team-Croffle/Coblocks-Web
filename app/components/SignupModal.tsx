import { useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { supabase } from '~/lib/supabase.mock';
import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';

export default function SignupModal() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { data: { name: formData.name } },
    });
    if (error) {
      setError(error.message.includes('User already registered') ? '이미 가입된 이메일입니다.' : '회원가입 중 오류가 발생했습니다.');
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  return (
    <Dialog onOpenChange={(isOpen) => { if (!isOpen) { setSuccess(false); setError(null); } }}>
      <DialogTrigger asChild>
        <button className="font-medium text-blue-600 hover:underline">회원가입</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>회원가입</DialogTitle>
          <DialogDescription>
            새 계정을 만들기 위해 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="mt-4 text-center">
            <p className="p-4 text-sm text-green-700 bg-green-100 rounded-md">회원가입 요청이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.</p>
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
              <Label htmlFor="name">이름 (닉네임)</Label>
              <Input name="name" id="name" type="text" required placeholder="홍길동" onChange={handleChange} />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">이메일</Label>
              <Input name="email" id="email" type="email" required placeholder="email@example.com" onChange={handleChange} />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">비밀번호</Label>
              <Input name="password" id="password" type="password" required onChange={handleChange} />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="confirmPassword">비밀번호 확인</Label>
              <Input name="confirmPassword" id="confirmPassword" type="password" required onChange={handleChange} />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={loading}>{loading ? '가입 처리 중...' : '회원가입'}</Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}