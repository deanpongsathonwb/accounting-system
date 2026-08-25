import React, { useState, useRef, useEffect } from 'react';
import { Modal } from '../dialogs/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { ScanLine, CheckCircle2, Search } from 'lucide-react';
import { Student } from '../../types/student';
import { AttendanceStatus } from '../../types/attendance';

export interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onCheckStudent: (studentId: string, status: AttendanceStatus) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  students,
  onCheckStudent,
}) => {
  const [code, setCode] = useState('');
  const [lastScanned, setLastScanned] = useState<Student | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setCode('');
      setLastScanned(null);
    }
  }, [isOpen]);

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const found = students.find(
      (s) => s.studentNumber === code.trim() || s.id === code.trim() || String(s.rollNumber) === code.trim()
    );

    if (found) {
      onCheckStudent(found.id, 'present');
      setLastScanned(found);
      setCode('');
    } else {
      alert(`ไม่พบรหัสนักเรียน: ${code}`);
      setCode('');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="โหมดสแกนรหัส / บาร์โค้ดเช็คชื่อเร็ว"
      description="ยิงบาร์โค้ดบัตรนักเรียน หรือพิมพ์เลขประจำตัวเพื่อเช็คชื่อ 'มาเรียน' ทันที"
      maxWidth="md"
    >
      <div className="space-y-5">
        <form onSubmit={handleScanSubmit} className="space-y-3">
          <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center gap-3">
            <div className="p-3 bg-indigo-600 text-white rounded-lg">
              <ScanLine className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <p className="text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                พร้อมรับข้อมูลบาร์โค้ด (Ready to Scan)
              </p>
              <p className="text-xs text-indigo-700">
                รองรับเครื่องอ่าน Barcode / RFID Scanner หรือพิมพ์แล้วกด Enter
              </p>
            </div>
          </div>

          <Input
            ref={inputRef}
            label="เลขประจำตัวนักเรียน หรือ เลขที่"
            placeholder="เช่น 10001, 10002..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            autoFocus
          />

          <Button type="submit" className="w-full" disabled={!code.trim()}>
            บันทึกการเช็คชื่อ
          </Button>
        </form>

        {lastScanned && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-full">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-emerald-800 font-semibold">เช็คชื่อสำเร็จ (มาเรียน)</p>
                <p className="text-sm font-bold text-slate-800">
                  เลขที่ {lastScanned.rollNumber} - {lastScanned.prefix} {lastScanned.firstName} {lastScanned.lastName}
                </p>
                <p className="text-xs text-slate-500">รหัส: {lastScanned.studentNumber}</p>
              </div>
            </div>
            <span className="text-xs font-mono bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
              {new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
