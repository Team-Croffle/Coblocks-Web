export type Notice = {
  notice_id: string;
  notice_name: string;
  notice_content: string;
  notice_time: string;
  writer_users_id: string | null;
};

export type Quest = {
  quest_id: string;
  quest_description: string;
  quest_difficulty: number;
  quest_type: string;
  solve_status: number;
};
