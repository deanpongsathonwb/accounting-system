import React, { useState } from 'react';
import { ShieldCheck, Play, CheckCircle2, AlertCircle } from 'lucide-react';
import { Header } from '../../components/layout/Header.tsx';
import { UI } from '../../constants/index.ts';
import { useAppStore } from '../../stores/app.store.ts';

export const CompliancePage: React.FC = () => {
  const accounts = useAppStore((state) => state.accounts);
  const journals = useAppStore((state) => state.journals);
  const settings = useAppStore((state) => state.settings);
  const [hasRun, setHasRun] = useState(false);

  const debitSum = accounts.filter((a) => a.normalBalance === 'debit').reduce((s, a) => s + a.balance, 0);
  const creditSum = accounts.filter((a) => a.normalBalance === 'credit').reduce((s, a) => s + a.balance, 0);
  const isTrialBalanced = debitSum === creditSum;

  const allJournalsBalanced = journals.every((j) => {
    const deb = j.lines.reduce((s, l) => s + l.debit, 0);
    const crd = j.lines.reduce((s, l) => s + l.credit, 0);
    return deb === crd;
  });

  const hasTaxId = Boolean(settings.taxId && settings.taxId.length === 13);

  const checks = [
    {
      title: UI.accountant.trialBalanceTitle,
      passed: isTrialBalanced,
      desc: UI.accountant.accountingEquationCheck
    },
    {
      title: UI.accountant.journalTitle,
      passed: allJournalsBalanced,
      desc: UI.accountant.balancedStatus
    },
    {
      title: UI.settingsFields.taxId,
      passed: hasTaxId,
      desc: settings.taxId
    }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0">
      <Header
        title={UI.auditor.complianceTitle}
        subtitle={UI.auditor.complianceSubtitle}
      />

      <div className="p-4 sm:p-6 md:p-8 space-y-6 max-w-full">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                {UI.auditor.complianceTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {UI.auditor.complianceSubtitle}
              </p>
            </div>
          </div>

          <button
            onClick={() => setHasRun(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
          >
            <Play className="w-4 h-4" />
            <span>{UI.auditor.runAuditCheck}</span>
          </button>
        </div>

        {/* Checks List */}
        <div className="space-y-3 sm:space-y-4">
          {checks.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className={`w-9 sm:w-10 h-9 sm:h-10 rounded-full flex items-center justify-center shrink-0 ${
                    item.passed
                      ? 'bg-emerald-50 text-emerald-600'
                      : 'bg-rose-50 text-rose-600'
                  }`}
                >
                  {item.passed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                </div>
              </div>

              <span
                className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold border ${
                  item.passed
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {item.passed ? UI.auditor.auditStatusNormal : UI.common.error}
              </span>
            </div>
          ))}
        </div>

        {hasRun && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium">{UI.auditor.auditPassed}</p>
          </div>
        )}
      </div>
    </div>
  );
};
