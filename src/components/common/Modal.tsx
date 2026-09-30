import React, { useEffect, useRef } from 'react';
import { ui } from '../../constants/index.ts';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string; // e.g. 'max-w-md', 'max-w-2xl', 'max-w-3xl'
}

/**
 * Reusable modal component that:
 * 1. Locks the background and hides the Main Scrollbar in both portrait and landscape
 *    orientations (including before and after rotation/resize).
 * 2. Does not require or show a scrollbar for short content.
 * 3. Allows scrolling within the Modal Content area only for long content.
 * 4. Keeps header & footer pinned, with background content locked until the modal is closed.
 * 5. Uses standard native browser scrolling (no custom scrollbars).
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = 'max-w-md',
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Helper to lock all main scrollable elements and hide their scrollbars
    const lockMainScroll = () => {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const mainContainer =
        document.getElementById('main-scroll-container') || document.querySelector('main');
      if (mainContainer) {
        mainContainer.style.overflow = 'hidden';
      }
    };

    // Initial lock
    lockMainScroll();

    // Re-enforce lock on orientation changes and window resizes
    const handleOrientationOrResize = () => {
      lockMainScroll();
    };

    window.addEventListener('resize', handleOrientationOrResize);
    window.addEventListener('orientationchange', handleOrientationOrResize);

    const mql = window.matchMedia('(orientation: portrait)');
    if (mql.addEventListener) {
      mql.addEventListener('change', handleOrientationOrResize);
    }

    // Cleanup: restore main scrollbar when modal closes
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';

      const mainContainer =
        document.getElementById('main-scroll-container') || document.querySelector('main');
      if (mainContainer) {
        mainContainer.style.overflow = '';
      }

      window.removeEventListener('resize', handleOrientationOrResize);
      window.removeEventListener('orientationchange', handleOrientationOrResize);
      if (mql.removeEventListener) {
        mql.removeEventListener('change', handleOrientationOrResize);
      }
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-xs overflow-hidden overscroll-contain select-none"
    >
      {/* Click outside backdrop to dismiss */}
      <div className="fixed inset-0 -z-10" onClick={onClose} aria-hidden="true" />

      {/* Modal Dialog Container */}
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-xl shadow-2xl border border-slate-200 flex flex-col max-h-[calc(100dvh-1.5rem)] sm:max-h-[calc(100dvh-3rem)] overflow-hidden my-auto select-auto`}
      >
        {/* Pinned Modal Header */}
        <div className="shrink-0 px-4 sm:px-6 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="text-xs sm:text-sm font-bold text-slate-900 whitespace-nowrap shrink-0">
            {title}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label={ui.common.close}
            className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {ui.common.close}
          </button>
        </div>

        {/* Modal Content Area:
            - Short content: fits within available height -> no scrollbar displayed.
            - Long content: exceeds available height -> scrollable within this content area only.
            - Background remains completely locked.
            - Standard native browser scrolling (no custom scrollbars).
        */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto min-h-0 overscroll-contain p-4 sm:p-6 space-y-4 text-xs"
        >
          {children}
        </div>

        {/* Pinned Modal Footer (if provided) */}
        {footer && (
          <div className="shrink-0 px-4 sm:px-6 py-3.5 border-t border-slate-200 flex flex-col-reverse sm:flex-row justify-end gap-2.5 bg-slate-50">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
