import React from 'react';
import { Inbox } from 'lucide-react';
import { UI } from '../../constants/index.ts';
import { renderSemanticText } from '../common/index.ts';

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = UI.feedback.noData,
  subtitle = UI.feedback.noDataSubtitle,
  icon
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-white rounded-xl border border-slate-200">
      <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-slate-700">{renderSemanticText(title)}</h3>
      <p className="text-sm text-slate-500 mt-1 max-w-sm">{renderSemanticText(subtitle)}</p>
    </div>
  );
};
