import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import MainLayout from '../layouts/MainLayout';
import { createSupabaseServerClient } from '~/utils/supabase.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, response } = createSupabaseServerClient({ request });
  const { data: user } = await supabase.auth.getUser();
  return Response.json({ user }, { headers: response.headers });
};

export const meta: MetaFunction = () => {
  return [{ title: 'Coblock' }, { name: 'description', content: 'Welcome to Coblock!' }];
};

export default function Layout(): JSX.Element {
  const { user } = useLoaderData<typeof loader>();

  return (
    <MainLayout user={user}>
      <Outlet />
    </MainLayout>
  );
}
