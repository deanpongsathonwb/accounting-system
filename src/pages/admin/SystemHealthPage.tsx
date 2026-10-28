import React, { useState } from 'react';
import { HardDrive, Database, ShieldCheck, Download, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { Alert } from '../../components/feedback/index.ts';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';

export const SystemHealthPage: React.FC = () => {
  const resetAllData = useAppStore((state) => state.resetAllData);
  const [backupSuccess, setBackupSuccess] = useState(false);

  const handleBackup = () => {
    setBackupSuccess(true);
    setTimeout(() => setBackupSuccess(false), 3000);
  };

  const handleReset = () => {
    resetAllData();
    setBackupSuccess(true);
    setTimeout(() => setBackupSuccess(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.admin.healthTitle}
        subtitle={UI.admin.healthSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <HardDrive className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {UI.admin.healthTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {UI.admin.healthSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={handleBackup}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>{UI.admin.createBackup}</span>
          </button>
        </div>

        {/* Status Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">{UI.admin.databaseStatus}</span>
              <Database className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-xl font-bold text-slate-900">{UI.admin.healthy}</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{UI.auditor.auditStatusNormal}</span>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">{UI.admin.serverUptime}</span>
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 font-mono">{UI.defaults.uptimePercent}</p>
            <p className="text-xs text-slate-500">{UI.admin.uptimeTier}</p>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-semibold">{UI.admin.storageUsed}</span>
              <HardDrive className="w-5 h-5 text-indigo-600" />
            </div>
            <p className="text-xl font-bold text-slate-900 font-mono">{UI.defaults.storageUsageText}</p>
            <p className="text-xs text-slate-500">{UI.admin.storageDescription}</p>
          </div>
        </div>

        {/* Database Management / Reset Action */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 sm:p-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-base font-bold text-slate-800">{UI.common.refresh}</h4>
            <p className="text-xs text-slate-500 mt-1">{UI.feedback.operationSuccess}</p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{UI.common.refresh}</span>
          </button>
        </div>

        {backupSuccess && (
          <Alert
            type="success"
            message={UI.feedback.operationSuccess}
          />
        )}
      </div>
    </div>
  );
};
