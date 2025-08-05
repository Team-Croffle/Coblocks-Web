import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { supabase } from '../src/lib/supabase';

// 부모 컴포넌트(LoginPage)로부터 받을 props(속성)의 타입 정의
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose }: ModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  //재설정 링크 받기 버튼 클릭시 실행
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    //supabase에 비밀번호 재설정 이메일 발송 요청
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`, //이메일 링크 클릭 시 이동할 페이지 주소
    });
    if (error) setError(error.message);//실패
    else setSuccess(true);//성공
    setLoading(false);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-20" onClose={onClose}>
        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">비밀번호 찾기</Dialog.Title>
                {success ? (
                  <div className="mt-4 text-center">
                    <p className="p-4 text-sm text-green-700 bg-green-100 rounded-md">비밀번호 재설정 링크를 이메일로 보냈습니다. 이메일을 확인해주세요.</p>
                    <button onClick={onClose} className="mt-4 w-full justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none">닫기</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    {error && <p className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>}
                    <p className="text-sm text-gray-500">가입 시 사용한 이메일을 입력하시면 비밀번호 재설정 링크를 보내드립니다.</p>
                    <input type="email" required placeholder="이메일 주소" value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => {setEmail(e.target.value)}} className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
                    <div className="pt-2">
                      <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed">{loading ? '전송 중...' : '재설정 링크 받기'}</button>
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