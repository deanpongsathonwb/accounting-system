import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { UI } from '../../constants/index.ts';

export interface DatePickerProps {
  value: string; // Format: YYYY-MM-DD
  onChange: (dateStr: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

const THAI_MONTHS = UI.datePicker.months;
const WEEKDAYS = UI.datePicker.weekdays;

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = UI.datePicker.placeholder,
  className = '',
  disabled = false,
  ariaLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize calendar view year/month based on current value or today
  const initialDate = value ? new Date(value) : new Date();
  const validInitialDate = isNaN(initialDate.getTime()) ? new Date() : initialDate;

  const [viewYear, setViewYear] = useState<number>(validInitialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(validInitialDate.getMonth());

  // Update view when modal opens or value changes
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value, isOpen]);

  // Lock background scroll when calendar modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyOverflow = document.body.style.overflow;

    const applyLock = () => {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    };

    applyLock();

    const handleResize = () => applyLock();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.overflow = originalBodyOverflow;
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const monthStr = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    const dateFormatted = `${viewYear}-${monthStr}-${dayStr}`;
    onChange(dateFormatted);
    setIsOpen(false);
  };

  const handleSelectToday = () => {
    const today = new Date();
    const yearStr = today.getFullYear();
    const monthStr = String(today.getMonth() + 1).padStart(2, '0');
    const dayStr = String(today.getDate()).padStart(2, '0');
    onChange(`${yearStr}-${monthStr}-${dayStr}`);
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
  };

  // Generate days matrix
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  // Days from previous month to pad start
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();
  const prevMonthDays = Array.from(
    { length: firstDayOfWeek },
    (_, i) => daysInPrevMonth - firstDayOfWeek + i + 1
  );

  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Total grid 35 or 42
  const totalShown = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalShown <= 35 ? 35 - totalShown : 42 - totalShown;
  const nextMonthDays = Array.from({ length: nextMonthDaysCount }, (_, i) => i + 1);

  // Today comparison
  const today = new Date();
  const isCurrentMonthToday =
    today.getFullYear() === viewYear && today.getMonth() === viewMonth;

  // Selected date comparison
  const selectedDate = value ? new Date(value) : null;
  const isSelectedDay = (day: number) => {
    if (!selectedDate || isNaN(selectedDate.getTime())) return false;
    return (
      selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
    );
  };

  return (
    <div className={`relative inline-block w-full ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(true)}
        aria-label={ariaLabel || placeholder}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-left font-mono"
      >
        <span className={value ? 'text-slate-900 font-medium' : 'text-slate-400 font-sans'}>
          {value || placeholder}
        </span>
        <CalendarIcon className="w-4 h-4 text-slate-400 shrink-0" />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsOpen(false);
              }
            }}
          >
            <div
              className="relative w-full max-w-[320px] bg-white rounded-2xl border border-slate-200 shadow-2xl p-4 overflow-hidden flex flex-col focus:outline-none"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={UI.datePicker.calendarAria}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                  <CalendarIcon className="w-4 h-4 text-blue-600" />
                  <span>
                    {THAI_MONTHS[viewMonth]} {viewYear + 543} ({viewYear})
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                    aria-label={UI.datePicker.prevMonth}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg"
                    aria-label={UI.datePicker.nextMonth}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg ml-1"
                    aria-label={UI.common.close}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Weekday Labels */}
              <div className="grid grid-cols-7 gap-1 text-center py-2 text-xs font-semibold text-slate-400 border-b border-slate-50">
                {WEEKDAYS.map((wd, i) => (
                  <div key={i} className="py-1">
                    {wd}
                  </div>
                ))}
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-1 py-2 text-center text-xs">
                {/* Prev Month Days */}
                {prevMonthDays.map((d, i) => (
                  <div key={`prev-${i}`} className="p-1.5 text-slate-300 pointer-events-none">
                    {d}
                  </div>
                ))}

                {/* Current Month Days */}
                {currentMonthDays.map((day) => {
                  const isSelected = isSelectedDay(day);
                  const isToday = isCurrentMonthToday && today.getDate() === day;

                  return (
                    <button
                      key={`day-${day}`}
                      type="button"
                      onClick={() => handleSelectDay(day)}
                      className={`p-1.5 rounded-lg text-xs font-semibold transition-none ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : isToday
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}

                {/* Next Month Days */}
                {nextMonthDays.map((d, i) => (
                  <div key={`next-${i}`} className="p-1.5 text-slate-300 pointer-events-none">
                    {d}
                  </div>
                ))}
              </div>

              {/* Footer Quick Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleSelectToday}
                  className="px-2.5 py-1 font-semibold text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  {UI.datePicker.today}
                </button>

                <div className="flex items-center gap-2">
                  {value && (
                    <button
                      type="button"
                      onClick={handleClear}
                      className="px-2.5 py-1 text-slate-500 hover:text-rose-600 rounded-md font-semibold"
                    >
                      {UI.datePicker.clear}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold"
                  >
                    {UI.common.close}
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
