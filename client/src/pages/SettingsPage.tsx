import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAppStore } from '../stores/appStore';
import { useUiStore } from '../stores/uiStore';
import { School, Clock, User, Save, RotateCcw } from 'lucide-react';
import { ConfirmDialog } from '../components/dialogs/ConfirmDialog';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useAppStore();
  const { addToast } = useUiStore();

  const [schoolName, setSchoolName] = useState(settings.schoolName);
  const [schoolTerm, setSchoolTerm] = useState(settings.schoolTerm);
  const [schoolYear, setSchoolYear] = useState(settings.schoolYear);
  const [lateCutoffTime, setLateCutoffTime] = useState(settings.lateCutoffTime);
  const [morningCutoffTime, setMorningCutoffTime] = useState(settings.morningCutoffTime);
  const [teacherName, setTeacherName] = useState(settings.teacherName);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      schoolName,
      schoolTerm,
      schoolYear,
      lateCutoffTime,
      morningCutoffTime,
      teacherName,
    });
    addToast({
      type: 'success',
      title: 'บันทึกการตั้งค่าแล้ว',
      message: 'ข้อมูลการตั้งค่าระบบได้รับการอัปเดตเรียบร้อย',
    });
  };

  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="ตั้งค่าระบบ (Settings)"
        subtitle="กำหนดค่าโรงเรียน ปีการศึกษา และเงื่อนไขการตัดสาย"
      />

      <form onSubmit={handleSave} className="space-y-5">
        {/* School Info */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <School className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">ข้อมูลสถานศึกษา</h3>
              <p className="text-xs text-slate-500">ชื่อโรงเรียนและภาคเรียนปัจจุบัน</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-3">
              <Input
                label="ชื่อโรงเรียน / สถานศึกษา"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
              />
            </div>
            <Input
              label="ภาคเรียน"
              value={schoolTerm}
              onChange={(e) => setSchoolTerm(e.target.value)}
              placeholder="เช่น 1 หรือ 2"
            />
            <Input
              label="ปีการศึกษา (พ.ศ.)"
              value={schoolYear}
              onChange={(e) => setSchoolYear(e.target.value)}
              placeholder="เช่น 2569"
            />
            <Input
              label="ชื่อครูผู้บันทึกหลัก"
              value={teacherName}
              onChange={(e) => setTeacherName(e.target.value)}
            />
          </div>
        </Card>

        {/* Time Cutoffs */}
        <Card className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
            <Clock className="w-5 h-5 text-amber-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-800">เวลาตัดรอบการเช็คชื่อ</h3>
              <p className="text-xs text-slate-500">กำหนดเวลาเข้าแถวและเวลาตัดเป็นมาสาย</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              type="time"
              label="เวลาตัด 'มาสาย' (เข้าแถวเช้า)"
              value={lateCutoffTime}
              onChange={(e) => setLateCutoffTime(e.target.value)}
              helperText="นักเรียนที่สแกนหลังเวลานี้จะถูกจัดเป็น 'มาสาย'"
            />
            <Input
              type="time"
              label="เวลาเริ่มคาบแรก"
              value={morningCutoffTime}
              onChange={(e) => setMorningCutoffTime(e.target.value)}
              helperText="เวลาเริ่มต้นการเรียนการสอนคาบที่ 1"
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsResetDialogOpen(true)}
            leftIcon={<RotateCcw className="w-4 h-4 text-rose-500" />}
            className="text-rose-600 hover:border-rose-300"
          >
            รีเซ็ตข้อมูลเริ่มต้น (Demo Data)
          </Button>

          <Button type="submit" variant="primary" size="md" leftIcon={<Save className="w-4 h-4" />}>
            บันทึกการตั้งค่า
          </Button>
        </div>
      </form>

      <ConfirmDialog
        isOpen={isResetDialogOpen}
        onClose={() => setIsResetDialogOpen(false)}
        onConfirm={handleResetData}
        title="รีเซ็ตข้อมูลทั้งหมด"
        message="การดำเนินการนี้จะลบข้อมูลที่บันทึกไว้ในแคชทั้งหมด และรีโหลดข้อมูลตัวอย่างเริ่มต้น คุณแน่ใจหรือไม่?"
        isDangerous
      />
    </div>
  );
};
