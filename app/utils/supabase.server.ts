import { createServerClient } from '@supabase/auth-helpers-remix';

export const createSupabaseServerClient = ({ request }: { request: Request }) => {
  const response = new Response();
  const supabase = createServerClient(process.env.SUPABASE_URL!, process.env.SUPABASE_ANON_KEY!, { request, response });

  return { supabase, response };
};

  export const getUserId = async (request: Request): Promise<string | null> => {
  const { supabase } = createSupabaseServerClient({ request });
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
};
