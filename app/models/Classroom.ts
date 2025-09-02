import type { SupabaseClient } from '@supabase/supabase-js';

export interface ClassroomType {
  classroom_id: string;
  classroom_code: string;
  classroom_name: string;
  manager_users_id: string;
  created_at: string;
}

class Classroom {
  static async create(
    supabase: SupabaseClient,
    manager_users_id: string,
    classroom_name: string
  ): Promise<ClassroomType> {
    let classroom_code: string | null = null;
    const MAX_RETRIES = 10;
    let retries = 0;

    while (!classroom_code && retries < MAX_RETRIES) {
      const potentialCode = this.generateClassCode();
      const existing = await this.findByCode(supabase, potentialCode);
      if (!existing) {
        classroom_code = potentialCode;
      } else {
        retries++;
      }
    }

    if (!classroom_code) {
      throw new Error('Failed to generate a unique classroom code.');
    }

    const { data, error } = await supabase.rpc('handle_create_classroom', {
      p_classroom_code: classroom_code,
      p_manager_users_id: manager_users_id,
      p_classroom_name: classroom_name,
    });

    if (error) throw error;
    return data;
  }

  static async findByCode(
    supabase: SupabaseClient,
    classroom_code: string
  ): Promise<ClassroomType | null> {
    const { data, error } = await supabase
      .from('classroom')
      .select('*')
      .eq('classroom_code', classroom_code)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data;
  }


  static async findByManager(
    supabase: SupabaseClient,
    manager_users_id: string
  ): Promise<ClassroomType | null> {
    const { data, error } = await supabase
      .from('classroom')
      .select('*')
      .eq('manager_users_id', manager_users_id)
      .order('created_at', { ascending: false }) // 가장 최근에 만든 것을 찾기 위해 정렬
      .limit(1) // 가장 최신 1개만 가져옴
      .single();

    // '데이터 없음(PGRST116)'은 정상적인 실패이므로, 그 외의 에러만 처리.
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    return data;
  }

  static generateClassCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

export default Classroom;