import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { supabase } from '../src/lib/supabase';

// 부모 컴포넌트(LoginPage)로부터 받을 props(속성)의 타입 정의
interface ModalProps {
  isOpen: boolean; //모달의 open 여부
  onClose: () => void; //모달 colse 함수
}

export default function SignupModal({ isOpen, onClose }: ModalProps) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  //입력창의 값이 바뀔 때 마다 formData상태 업데이트 함수
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { name, password, confirmPassword } = formData;
    if (name.length < 3 || name.length > 20) throw new Error('이름(닉네임)은 3자 이상, 20자 이하로 입력해주세요.');
    if (!/^[a-zA-Z0-9가-힣]+$/.test(name)) throw new Error('이름(닉네임)은 한글, 영문, 숫자만 사용할 수 있습니다.');
    if (password.length < 8) throw new Error('비밀번호는 최소 8자 이상이어야 합니다.');
    if (!/[A-Z]/.test(password)) throw new Error('비밀번호는 최소 하나의 대문자를 포함해야 합니다.');
    if (!/[a-z]/.test(password)) throw new Error('비밀번호는 최소 하나의 소문자를 포함해야 합니다.');
    if (!/[0-9]/.test(password)) throw new Error('비밀번호는 최소 하나의 숫자를 포함해야 합니다.');
    if (!/[!@#$%^&*]/.test(password)) throw new Error('비밀번호는 최소 하나의 특수문자(!@#$%^&*)를 포함해야 합니다.');
    if (password !== confirmPassword) throw new Error('비밀번호가 일치하지 않습니다.');
  };

   //회원가입 버튼 클릭시 동작 함수
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); //페이지 새로고침 방지
    setLoading(true);
    setError(null);

    try {
      validateForm();
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { name: formData.name } },
      });
      if (signUpError) throw signUpError;
      setSuccess(true);
    } catch (err: unknown) { //1번 에러 수정
      if (err instanceof Error) {
        if (err.message.includes('User already registered')) {
          setError('이미 가입된 이메일입니다.');
        } else {
          setError(err.message);
        }
      } else {
        setError('알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', password: '', confirmPassword: '' });
    setError(null);
    setSuccess(false);
    setLoading(false);
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={handleClose}> {/* 👈 2번 에러 수정 */}
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">회원가입</Dialog.Title>
                {success ? (
                  <div className="mt-4 text-center">
                    <p className="rounded-md bg-green-100 p-4 text-sm text-green-700">회원가입 요청이 완료되었습니다. 이메일을 확인하여 계정을 활성화해주세요.</p>
                    <button onClick={handleClose} className="mt-4 w-full justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none"> {/* 👈 2번 에러 수정 */}
                      닫기
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {error && <p className="rounded-md bg-red-100 p-3 text-sm text-red-700">{error}</p>}
                    <input name="name" type="text" required placeholder="이름 (닉네임)" value={formData.name} onChange={handleChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"/>
                    <input name="email" type="email" required placeholder="이메일 주소" value={formData.email} onChange={handleChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"/>
                    <input name="password" type="password" required placeholder="비밀번호" value={formData.password} onChange={handleChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"/>
                    <input name="confirmPassword" type="password" required placeholder="비밀번호 확인" value={formData.confirmPassword} onChange={handleChange} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-blue-500"/>
                    <div className="pt-2">
                      <button type="submit" disabled={loading} className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400">
                        {loading ? '가입 처리 중...' : '회원가입'}
                      </button>
                    </div>
                  </form>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}