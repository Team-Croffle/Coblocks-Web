// 경로는 프로젝트 구조에 맞게 조정

// 퀘스트 데이터 타입 정의
export interface QuestItem {
  quest_id: string;
  quest_description: string;
  quest_difficulty: number;
  quest_type: string;
  solve_status: number;
}

// export const classroomService = {


//   // 모든 강의실 데이터 한번에 조회
//   async getAllClassroomData(classroomCode: string): Promise<AllClassroomData> {
//     const response = await fetch(`/api/classrooms/${classroomCode}`);
//     if (!response.ok) {
//       throw new Error(`Failed to fetch classroom data: ${response.statusText}`);
//     }
//     return await response.json();
//   },

//   // 강의실 정보 조회 (단독 호출용)
//   async getClassroomInfo(classroomCode: string): Promise<ClassroomInfo> {
//     const data = await this.getAllClassroomData(classroomCode);
//     return data.classroomInfo;
//   },

//   // // 참여자 목록 조회 (단독 호출용)
//   // async getParticipants(classroomCode: string): Promise<Participant[]> {
//   //   const data = await this.getAllClassroomData(classroomCode);
//   //   return data.participants;
//   // },

//   // 퀘스트 목록 조회 (단독 호출용)
//   async getQuests(): Promise<Quest[]> {
//   try {
//     const { data, error } = await supabase.rpc('get_questlist');
    
//     if (error) {
//       console.error('Supabase RPC error:', error);
//       throw new Error(`Failed to fetch quests: ${error.message}`);
//     }
    
//     // 데이터가 배열인지 확인
//     if (!Array.isArray(data)) {
//       console.warn('Expected array but got:', data);
//       return [];
//     }
    
//     return data as Quest[];
//   } catch (error) {
//     console.error('Error fetching quests:', error);
//     throw error;
//   }
// },};
