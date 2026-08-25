import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { exportToCSV } from '../../../utils/export';

export interface ExportReportButtonProps {
  filename: string;
  data: Record<string, unknown>[];
  label?: string;
}

export const ExportReportButton: React.FC<ExportReportButtonProps> = ({
  filename,
  data,
  label = 'ส่งออกรายงาน CSV',
}) => {
  const handleExport = () => {
    exportToCSV(filename, data);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      leftIcon={<Download className="w-4 h-4 text-slate-500" />}
    >
      {label}
    </Button>
  );
};
