'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// TOAST NOTIFICATION SYSTEM FOR FOODIES ZIMBABWE
// ═════════════════════════════════════════════════════════════════════════════

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast = { ...toast, id };
    
    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration (default 5s)
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);
  }, [removeToast]);

  const success = useCallback((title: string, message?: string) => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const error = useCallback((title: string, message?: string) => {
    addToast({ type: 'error', title, message, duration: 8000 });
  }, [addToast]);

  const warning = useCallback((title: string, message?: string) => {
    addToast({ type: 'warning', title, message });
  }, [addToast]);

  const info = useCallback((title: string, message?: string) => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return { 
          icon: <CheckCircle className="w-5 h-5 text-[#24a148]" />,
          borderColor: '#24a148',
          bgColor: '#f2fcf4',
        };
      case 'error':
        return { 
          icon: <AlertCircle className="w-5 h-5 text-[#da1e28]" />,
          borderColor: '#da1e28',
          bgColor: '#fff0f0',
        };
      case 'warning':
        return { 
          icon: <AlertTriangle className="w-5 h-5 text-[#f1c21b]" />,
          borderColor: '#f1c21b',
          bgColor: '#fdf9e7',
        };
      case 'info':
      default:
        return { 
          icon: <Info className="w-5 h-5 text-[#0f62fe]" />,
          borderColor: '#0f62fe',
          bgColor: '#edf5ff',
        };
    }
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, warning, info }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm">
        {toasts.map(toast => {
          const styles = getToastStyles(toast.type);
          
          return (
            <div
              key={toast.id}
              className="flex items-start gap-3 p-4 bg-white border-l-4 shadow-lg animate-in slide-in-from-right"
              style={{ borderLeftColor: styles.borderColor, backgroundColor: styles.bgColor }}
            >
              {styles.icon}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#161616]">{toast.title}</p>
                {toast.message && (
                  <p className="text-sm text-[#6f6f6f] mt-1">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 hover:bg-black/10 rounded flex-shrink-0"
              >
                <X className="w-4 h-4 text-[#525252]" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
