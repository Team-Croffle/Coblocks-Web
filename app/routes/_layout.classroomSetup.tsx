import type { ActionFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, useNavigation } from '@remix-run/react';
import { useState } from 'react';

// --- 외부 파일 임포트 ---
import Classroom from '~/models/Classroom';
import { createSupabaseServerClient, getUserId } from '~/utils/supabase.server';

// --- 서버 로직 (백엔드) ---
export const action = async ({ request }: ActionFunctionArgs) => {
  const { supabase } = createSupabaseServerClient({ request });
  const formData = await request.formData();
  const actionType = formData.get('actionType');

  const userId = await getUserId(request);
  if (!userId) {
    return json({ error: '인증이 필요합니다.' }, { status: 401 });
  }

  if (actionType === 'create') {
    const classroomName = formData.get('classroomName');
    if (typeof classroomName !== 'string' || !classroomName) {
      return json({ error: '강의실 이름이 필요합니다.' }, { status: 400 });
    }
    try {
      const newClassroom = await Classroom.create(supabase, userId, classroomName);
      return redirect(`/classroom/${newClassroom.classroom_code}`);
    } catch (error) {
      console.error(error);
      return json({ error: '강의실 생성에 실패했습니다.' }, { status: 500 });
    }
  }

  else if (actionType === 'join') {
    const inviteCode = formData.get('inviteCode');
    if (typeof inviteCode !== 'string' || !inviteCode) {
      return json({ error: '초대 코드가 필요합니다.' }, { status: 400 });
    }
    try {
      const classroom = await Classroom.findByCode(supabase, inviteCode);
      if (!classroom) {
        return json({ error: '유효하지 않은 초대 코드입니다.' }, { status: 404 });
      }
      return redirect(`/classroom/${classroom.classroom_code}`);
    } catch (error) {
      console.error(error);
      return json({ error: '강의실 접속에 실패했습니다.' }, { status: 500 });
    }
  }

  else if (actionType === 'reconnect') {
    try {
      const existingClassroom = await Classroom.findByManager(supabase, userId);
      if (existingClassroom) {
        return redirect(`/classroom/${existingClassroom.classroom_code}`);
      }
      return json({ error: '재접속할 수 있는 강의실이 없습니다.' }, { status: 404 });
    } catch (error) {
      console.error(error);
      return json({ error: '강의실 재접속에 실패했습니다.' }, { status: 500 });
    }
  }

  return json({ error: '알 수 없는 요청입니다.' }, { status: 400 });
};

// --- UI 아이콘 컴포넌트 ---
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function EnterIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}

// --- 메인 페이지 컴포넌트 (프론트엔드) ---
export default function ClassroomSetupRoute() {
  const navigation = useNavigation();
  const loading = navigation.state === 'submitting';

  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [classroomName, setClassroomName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const isClassroomNameValid = classroomName.trim() !== '';

  return (
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-gray-200 p-8">
        <div className="flex justify-center border-b border-gray-200 mb-8">
          <button
            onClick={() => {setActiveTab('create')}}
            className={`px-6 py-3 text-base font-semibold transition-colors duration-200 ${
              activeTab === 'create' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            강의실 개설
          </button>
          <button
            onClick={() => {setActiveTab('join')}}
            className={`px-6 py-3 text-base font-semibold transition-colors duration-200 ${
              activeTab === 'join' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-blue-500'
            }`}
          >
            강의실 접속
          </button>
        </div>

        <div>
          {activeTab === 'create' ? (
            <Form method="post" className="space-y-8">
              <div>
                <label htmlFor="classroomName" className="block text-base font-semibold text-gray-700 mb-2">강의실 이름</label>
                <input
                  id="classroomName"
                  type="text"
                  name="classroomName"
                  value={classroomName}
                  onChange={(e) => {setClassroomName(e.target.value)}}
                  placeholder="방 이름을 입력하세요"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
                />
              </div>
              <button
                type="submit"
                name="actionType"
                value="create"
                disabled={loading || !isClassroomNameValid}
                className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all"
              >
                <PlusIcon />
                {loading ? '생성 중...' : '강의실 개설하기'}
              </button>
            </Form>
          ) : (
            <div className="space-y-6">
              <Form method="post">
                <h3 className="text-xl font-bold text-gray-800 text-center">초대 코드로 참여하기</h3>
                <div>
                  <label htmlFor="inviteCode" className="block text-base font-semibold text-gray-700 mb-2">초대 코드</label>
                  <input
                    id="inviteCode"
                    type="text"
                    name="inviteCode"
                    value={inviteCode}
                    onChange={(e) => {setInviteCode(e.target.value)}}
                    placeholder="초대 코드 또는 링크를 입력하세요"
                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition"
                  />
                </div>
                <button
                  type="submit"
                  name="actionType"
                  value="join"
                  disabled={loading || !inviteCode.trim()}
                  className="w-full flex items-center justify-center px-4 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed transition-all"
                >
                  <EnterIcon />
                  {loading ? '접속 중...' : '접속하기'}
                </button>
              </Form>

              <div className="relative border-t border-gray-200 my-4">
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-sm text-gray-500">
                  또는
                </span>
              </div>

              <Form method="post">
                <button
                  type="submit"
                  name="actionType"
                  value="reconnect"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-700 transition-colors disabled:bg-gray-400"
                >
                  강의실 재접속하기
                </button>
              </Form>
            </div>
          )}
        </div>
      </div>
  );
}