import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/index.ts';
import { ErrorBoundary } from './components/feedback/ErrorBoundary.tsx';

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
