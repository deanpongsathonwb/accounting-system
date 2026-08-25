import React from 'react';
import { CheckCheck, RotateCcw, ScanLine, Save } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export interface AttendanceActionControlsProps {
  onCheckAllPresent: () => void;
  onResetAll: () => void;
  onOpenScanner: () => void;
  onSave: () => void;
  isSaving?: boolean;
  isDirty?: boolean;
}

export const AttendanceActionControls: React.FC<AttendanceActionControlsProps> = ({
  onCheckAllPresent,
  onResetAll,
  onOpenScanner,
  onSave,
  isSaving,
  isDirty,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCheckAllPresent}
          leftIcon={<CheckCheck className="w-4 h-4 text-emerald-600" />}
          className="hover:border-emerald-500 hover:text-emerald-700"
        >
          มาครบทุกคน
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenScanner}
          leftIcon={<ScanLine className="w-4 h-4 text-indigo-600" />}
        >
          โหมดสแกนบาร์โค้ด
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetAll}
          leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-400" />}
        >
          ล้างค่า
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {isDirty && (
          <span className="text-xs text-amber-600 font-medium animate-pulse hidden sm:inline">
            ● มีการเปลี่ยนแปลงที่ยังไม่บันทึก
          </span>
        )}
        <Button
          variant="primary"
          size="md"
          onClick={onSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
          className="shadow-sm shadow-indigo-200"
        >
          บันทึกการเช็คชื่อ
        </Button>
      </div>
    </div>
  );
};
