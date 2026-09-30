import React, { useState } from 'react';
import { ui } from '../../constants/index.ts';
import seedSettings from '../../seed/settings.json';
import { Database, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { renderSemantic } from '../../utils/text.tsx';

export const MaintenancePage: React.FC = () => {
  const [lastBackup, setLastBackup] = useState<string>(seedSettings.lastBackupTime);
  const [backingUp, setBackingUp] = useState(false);
  const [checking, setChecking] = useState(false);

  const handleBackup = () => {
    setBackingUp(true);
    setTimeout(() => {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      setLastBackup(now);
      setBackingUp(false);
    }, 1000);
  };

  const handleIntegrityCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
    }, 1000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
          {renderSemantic(ui.admin.maintenance.title)}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
          {renderSemantic(ui.admin.maintenance.description)}
        </p>
      </div>

      {/* Database Status Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-3">
          <div className="flex items-center gap-3">
            <Database className="w-5 h-5 text-sky-600 shrink-0" />
            <div>
              <div className="text-xs text-slate-500 whitespace-nowrap shrink-0">
                {ui.admin.maintenance.databaseStatus}
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 whitespace-nowrap shrink-0">
                {ui.admin.maintenance.statusHealthy}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold bg-emerald-50 px-2.5 py-1 rounded self-start sm:self-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap shrink-0">{ui.common.systemStatus}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-600 pt-2 gap-1">
          <div className="flex items-center gap-1 shrink-0">
            <span className="whitespace-nowrap shrink-0">{ui.admin.maintenance.lastBackupTime}</span>
            <span className="text-slate-400 shrink-0">{ui.common.symbolColon}</span>
          </div>
          <span className="font-mono text-slate-900 font-semibold tabular-nums whitespace-nowrap shrink-0">{lastBackup}</span>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleBackup}
            disabled={backingUp}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-slate-500/20 whitespace-nowrap shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${backingUp ? 'animate-spin' : ''}`} />
            <span className="whitespace-nowrap shrink-0">{ui.admin.maintenance.backupButton}</span>
          </button>
        </div>
      </div>

      {/* Integrity Check Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <div className="text-xs sm:text-sm font-bold text-slate-900 break-words leading-snug">
                {renderSemantic(ui.admin.maintenance.integrityCheck)}
              </div>
              <div className="text-xs text-slate-500 mt-0.5 break-words leading-relaxed">
                {renderSemantic(ui.admin.maintenance.integrityPassed)}
              </div>
            </div>
          </div>

          <button
            onClick={handleIntegrityCheck}
            disabled={checking}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4.5 py-2.5 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 shrink-0 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 whitespace-nowrap"
          >
            <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${checking ? 'animate-spin' : ''}`} />
            <span className="whitespace-nowrap shrink-0">{ui.common.refresh}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
