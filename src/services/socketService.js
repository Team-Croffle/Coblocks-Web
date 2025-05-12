import supabase, { getSupabaseAccessToken } from '@utils/supabase';
import { io } from 'socket.io-client';

// 웹 소켓을 사용하여 실시간 통신을 구현하는 클래스입니다.
class Socket {
  constructor() {
    this.supabase = supabase;
    this.socket = null; // 소켓 인스턴스를 초기화합니다.
    this.currentClassroomInfo = null; // 현재 강의실 정보를 초기화합니다.
  }

  setupSocket = async () => {
    try {
      const supabase_access_token = await getSupabaseAccessToken(this.supabase);
      if (import.meta.env.MODE === 'development') {
        console.log('supabase_access_token', supabase_access_token);
      }

      if (!supabase_access_token) {
        throw new Error('Supabase access token is not available');
      }

      this.socket = io(import.meta.env.VITE_API_URL, {
        auth: {
          token: supabase_access_token,
        },
      });

      return this.socket;
    } catch (error) {
      console.error('Error setting up socket:', error);
      throw error;
    }
  };

  // 소켓을 설정하고, 현재 강의실 정보를 초기화합니다.
  /*
    currentClassroomInfo: {
      id: string; // 강의실 ID
      name: string; // 강의실 이름
      description: string; // 강의실 설명
      inviteCode: string; // 초대 코드
      createdAt: Date; // 생성일
      updatedAt: Date; // 수정일
    } 
  */
  setupClassroom = (currentClassroomInfo) => {
    // 현재 교실 ID와 정보를 초기화합니다.
    if (!this.currentClassroomInfo) {
      this.currentClassroomInfo = currentClassroomInfo;
    } else {
      // 현재 교실 ID와 정보가 유효하지 않은 경우 오류를 발생시킵니다.
      throw new Error('Invalid classroom ID or information');
    }
  };

  closeSocket = () => {
    // 소켓이 유효한지 확인합니다.
    if (this.socket) {
      // 소켓을 닫습니다.
      this.socket.close();
      this.socket = null;
    } else {
      // 소켓이 유효하지 않은 경우 오류를 발생시킵니다.
      throw new Error('Socket is not initialized');
    }
  };

  // emit 메서드를 사용하여 서버에 메시지를 전송합니다.
  emit(event, data) {
    // 소켓이 유효한지 확인합니다.
    if (this.socket) {
      // 소켓을 통해 서버에 메시지를 전송합니다.
      this.socket.emit(event, data);
    } else {
      // 소켓이 유효하지 않은 경우 오류를 발생시킵니다.
      throw new Error('Socket is not initialized');
    }
  }

  // on 메서드를 사용하여 서버로부터 메시지 수신 시 처리합니다.
  on(event, callback) {
    // 소켓이 유효한지 확인합니다.
    if (this.socket) {
      // 소켓을 통해 서버로부터 메시지를 수신합니다.
      this.socket.on(event, callback);
    } else {
      // 소켓이 유효하지 않은 경우 오류를 발생시킵니다.
      throw new Error('Socket is not initialized');
    }
  }

  // off 메서드를 사용하여 서버로부터 메시지 수신 시 처리하지 않도록 설정합니다.
  off(event, callback) {
    // 소켓이 유효한지 확인합니다.
    if (this.socket) {
      // 소켓을 통해 서버로부터 메시지를 수신합니다.
      this.socket.off(event, callback);
    } else {
      // 소켓이 유효하지 않은 경우 오류를 발생시킵니다.
      throw new Error('Socket is not initialized');
    }
  }

  /*
  // 소켓을 초기화합니다.
  setupSocketListeners(socketInstance) {
    // 소켓 인스턴스가 유효한지 확인합니다.
    if (!socketInstance) {
      // 소켓 인스턴스가 유효하지 않거나 리스너가 이미 설정된 경우 오류를 발생시킵니다.
      throw new Error('Socket instance is not valid or listeners are already set up.');
    }

    // 소켓이 연결되었을 때의 이벤트 리스너를 설정합니다.
    socketInstance.on('connect', () => {
      if (import.meta.env.MODE === 'development') {
        console.log('Socket connected');
      }

      // 소켓 연결이 성공적으로 이루어졌을 때, 현재 교실 ID와 정보를 서버에 전송합니다.
      // 현재 교실 ID와 정보가 유효한지 확인합니다.
      // 유효하지 않은 경우 오류를 발생시킵니다.
      socketInstance.emit('joinClassroom', {
        classroomDetail: this.currentClassroomInfo,
      });
    });

    // 소켓이 연결 해제되었을 때의 이벤트 리스너를 설정합니다.
    socketInstance.on('disconnect', (reason) => {
      if (import.meta.env.MODE === 'development') {
        console.log(`Socket disconnected: ${socketInstance.id}, Reason: ${reason}`);
      }
      this.socket = null;
    });

    // 소켓에서 에러가 발생했을 때의 이벤트 리스너를 설정합니다.
    socketInstance.on('error', (error) => {
      if (import.meta.env.MODE === 'development') {
        console.error('Socket error:', error);
      }
    });

    // 강의실/채팅에 관련된 이벤트 리스너를 설정합니다.
    socketInstance.on('classroomMessage', () => {
      // 서버로부터 받은 메시지를 처리합니다.
    });

    // 강의실에 성공적으로 참여했을 때의 이벤트 리스너를 설정합니다.
    socketInstance.on('joinClassroomSuccess', (response) => {
      if (import.meta.env.MODE === 'development') {
        console.log('Received joinClassroomSuccess:', response);
      }

      // 서버로부터 받은 응답이 성공적이고, 사용자 목록과 강의실 정보가 포함되어 있는지 확인합니다.
      if (response.success && response.users && response.classroom) {
        return response;
      } else {
        if (import.meta.env.MODE === 'development') {
          console.error('Failed to join classroom via socket:', response.message);
        }
        if (this.socket) this.socket.disconnect();
        this.socket = null;
        throw new Error('Failed to join classroom via socket');
      }
    });
  }*/
}

export default Socket;
