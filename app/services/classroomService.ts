import { ClassroomInfo, Participant, ChatMessage, Quest } from '../assets/dummy/classroomData';

interface AllClassroomData {
  classroomInfo: ClassroomInfo;
  participants: Participant[];
  messages: ChatMessage[];
  quests: Quest[];
}

export const classroomService = {
  // 모든 강의실 데이터 한번에 조회
  async getAllClassroomData(classroomId: string): Promise<AllClassroomData> {
    const response = await fetch(`/api/classrooms/${classroomId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch classroom data: ${response.statusText}`);
    }
    return await response.json();
  },

  // 강의실 정보 조회 (단독 호출용)
  async getClassroomInfo(classroomId: string): Promise<ClassroomInfo> {
    const data = await this.getAllClassroomData(classroomId);
    return data.classroomInfo;
  },

  // 참여자 목록 조회 (단독 호출용)
  async getParticipants(classroomId: string): Promise<Participant[]> {
    const data = await this.getAllClassroomData(classroomId);
    return data.participants;
  },

  // 퀘스트 목록 조회 (단독 호출용)
  async getQuests(classroomId: string): Promise<Quest[]> {
    const data = await this.getAllClassroomData(classroomId);
    return data.quests;
  },

  // 채팅 메시지 조회
  async getChatMessages(classroomId: string): Promise<ChatMessage[]> {
    const response = await fetch(`/api/classrooms/${classroomId}/messages`);
    if (!response.ok) {
      throw new Error(`Failed to fetch messages: ${response.statusText}`);
    }
    return await response.json();
  },

  // 채팅 메시지 전송
  async sendMessage(classroomId: string, message: string): Promise<ChatMessage> {
    try {
      const response = await fetch(`/api/classrooms/${classroomId}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send message: ${response.status} ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  // 퀘스트 상태 업데이트
  async updateQuestStatus(classroomId: string, questId: number, status: string): Promise<Quest> {
    const response = await fetch(`/api/classrooms/${classroomId}/quests/${questId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update quest status: ${response.statusText}`);
    }

    return await response.json();
  },
};
