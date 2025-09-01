import { Outlet } from '@remix-run/react';
import MainLayout from '~/layouts/MainLayout';

export default function Layout(): JSX.Element {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
