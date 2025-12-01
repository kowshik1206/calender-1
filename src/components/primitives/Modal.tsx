import React, { useEffect, useRef, useCallback } from 'react';
import clsx from 'clsx';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const Modal = React.memo<ModalProps>(({ isOpen, onClose, title, children, size = 'md' }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      
      // Focus first focusable element
      setTimeout(() => {
        const focusable = modalRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }, 0);

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
        previousActiveElement.current?.focus();
      };
    }
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        className={clsx(
          'bg-white rounded-2xl shadow-2xl w-full border border-neutral-100 animate-slideUp',
          sizeStyles[size as keyof typeof sizeStyles],
          'max-h-[90vh] overflow-y-auto'
        )}
      >
        <div className="sticky top-0 bg-gradient-to-r from-white via-neutral-50 to-white border-b border-neutral-200/50 px-6 py-5 flex items-center justify-between backdrop-blur-sm z-10">
          <h2 id="modal-title" className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 focus-ring rounded-lg p-2 transition-all duration-200 hover:rotate-90"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

export default Modal;
