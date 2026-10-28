import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { UI } from '../../constants/index.ts';

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
  ariaLabel?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = UI.defaults.selectPlaceholder,
  className = '',
  buttonClassName = '',
  disabled = false,
  ariaLabel
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const selectedOption = options.find((opt) => opt.value === value);

  // Immediately calculate position to fit viewport without animation
  const updatePosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const margin = 8; // Consistent spacing from viewport edge
    const minHeight = 120;
    const preferredMaxHeight = 260;

    // Available space
    const spaceBelow = viewportHeight - triggerRect.bottom - margin;
    const spaceAbove = triggerRect.top - margin;

    const placeAbove = spaceBelow < minHeight && spaceAbove > spaceBelow;
    const availableHeight = placeAbove ? spaceAbove : spaceBelow;
    const calculatedMaxHeight = Math.max(minHeight, Math.min(preferredMaxHeight, availableHeight));

    // Calculate left & width
    const minWidth = triggerRect.width;
    let left = triggerRect.left;
    let width = triggerRect.width;

    // Prevent clipping on right edge
    if (left + width > viewportWidth - margin) {
      left = Math.max(margin, viewportWidth - width - margin);
    }
    // Prevent clipping on left edge
    if (left < margin) {
      left = margin;
      width = Math.min(width, viewportWidth - margin * 2);
    }

    const newStyle: React.CSSProperties = {
      position: 'fixed',
      left: `${Math.round(left)}px`,
      width: `${Math.round(width)}px`,
      minWidth: `${Math.min(minWidth, viewportWidth - margin * 2)}px`,
      maxHeight: `${Math.round(calculatedMaxHeight)}px`,
      zIndex: 9999
    };

    if (placeAbove) {
      newStyle.bottom = `${Math.round(viewportHeight - triggerRect.top + 4)}px`;
    } else {
      newStyle.top = `${Math.round(triggerRect.bottom + 4)}px`;
    }

    setDropdownStyle(newStyle);
  };

  useLayoutEffect(() => {
    if (isOpen) {
      updatePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleImmediateUpdate = () => {
      updatePosition();
      requestAnimationFrame(updatePosition);
    };

    // Close on click outside
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    // Close on ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('resize', handleImmediateUpdate);
    window.addEventListener('orientationchange', handleImmediateUpdate);
    window.addEventListener('scroll', handleImmediateUpdate, true);

    const orientation = window.screen?.orientation;
    if (orientation) {
      orientation.addEventListener('change', handleImmediateUpdate);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('resize', handleImmediateUpdate);
      window.removeEventListener('orientationchange', handleImmediateUpdate);
      window.removeEventListener('scroll', handleImmediateUpdate, true);
      if (orientation) {
        orientation.removeEventListener('change', handleImmediateUpdate);
      }
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className={`relative inline-block w-full text-left ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel || selectedOption?.label || placeholder}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg text-slate-800 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${buttonClassName}`}
      >
        <span className="text-left flex items-center gap-2 min-w-0 break-words">
          {selectedOption?.icon}
          <span className="break-words">{selectedOption ? selectedOption.label : placeholder}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            role="listbox"
            className="bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden flex flex-col focus:outline-none"
          >
            <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-1 space-y-0.5 divide-y divide-slate-50">
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={option.disabled}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-lg text-left ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    } disabled:opacity-40 disabled:pointer-events-none`}
                  >
                    <span className="flex items-center gap-2 min-w-0 break-words flex-1">
                      {option.icon}
                      <span className="break-words">{option.label}</span>
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
