import { createServerClient } from '@supabase/auth-helpers-remix';

export const createSupabaseServerClient = ({ request }: { request: Request }) => {
  const response = new Response();
  const supabase = createServerClient(process.env.VITE_SUPABASE_URL!, process.env.VITE_SUPABASE_ANON_KEY!, {
    request,
    response,
  });

  return { supabase, response };
};
