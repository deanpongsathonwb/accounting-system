import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { apiClient } from '../services/apiClient';
import { API_ENDPOINTS } from '../constants/api';
import { getDefaultRouteForRole } from '../constants/routes';
import { School, Lock, User, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useUiStore } from '../stores/uiStore';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, login } = useAuthStore();
  const { addToast } = useUiStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // If already authenticated, redirect directly to user's portal
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      const destination = getDefaultRouteForRole(user.role);
      navigate(destination, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      setErrorMessage('กรุณากรอกชื่อผู้ใช้งาน');
      return;
    }
    if (!password) {
      setErrorMessage('กรุณากรอกรหัสผ่าน');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH_LOGIN, {
        username: trimmedUsername,
        password,
      });

      const data = response.data?.data;
      if (!data || !data.token || !data.user) {
        throw new Error('ไม่พบข้อมูลการยืนยันตัวตนจากเซิร์ฟเวอร์');
      }

      login(data.user, data.token);

      addToast({
        type: 'success',
        title: 'เข้าสู่ระบบสำเร็จ',
        message: `ยินดีต้อนรับ ${data.user.name}`,
      });

      const portalRoute = getDefaultRouteForRole(data.user.role);
      navigate(portalRoute, { replace: true });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* System Emblem & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 mb-4">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            ระบบบันทึกและจัดการการเช็คชื่อนักเรียน
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Student Attendance Management System
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-800">เข้าสู่ระบบ (Sign In)</h2>
            <p className="text-xs text-slate-500 mt-1">
              กรุณาป้อนชื่อผู้ใช้งานและรหัสผ่านเพื่อเข้าใช้งานระบบ
            </p>
          </div>

          {errorMessage && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                ชื่อผู้ใช้งาน (Username)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="กรอกชื่อผู้ใช้งาน"
                  disabled={isLoading}
                  autoFocus
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="กรอกรหัสผ่าน"
                  disabled={isLoading}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 focus:bg-white transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>กำลังตรวจสอบสิทธิ์...</span>
                  </>
                ) : (
                  <span>เข้าสู่ระบบ</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Production Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>ระบบบริหารจัดการงานสถานศึกษาและเช็คชื่อนักเรียน</p>
          <p className="mt-1">สงวนลิขสิทธิ์ความปลอดภัยตามมาตรฐานข้อมูลส่วนบุคคล</p>
        </div>
      </div>
    </div>
  );
};
