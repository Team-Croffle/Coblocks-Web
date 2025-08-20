// app/routes/admin.tsx

import { type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import AdminDashboard from '~/components/AdminDashboard';
import { createSupabaseServerClient } from '~/utils/supabase.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase } = createSupabaseServerClient({ request });
  const { data: notices } = await supabase
    .from('notice')
    .select('*')
    .order('notice_time', { ascending: false });

  return Response.json({ notices: notices || [] });
};

export default function AdminPage() {
  const { notices } = useLoaderData<typeof loader>();
  
  return (
    <div className="w-full p-4 md:p-8">
      <AdminDashboard notices={notices} />
    </div>
  );
}