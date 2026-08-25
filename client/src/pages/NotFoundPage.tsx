import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
      <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-2xl border border-indigo-100">
        404
      </div>
      <h2 className="text-xl font-bold text-slate-800">ไม่พบหน้าที่คุณต้องการ</h2>
      <p className="text-sm text-slate-500 max-w-sm">
        หน้าที่คุณกำลังเข้าถึงไม่มีอยู่ในระบบ หรือถูกย้ายไปแล้ว
      </p>
      <Button
        variant="primary"
        onClick={() => navigate(ROUTES.DASHBOARD)}
        leftIcon={<Home className="w-4 h-4" />}
      >
        กลับหน้าภาพรวม
      </Button>
    </div>
  );
};
