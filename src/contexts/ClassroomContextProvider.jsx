import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Socket from '@services/socketService'; // Socket 클래스 이름 확인 필요
import socketEvents from '@services/socketEvents'; // socketEvents 경로가 올바른지 확인해주세요.
import { ClassroomContext } from './ClassroomContext'; // ClassroomContext 경로 확인 필요

const initialActivityInfoState = {
  activityPartNumber: null,
  allParticipantAssignments: [],
  finalSubmissionsData: {},
  summitted: {
    1: false,
    2: false,
    3: false,
    4: false,
  },
};

const ClassroomContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [chatContext, setChatContext] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isManager, setIsManager] = useState(false);
  const [isRunTrigger, setIsRunTrigger] = useState(false);
  const [questInfo, setQuestInfo] = useState({});
  const [activityInfo, setActivityInfo] = useState(initialActivityInfoState); // 초기 상태 사용
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

  const resetActivityStates = useCallback(() => {
    setActivityInfo(initialActivityInfoState);
    setIsRunTrigger(false);
    setQuestInfo({});
    // 필요하다면 다른 활동 관련 상태도 여기서 초기화
    if (import.meta.env.VITE_RUNNING_MODE === 'development') {
      console.log('Activity states have been reset.');
    }
  }, []);

  const socketClose = useCallback(() => {
    if (socket) {
      socket.closeSocket();
      setSocket(null);
      // setChatContext([]); // 채팅은 유지할 수도 있음
      // setParticipants([]); // 참여자 목록도 유지할 수도 있음
      resetActivityStates(); // 활동 관련 상태 초기화
      if (import.meta.env.VITE_RUNNING_MODE === 'development') {
        console.log('Socket explicitly closed and activity states reset.');
      }
    }
  }, [socket, resetActivityStates]);

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

    newSocket
      .setupSocket() // setupSocket이 인스턴스 메서드라고 가정 (소켓 기본 설정)
      .then((acturalSocket) => {
        if (!acturalSocket) {
          console.error('Socket instance is null or undefined');
          return;
        }
        if (import.meta.env.VITE_RUNNING_MODE === 'development') {
          console.log('Socket instance created:', acturalSocket);
        }
        newSocket.setupClassroom(classroomInfo); // setupClassroom이 인스턴스 메서드라고 가정 (강의실 정보 설정)
        setSocket(newSocket); // 생성된 소켓 인스턴스를 상태에 저장

        if (import.meta.env.VITE_RUNNING_MODE === 'development') {
          //console.log('New socket instance created and set up for classroom:', classroomInfo.classroom_id);
        }

        const handleConnect = () => {
          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            console.log('Socket connected, emitting JOIN_CLASSROOM for classroom:', classroomInfo.classroom_id);
          }
          if (classroomInfo) {
            newSocket.emit(socketEvents.JOIN_CLASSROOM, {
              classroomDetails: classroomInfo, // classroomInfo는 이미 객체여야 함
            });
          }
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
          console.log('Received CLASSROOM_MESSAGE:', data);
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
        //  classroom: {
        //    classroom_id: '강의실 ID',
        //    name: '강의실 이름',
        //    max_participants: '최대 참여자 수'
        //  }
        //  users: [참여자 목록],
        //  isManager: true/false // 현재 사용자가 강의실 관리자 여부
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
            setIsManager(response.isManager); // 강의실 관리자 여부 업데이트
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

        const handleActivityEndedByServer = (data) => {
          // 서버에서 활동 종료를 알리는 이벤트 (예: ACTIVITY_TERMINATED)
          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            console.log('Received ACTIVITY_TERMINATED (or similar event):', data);
          }
          resetActivityStates();
          // 필요시 사용자에게 알림 또는 페이지 이동
          // alert(data.message || '활동이 관리자에 의해 종료되었습니다.');
          // navigate('/classroom'); // 예시: 로비로 이동
        };

        const handleClassroomDeleted = (data) => {
          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            console.log('Received CLASSROOM_DELETED:', data);
          }
          if (data && data.classroomId && classroomInfo && data.classroomId === classroomInfo.classroom_id) {
            alert(`${data.message || '강의실이 관리자에 의해 종료되었습니다.'}`);
            socketClose(); // 소켓 연결 종료 (내부에서 resetActivityStates 호출됨)
            setClassroomInfo(null);
            localStorage.removeItem('currentClassroomInfo');
            setChatContext([]);
            setParticipants([]);
            navigate('/classroom-main'); // 메인 페이지로 이동
          } else {
            if (import.meta.env.VITE_RUNNING_MODE === 'development') {
              console.warn('Received classroomDeleted event for a different or invalid classroom:', data);
            }
          }
        };

        const handleReceiveQuestInfo = (data) => {
          // 퀘스트 정보가 유효한지 확인
          if (data && data.questInfo) {
            if (import.meta.env.VITE_RUNNING_MODE === 'development') {
              console.log('Received PROBLEM_SELECTED_INFO:', data);
            }
            setQuestInfo(data.questInfo[0]); // 퀘스트 정보 업데이트
          } else {
            if (import.meta.env.VITE_RUNNING_MODE === 'development') {
              console.warn('Received PROBLEM_SELECTED_INFO without valid questInfo:', questInfo);
            }
          }
        };

        const handleActivityBegin = (data) => {
          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            console.log('Received START_ACTIVITY:', data);
          }
          setActivityInfo((prevInfo) => ({
            ...prevInfo,
            activityPartNumber: data.myPartNumber, // 활동 파트 번호 업데이트
            allParticipantAssignments: data.allParticipantAssignments, // 모든 참여자 할당 정보 업데이트
          }));
          navigate('/classroom/workspace');
        };

        const handleActivityEnded = () => {
          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            console.log('Received ACTIVITY_ENDED, resetting activity states.');
          }
          resetActivityStates();
          navigate('/classroom');
        };

        const handleSubmitSolutionSuccess = (data) => {
          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            console.log('Received SUBMIT_SOLUTION_SUCCESS:', data);
          }
          setIsRunTrigger(false); // 제출 성공 후 실행 트리거 초기화
          setActivityInfo((prevInfo) => ({
            ...prevInfo,
            summitted: {
              ...prevInfo.summitted,
              [data.partNumber]: true, // 제출한 파트 번호 업데이트
            },
          }));
        };

        const handleSubmissionsData = (data) => {
          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            console.log('Received FINAL_SUBMISSIONS_DATA:', data);
          }
          // data는 모든 참여자의 최종 제출 데이터 객체 또는 배열일 수 있습니다.
          // activityInfo.summitted 상태도 이 데이터를 기반으로 업데이트해야 할 수 있습니다.
          setActivityInfo((prevInfo) => ({
            ...prevInfo,
            finalSubmissionsData: data.finalSubmissions, // 최종 제출 데이터 업데이트
          }));

          // FINAL_SUBMISSIONS_DATA를 받은 모든 참여자의 isRunTrigger를 true로 설정
          setIsRunTrigger(true);

          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            console.log(
              'Activity submissions data updated and execution triggered for all participants:',
              data.finalSubmissions,
            );
          }
        };

        const handleStageReset = () => {
          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            console.log('Received STAGE_RESET, resetting activity states.');
          }
          // 모든 참여자의 isRunTrigger를 false로 설정
          setIsRunTrigger(false);
          // activityInfo.finalSubmissionsData를 초기화
          setActivityInfo((prevInfo) => ({
            ...prevInfo,
            finalSubmissionsData: null,
          }));

          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            console.log('All participants execution reset.');
          }
        };

        // 이벤트 리스너 등록
        newSocket.on(socketEvents.CONNECT, handleConnect);
        newSocket.on(socketEvents.DISCONNECT, handleDisconnect);
        newSocket.on(socketEvents.ERROR, handleError);
        newSocket.on(socketEvents.CLASSROOM_MESSAGE, handleClassroomMessage);
        newSocket.on(socketEvents.JOIN_CLASSROOM_SUCCESS, handleJoinClassroomSuccess);
        newSocket.on(socketEvents.USER_JOINED_CLASSROOM, handleUserJoinedClassroom);
        newSocket.on(socketEvents.USER_LEFT_CLASSROOM, handleUserLeftClassroom);
        newSocket.on(socketEvents.ACTIVITY_ENDED, handleActivityEndedByServer);
        newSocket.on(socketEvents.CLASSROOM_DELETED, handleClassroomDeleted);
        newSocket.on(socketEvents.PROBLEM_SELECTED_INFO, handleReceiveQuestInfo);
        newSocket.on(socketEvents.ACTIVITY_BEGIN, handleActivityBegin);
        newSocket.on(socketEvents.ACTIVITY_ENDED, handleActivityEnded);
        newSocket.on(socketEvents.SUBMIT_SOLUTION_SUCCESS, handleSubmitSolutionSuccess);
        newSocket.on(socketEvents.FINAL_SUBMISSIONS_DATA, handleSubmissionsData);
        newSocket.on(socketEvents.STAGE_RESET, handleStageReset);

        // Cleanup 함수: 컴포넌트 언마운트 시 또는 classroomInfo 변경 전에 실행
        return () => {
          if (import.meta.env.VITE_RUNNING_MODE === 'development') {
            //console.log('Cleaning up socket listeners and closing socket for classroom:', classroomInfo?.classroom_id);
          }
          // 등록된 모든 이벤트 리스너 제거
          socket.off(socketEvents.CONNECT, handleConnect);
          socket.off(socketEvents.DISCONNECT, (reson) => handleDisconnect(reson));
          socket.off(socketEvents.ERROR, handleError);
          socket.off(socketEvents.CLASSROOM_MESSAGE, (data) => handleClassroomMessage(data));
          socket.off(socketEvents.JOIN_CLASSROOM_SUCCESS, handleJoinClassroomSuccess);
          socket.off(socketEvents.USER_JOINED_CLASSROOM, handleUserJoinedClassroom);
          socket.off(socketEvents.USER_LEFT_CLASSROOM, handleUserLeftClassroom);
          socket.off(socketEvents.ACTIVITY_ENDED, handleActivityEndedByServer);
          socket.off(socketEvents.CLASSROOM_DELETED, handleClassroomDeleted);
          socket.off(socketEvents.PROBLEM_SELECTED_INFO, handleReceiveQuestInfo);
          socket.off(socketEvents.ACTIVITY_BEGIN, handleActivityBegin);
          socket.off(socketEvents.SUBMIT_SOLUTION_SUCCESS, handleSubmitSolutionSuccess);
          socket.off(socketEvents.FINAL_SUBMISSIONS_DATA, handleSubmissionsData);
          socket.off(socketEvents.STAGE_RESET, handleStageReset);
          socket.closeSocket(); // 소켓 연결 종료
          setSocket(null); // 상태에서 소켓 인스턴스 참조 제거
        };
      })
      .catch((error) => {
        if (import.meta.env.VITE_RUNNING_MODE === 'development') {
          console.error('Error setting up socket:', error);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 의존성 배열은 이전과 동일하게 유지하거나, resetActivityStates 추가

  const contextValue = useMemo(
    () => ({
      socket,
      chat: chatContext,
      participants,
      classroomInfo,
      isManager,
      questInfo,
      activityInfo,
      isRunTrigger,
      setIsRunTrigger,
      setParticipants,
      setClassroomInfo,
      socketClose,
      resetActivityStates, // 컨텍스트를 통해 직접 호출할 수 있도록 추가 (선택 사항)
    }),
    [
      socket,
      chatContext,
      participants,
      classroomInfo,
      isManager,
      questInfo,
      activityInfo,
      isRunTrigger,
      setIsRunTrigger, // setIsRunTrigger는 이미 의존성 배열에 있음
      setParticipants,
      setClassroomInfo,
      socketClose,
      resetActivityStates, // 의존성 배열에 추가
    ],
  );

  return <ClassroomContext.Provider value={contextValue}>{children}</ClassroomContext.Provider>;
};

export default ClassroomContextProvider;
