import React from 'react';
import { ui } from '../../constants/index.ts';
import { Lock, Unlock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { renderSemantic } from '../../utils/text.tsx';

interface PeriodClosingPageProps {
  periodStatus: {
    fiscalYear: number;
    currentMonth: number;
    status: string;
    signedBy: string;
    signedDate: string;
  };
  onTogglePeriod: () => void;
}

export const PeriodClosingPage: React.FC<PeriodClosingPageProps> = ({
  periodStatus,
  onTogglePeriod,
}) => {
  const isOpen = periodStatus.status === 'open';

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
          {renderSemantic(ui.auditor.closing.title)}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
          {renderSemantic(ui.auditor.closing.description)}
        </p>
      </div>

      {/* Main Status Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <div className="text-xs text-slate-500 whitespace-nowrap shrink-0">{ui.auditor.closing.currentPeriod}</div>
            <div className="text-base sm:text-lg font-bold text-slate-900 font-mono mt-0.5 whitespace-nowrap shrink-0">
              {ui.common.periodPrefix} {periodStatus.currentMonth}{' '}
              {ui.common.symbolSlash} {ui.common.fiscalYearPrefix} {periodStatus.fiscalYear}
            </div>
          </div>

          <div className="self-start sm:self-center shrink-0">
            <span
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${
                isOpen ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}
            >
              {isOpen ? <Unlock className="w-3.5 h-3.5 shrink-0" /> : <Lock className="w-3.5 h-3.5 shrink-0" />}
              <span className="whitespace-nowrap shrink-0">{isOpen ? ui.auditor.closing.statusOpen : ui.auditor.closing.statusClosed}</span>
            </span>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <span className="break-words leading-relaxed">{renderSemantic(ui.auditor.closing.warningClosing)}</span>
        </div>

        {/* Audit Sign-off details */}
        <div className="bg-slate-50 p-3.5 sm:p-4 rounded-md border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
            <span className="whitespace-nowrap shrink-0">{ui.auditor.closing.auditSignOff}</span>
          </div>
          <div className="text-slate-600 pl-6 space-y-1">
            <div className="break-words leading-relaxed">{periodStatus.signedBy}</div>
            <div className="text-slate-400 font-mono text-[11px] whitespace-nowrap shrink-0">
              {periodStatus.signedDate}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onTogglePeriod}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer focus:outline-hidden whitespace-nowrap shrink-0 ${
              isOpen
                ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white focus:ring-2 focus:ring-rose-500/20'
                : 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white focus:ring-2 focus:ring-slate-500/20'
            }`}
          >
            {isOpen ? <Lock className="w-4 h-4 shrink-0" /> : <Unlock className="w-4 h-4 shrink-0" />}
            <span className="whitespace-nowrap shrink-0">
              {isOpen
                ? ui.auditor.closing.closePeriodButton
                : ui.auditor.closing.reopenPeriodButton}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
