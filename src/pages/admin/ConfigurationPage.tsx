import React, { useState } from 'react';
import { ui } from '../../constants/index.ts';
import type { SystemSettings } from '../../types/common.types.ts';
import { Save, CheckCircle2 } from 'lucide-react';
import { renderSemantic } from '../../utils/text.tsx';

interface ConfigurationPageProps {
  settings: SystemSettings;
  onUpdateSettings: (settings: SystemSettings) => void;
}

export const ConfigurationPage: React.FC<ConfigurationPageProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [formData, setFormData] = useState<SystemSettings>({ ...settings });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-snug break-words">
          {renderSemantic(ui.admin.configuration.title)}
        </h2>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed break-words">
          {renderSemantic(ui.admin.configuration.description)}
        </p>
      </div>

      {showSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="break-words leading-relaxed">{renderSemantic(ui.admin.configuration.configSavedSuccess)}</span>
        </div>
      )}

      {/* Configuration Form covering 100% of items in settings.json */}
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Section 1: Entity Profile */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 whitespace-nowrap shrink-0">
            {renderSemantic(ui.admin.configuration.companySection)}
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 whitespace-nowrap shrink-0">
                {ui.admin.configuration.systemOwnerLabel}
              </label>
              <input
                type="text"
                value={formData.systemOwner}
                onChange={(e) => setFormData({ ...formData, systemOwner: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md outline-hidden focus:border-sky-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 whitespace-nowrap shrink-0">
                  {ui.admin.configuration.taxIdLabel}
                </label>
                <input
                  type="text"
                  value={formData.taxId}
                  onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono outline-hidden focus:border-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 whitespace-nowrap shrink-0">
                  {ui.admin.configuration.accountingStandardLabel}
                </label>
                <input
                  type="text"
                  value={formData.accountingStandard}
                  onChange={(e) =>
                    setFormData({ ...formData, accountingStandard: e.target.value })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md outline-hidden focus:border-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 whitespace-nowrap shrink-0">
                {ui.admin.configuration.addressLabel}
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md outline-hidden focus:border-sky-500 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Fiscal & Accounting Policies */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 whitespace-nowrap shrink-0">
            {renderSemantic(ui.admin.configuration.fiscalSection)}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 whitespace-nowrap shrink-0">
                {ui.admin.configuration.fiscalYearLabel}
              </label>
              <input
                type="number"
                value={formData.fiscalYear}
                onChange={(e) =>
                  setFormData({ ...formData, fiscalYear: parseInt(e.target.value) || settings.fiscalYear })
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 whitespace-nowrap shrink-0">
                {ui.admin.configuration.invoiceDueDaysLabel}
              </label>
              <input
                type="number"
                value={formData.invoiceDueDays}
                onChange={(e) =>
                  setFormData({ ...formData, invoiceDueDays: parseInt(e.target.value) || settings.invoiceDueDays })
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 whitespace-nowrap shrink-0">
                {ui.admin.configuration.taxRateLabel}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.taxRatePercent}
                onChange={(e) =>
                  setFormData({ ...formData, taxRatePercent: parseFloat(e.target.value) || settings.taxRatePercent })
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono outline-hidden focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 whitespace-nowrap shrink-0">
                {ui.admin.configuration.withholdingTaxRateLabel}
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.withholdingTaxPercent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    withholdingTaxPercent: parseFloat(e.target.value) || settings.withholdingTaxPercent,
                  })
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md font-mono outline-hidden focus:border-sky-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoPostJournals}
                onChange={(e) =>
                  setFormData({ ...formData, autoPostJournals: e.target.checked })
                }
                className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500 shrink-0"
              />
              <span className="text-xs font-medium text-slate-700 break-words leading-relaxed">
                {ui.admin.configuration.autoPostLabel}
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 whitespace-nowrap shrink-0"
          >
            <Save className="w-4 h-4 shrink-0" />
            <span className="whitespace-nowrap shrink-0">{ui.admin.configuration.saveConfiguration}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
