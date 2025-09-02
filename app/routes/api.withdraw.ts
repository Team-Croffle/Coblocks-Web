import { type ActionFunctionArgs, json } from '@remix-run/node';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServerClient } from '~/utils/supabase.server';

// action 함수: Remix에서 POST, PUT, PATCH, DELETE 요청을 처리하는 서버 전용 함수입니다.
export const action = async ({ request }: ActionFunctionArgs) => {
  // 1. 본인 확인
  // 브라우저가 보낸 요청(쿠키 포함)을 분석해서 사용자가 누구인지 안전하게 확인합니다.
  // 이 과정에서 쿠키 속 JWT가 자동으로 검증됩니다.
  const { supabase, response } = createSupabaseServerClient({ request });
  const { data: { user } } = await supabase.auth.getUser();

  // 로그인하지 않은 사용자의 요청을 여기서 차단합니다.
  if (!user) {
    return json({ error: '인증되지 않은 사용자입니다.' }, { status: 401, headers: response.headers });
  }

  // 2. 관리자 권한 획득
  //(SERVICE_ROLE_KEY)를 사용해,
  // 모든 권한을 가진 관리자용 클라이언트를 생성합니다
  const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 3. 계정 삭제 실행
  // 관리자 권한으로 Supabase 인증 시스템에서 해당 사용자를 영구적으로 삭제하라고 명령합니다.
  const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

  // 만약 삭제 과정에서 오류가 발생했다면,
  if (deleteError) {
    console.error('Supabase user deletion error:', deleteError.message); // 서버 로그에 에러 기록
    // 프론트엔드에는 에러가 발생했다는 사실만 알려줍니다.
    return json({ error: '회원 탈퇴 처리 중 오류가 발생했습니다.' }, { status: 500, headers: response.headers });
  }

  // 모든 작업이 성공하면, 프론트엔드에 성공했다는 응답을 보냅니다.
  return json({ success: true }, { headers: response.headers });
};