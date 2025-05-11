import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Socket from '@services/socketService'; // Socket 클래스 이름 확인 필요
import socketEvents from '@data/socketEvents'; // socketEvents 경로가 올바른지 확인해주세요.

const ClassroomContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [chatContext, setChatContext] = useState([]);
  const [participants, setParticipants] = useState([]);
  // localStorage에서 초기 classroomInfo를 가져와 상태로 관리
  const [classroomInfo, setClassroomInfo] = useState(() => {
    const storedInfo = localStorage.getItem('currentClassroomInfo');
    try {
      return storedInfo ? JSON.parse(storedInfo) : null;
    } catch (error) {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.error('Failed to parse classroomInfo from localStorage:', error);
      }
      return null;
    }
  });

  const socketClose = useCallback(() => {
    if (socket) {
      socket.closeSocket();
      setSocket(null); // 필요하다면 chatContext, participants도 초기화
      // setChatContext([]);
      // setParticipants([]);
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Socket explicitly closed.');
      }
    }
  }, [socket]);

  useEffect(() => {
    // classroomInfo가 없으면 소켓 관련 로직을 실행하지 않음
    if (!classroomInfo) {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('ClassroomInfo is null, skipping socket setup.');
      }
      // classroomInfo가 없어졌으므로, 기존 소켓이 있다면 정리
      if (socket) {
        socketClose();
      }
      return;
    }

    // 새 소켓 인스턴스 생성 및 설정
    const newSocket = new Socket(); // Socket 클래스의 인스턴스 생성
    newSocket.setupSocket(); // setupSocket이 인스턴스 메서드라고 가정 (소켓 기본 설정)
    newSocket.setupClassroom(classroomInfo); // setupClassroom이 인스턴스 메서드라고 가정 (강의실 정보 설정)
    setSocket(newSocket); // 생성된 소켓 인스턴스를 상태에 저장

    if (import.meta.env.VITE_RUNNING_MODE === 'development') {
      console.log('New socket instance created and set up for classroom:', classroomInfo.classroom_id);
    }

    const handleConnect = () => {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Socket connected, emitting JOIN_CLASSROOM for classroom:', classroomInfo.classroom_id);
      }
      // 소켓 연결 성공 시 JOIN_CLASSROOM 이벤트 발생
      newSocket.emit(socketEvents.JOIN_CLASSROOM, {
        classroomDetail: classroomInfo, // classroomInfo는 이미 객체여야 함
      });
    };

    const handleDisconnect = (reason) => {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Socket disconnected. Reason:', reason);
      }
      // 연결이 끊어졌을 때 소켓 인스턴스를 완전히 닫을지, 재연결 로직을 둘지는 정책에 따라 결정
      // 예: socketClose(); // 필요하다면 여기서 호출
      // 또는 newSocket.socket이 null이 아닐 때만 특정 로직 수행
    };

    const handleError = (error) => {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.error('Socket error:', error);
      }
      // 에러 발생 시 사용자에게 알림 등의 처리
    };

    // 강의실 채팅 메시지 수신 처리
    // 서버에서 CLASSROOM_MESSAGE 이벤트를 수신했을 때의 처리
    // data : {
    //  message: '메시지 내용',
    //  userId: '발신자 ID',
    //  username: '발신자 이름',
    //  timestamp: '메시지 수신 시간'
    // }
    const handleClassroomMessage = (data) => {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Received CLASSROOM_MESSAGE:', data);
      }
      const message = {
        message: data.message,
        sender: data.username || data.userId || 'Unknown', // 발신자 정보
        timestamp: data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString(), // 메시지 수신 시간
      };
      setChatContext((prevMessages) => [...prevMessages, message]); // 이전 메시지 배열에 새 메시지 추가
    };

    // 강의실 참여 성공 처리
    // 서버에서 JOIN_CLASSROOM_SUCCESS 이벤트를 수신했을 때의 처리
    // response : {
    //  success: true,
    //  users: [참여자 목록],
    //  classroom: {
    //    classroom_id: '강의실 ID',
    //    name: '강의실 이름',
    //    max_participants: '최대 참여자 수'
    //  }
    // }
    // response.users는 참여자 목록, response.classroom은 강의실 정보
    const handleJoinClassroomSuccess = (response) => {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Received JOIN_CLASSROOM_SUCCESS:', response);
      }
      if (response.success && response.users && response.classroom) {
        setParticipants(response.users); // 참여자 목록 업데이트
        // classroomInfo 상태를 서버에서 받은 최신 정보로 업데이트 할 수도 있음
        // setClassroomInfo(response.classroom);
      } else {
        if (import.meta.env.VITE_RUNNING_MODE === 'development') {
          console.error('Failed to join classroom via socket:', response.message);
        }
        alert(`강의실 참여 실패: ${response.message || '알 수 없는 오류'}`);
        // 참여 실패 시 소켓을 닫거나 다른 처리를 할 수 있음
        // socketClose();
      }
    };

    // 강의실 참여자 목록 업데이트
    // 서버에서 USER_JOINED_CLASSROOM 이벤트를 수신했을 때의 처리
    // data : {
    //  joinedUser: {
    //    userId: '참여자 ID',
    //    username: '참여자 이름'
    //  }
    // }
    const handleUserJoinedClassroom = (data) => {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Received USER_JOINED_CLASSROOM:', data);
      }
      if (data && data.joinedUser) {
        // data.users 대신 data.joinedUser (백엔드 이벤트 페이로드에 맞게 수정)
        setParticipants((prevUsers) => [...prevUsers, data.joinedUser]);
        const message = {
          sender: 'System', // 시스템 메시지로 표시
          message: `${data.joinedUser.username || data.joinedUser.userId}님이 강의실에 참여하셨습니다.`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setChatContext((prevMessages) => [...prevMessages, message]);
      } else {
        if (import.meta.env.VITE_RUNNING_MODE === 'development') {
          console.warn('Received userJoinedClassroom event without valid joinedUser data:', data);
        }
      }
    };

    const handleUserLeftClassroom = (data) => {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Received USER_LEFT_CLASSROOM:', data);
      }
      if (data && data.leftUser) {
        // data.users 대신 data.leftUser (백엔드 이벤트 페이로드에 맞게 수정)
        setParticipants((prevUsers) => prevUsers.filter((user) => user.userId !== data.leftUser.userId));
        const message = {
          sender: 'System', // 시스템 메시지로 표시
          message: `${data.leftUser.username || data.leftUser.userId}님이 강의실에서 나가셨습니다.`,
          timestamp: new Date().toLocaleTimeString(),
        };
        setChatContext((prevMessages) => [...prevMessages, message]);
      } else {
        if (import.meta.env.VITE_RUNNING_MODE === 'development') {
          console.warn('Received userLeftClassroom event without valid leftUser data:', data);
        }
      }
    };

    const handleClassroomDeleted = (data) => {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Received CLASSROOM_DELETED:', data);
      }
      // 현재 참여 중인 강의실이 삭제된 경우에만 처리
      if (data && data.classroomId && classroomInfo && data.classroomId === classroomInfo.classroom_id) {
        alert(`강의실이 삭제되었습니다: ${data.message || '강의실이 관리자에 의해 종료되었습니다.'}`);
        socketClose(); // 소켓 연결 종료
        setClassroomInfo(null); // 현재 강의실 정보 초기화
        localStorage.removeItem('currentClassroomInfo'); // 로컬 스토리지에서도 정보 제거
        setChatContext([]); // 채팅 내용 초기화
        setParticipants([]); // 참여자 목록 초기화
        // 필요하다면 사용자를 다른 페이지로 리디렉션 (예: 로비, 강의실 목록)
      } else {
        if (import.meta.env.VITE_RUNNING_MODE === 'development') {
          console.warn('Received classroomDeleted event for a different or invalid classroom:', data);
        }
      }
    };

    // 이벤트 리스너 등록
    newSocket.on('connect', handleConnect);
    newSocket.on(socketEvents.DISCONNECT, handleDisconnect);
    newSocket.on(socketEvents.ERROR, handleError);
    newSocket.on(socketEvents.CLASSROOM_MESSAGE, handleClassroomMessage);
    newSocket.on(socketEvents.JOIN_CLASSROOM_SUCCESS, handleJoinClassroomSuccess);
    newSocket.on(socketEvents.USER_JOINED_CLASSROOM, handleUserJoinedClassroom);
    newSocket.on(socketEvents.USER_LEFT_CLASSROOM, handleUserLeftClassroom);
    newSocket.on(socketEvents.CLASSROOM_DELETED, handleClassroomDeleted);

    // Cleanup 함수: 컴포넌트 언마운트 시 또는 classroomInfo 변경 전에 실행
    return () => {
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Cleaning up socket listeners and closing socket for classroom:', classroomInfo?.classroom_id);
      }
      // 등록된 모든 이벤트 리스너 제거
      newSocket.off('connect', handleConnect);
      newSocket.off(socketEvents.DISCONNECT, handleDisconnect);
      newSocket.off(socketEvents.ERROR, handleError);
      newSocket.off(socketEvents.CLASSROOM_MESSAGE, handleClassroomMessage);
      newSocket.off(socketEvents.JOIN_CLASSROOM_SUCCESS, handleJoinClassroomSuccess);
      newSocket.off(socketEvents.USER_JOINED_CLASSROOM, handleUserJoinedClassroom);
      newSocket.off(socketEvents.USER_LEFT_CLASSROOM, handleUserLeftClassroom);
      newSocket.off(socketEvents.CLASSROOM_DELETED, handleClassroomDeleted);
      newSocket.closeSocket(); // 소켓 연결 종료
      setSocket(null); // 상태에서 소켓 인스턴스 참조 제거
    };
  }, [classroomInfo, socket, socketClose]); // socket과 socketClose를 의존성 배열에 추가 (useCallback으로 메모이즈 되었으므로 안전)

  // Provider value 최적화: context value 객체가 불필요하게 재생성되는 것을 방지
  const contextValue = useMemo(
    () => ({
      socket,
      chat: chatContext, // chatContext 대신 chat으로 이름 변경 (일관성)
      participants,
      classroomInfo,
      setClassroomInfo, // 외부에서 classroomInfo를 변경할 수 있도록 함수 제공 (예: 강의실 나가기, 다른 강의실 선택)
      socketClose, // 소켓을 명시적으로 닫아야 할 때 사용
    }),
    [socket, chatContext, participants, classroomInfo, setClassroomInfo, socketClose], // setClassroomInfo도 의존성 배열에 추가
  );

  return <ClassroomContext.Provider value={contextValue}>{children}</ClassroomContext.Provider>;
};

export default ClassroomContextProvider;
