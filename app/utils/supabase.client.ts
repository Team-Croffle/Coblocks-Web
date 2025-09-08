import { createClient } from '@supabase/supabase-js';

// 사용자가 로그인 버튼을 클릭하거나, 회원가입 폼을 제출하는 등 화면과 직접 상호작용할 때 사용
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);