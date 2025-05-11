import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// supabase 객체를 사용하여 세션의 access_token을 가져오는 함수
// 이 함수는 Supabase 클라이언트가 초기화되어 있는지 확인하고, 세션을 가져온 후 access_token을 반환합니다.
// 만약 Supabase 클라이언트가 초기화되지 않았거나 세션을 가져오는 중에 오류가 발생하면 오류를 던집니다.
const getSupabaseAccessToken = async (supabaseObj) => {
  if (!supabaseObj || !supabaseObj.auth) {
    throw new Error('Supabase client is not initialized');
  }

  const {
    data: { session },
    error,
  } = await supabaseObj.auth.getSession();

  if (error) {
    throw new Error(`Error fetching session: ${error.message}`);
  }

  if (!session) {
    throw new Error('No active session found');
  }

  return session.access_token;
};

const getCurrentUserId = async (supabaseObj) => {
  if (!supabaseObj || !supabaseObj.auth) {
    throw new Error('Supabase client is not initialized');
  }

  const {
    data: { user },
    error,
  } = await supabaseObj.auth.getUser();

  if (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }

  if (!user) {
    throw new Error('No active user found');
  }

  return user.id;
};

export default supabase;
export { getSupabaseAccessToken, getCurrentUserId };
