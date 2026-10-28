import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { UI, ROUTES } from '../../constants/index.ts';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
          <FileQuestion className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">
          {UI.feedback.noData}
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          {UI.feedback.noDataSubtitle}
        </p>
        <button
          onClick={() => navigate(ROUTES.PUBLIC.LOGIN)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{UI.common.back}</span>
        </button>
      </div>
    </div>
  );
};
