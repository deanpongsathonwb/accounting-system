import React, { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { LoadingState } from '../feedback/index.ts';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 min-h-screen bg-slate-50 w-full max-w-full">
        <Suspense fallback={<LoadingState />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
};
