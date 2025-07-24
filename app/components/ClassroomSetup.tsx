import { useState } from 'react';


function PlusIcon() { //새 강의실 개설 버튼에 사용될 플러스 아이콘 컴포넌트
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function EnterIcon() {  //강의실 재접속 버튼에 사용될 입장 아이콘 컴포넌트
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>
  );
}

//사용자의 기존 강의실 목록 데이터 예시
const mockMyClassrooms = [
  { id: 'c1', name: 'Room1', lastAccessed: '2025-07-19' },
  { id: 'c2', name: 'Room2', lastAccessed: '2025-07-18' },
  { id: 'c3', name: 'Room3', lastAccessed: '2025-07-15' },
];

//
function ClassroomSetup() {
  //현재 활성화된 탭 관리 개설 또는 재접속
  const [activeTab, setActiveTab] = useState<'create' | 'reconnect'>('create');
  //새로 생성할 강의실 이름 저장
  const [classroomName, setClassroomName] = useState('');
  //최대 참여 인원 수 저장
  const [maxParticipants, setMaxParticipants] = useState(10);
  //로딩 상태 관리
  const [loading, setLoading] = useState(false);

  //강의실 이름 공백 유무 검사 변수
  const isClassroomNameValid = classroomName.trim() !== '';

  //강의실 생성 핸들러
  const handleCreate = async () => {
    if (!isClassroomNameValid) {
      alert('강의실 이름을 입력해주세요.');
      return;
    }

    setLoading(true);
    console.log('강의실 생성 시도:', { classroomName, maxParticipants });
    await new Promise((res) => { return setTimeout(res, 1500); });
    alert(`'${classroomName}' 강의실이 ${maxParticipants}명 정원으로 개설되었습니다.`);
    setLoading(false);
  };

  //강의실 재접속 핸들러
  const handleReconnect = (classroomName: string) => {
    alert(`'${classroomName}' 강의실에 재접속합니다.`);
  };

  //최대 참여 인원 수 변경 핸들러
  const handleParticipantChange = (amount: number) => {
    setMaxParticipants((prev) => { return Math.max(1, prev + amount); });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg border border-gray-200 p-8">
      <div className="flex justify-center border-b border-gray-200 mb-8">
        
        <button
          onClick={() => { setActiveTab('create'); }}
          className={`px-6 py-3 text-base font-semibold transition-colors duration-200 ${
            activeTab === 'create'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          강의실 개설
        </button>
        <button
          onClick={() => { setActiveTab('reconnect'); }}
          className={`px-6 py-3 text-base font-semibold transition-colors duration-200 ${
            activeTab === 'reconnect'
              ? 'border-b-2 border-blue-500 text-blue-500'
              : 'text-gray-500 hover:text-blue-500'
          }`}
        >
          강의실 재접속
        </button>
      </div>

      {/* activeTab에 따라 다른 UI 렌더링 */}
      <div>
        {activeTab === 'create' ? (
          <div className="space-y-8">
            <div>
              <label htmlFor="classroomName" className="block text-base font-semibold text-gray-700 mb-2">강의실 이름</label>
              <input
                id="classroomName"
                type="text"
                value={classroomName}
                onChange={(e) => { setClassroomName(e.target.value); }}
                placeholder="방 이름을 입력하세요"
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <div>
              <label htmlFor="maxParticipants" className="block text-base font-semibold text-gray-700 mb-2">최대 인원</label>
              <div className="flex items-center gap-3">
                 <button onClick={() => { handleParticipantChange(-1); }} className="px-3.5 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">-</button>
                 <input
                   id="maxParticipants"
                   type="text"
                   readOnly
                   value={maxParticipants}
                   className="w-20 text-center text-lg font-semibold border-2 border-gray-200 rounded-md shadow-sm"
                 />
                 <button onClick={() => { handleParticipantChange(1); }} className="px-3.5 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition">+</button>
              </div>
            </div>
            
            {/* 강의실 개설 버튼(로딩or이름없음시 비활성화) */}
            <button
              onClick={handleCreate}
              disabled={loading || !isClassroomNameValid}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all"
            >
              <PlusIcon />
              {loading ? '생성 중...' : '강의실 개설하기'}
            </button>
          </div>
        ) : (
          //강의실 재접속 탭
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-6">내 강의실 목록</h3>
            <ul className="space-y-4">
              {mockMyClassrooms.map((room) => {
                return (
                  <li key={room.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition">
                    <div>
                      <p className="font-semibold text-gray-800">{room.name}</p>
                      <p className="text-sm text-gray-500">최근 접속: {room.lastAccessed}</p>
                    </div>
                    <button
                      onClick={() => { handleReconnect(room.name); }}
                      className="flex items-center px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:bg-green-600 transition-colors"
                    >
                      <EnterIcon />
                      재접속
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassroomSetup;