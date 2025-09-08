import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { createSupabaseServerClient } from '~/utils/supabase.server';
import Footer from '~/layouts/Footer';
import NavigationBar from '~/layouts/NavigationBar';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabase, response } = createSupabaseServerClient({ request });
  const { data: user } = await supabase.auth.getUser();
  return Response.json({ user }, { headers: response.headers });
};

export const meta: MetaFunction = () => {
  return [{ title: 'Coblock' }, { name: 'description', content: 'Welcome to Coblock!' }];
};

export default function Layout(): JSX.Element {
  return (
    <div className='flex min-h-screen flex-col'>
      <NavigationBar />
      <main className='flex-grow'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
