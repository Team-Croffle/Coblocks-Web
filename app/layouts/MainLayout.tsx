import React from 'react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps): JSX.Element {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavigationBar />

      <div className='flex-grow'>
        {children} {/* Remix의 <Outlet />이 렌더링 될 위치 */}
      </div>

      <Footer />
    </div>
  );
}
