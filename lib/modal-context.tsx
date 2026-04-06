'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

// ═════════════════════════════════════════════════════════════════════════════
// MODAL SYSTEM FOR FOODIES ZIMBABWE
// Centralized modal management with multiple modal types
// ═════════════════════════════════════════════════════════════════════════════

type ModalType = 'confirm' | 'alert' | 'form' | 'success' | 'error';

interface ModalConfig {
  id: string;
  type: ModalType;
  title: string;
  message?: string;
  content?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

interface ModalContextType {
  modals: ModalConfig[];
  openModal: (config: Omit<ModalConfig, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;
  confirm: (options: { title: string; message: string; onConfirm: () => void; confirmLabel?: string }) => void;
  alert: (options: { title: string; message: string; type?: 'info' | 'warning' | 'error' }) => void;
  success: (options: { title: string; message: string }) => void;
  error: (options: { title: string; message: string }) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modals, setModals] = useState<ModalConfig[]>([]);

  const openModal = useCallback((config: Omit<ModalConfig, 'id'>) => {
    const id = `modal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const modal = { ...config, id };
    setModals(prev => [...prev, modal]);
    return id;
  }, []);

  const closeModal = useCallback((id: string) => {
    setModals(prev => prev.filter(m => m.id !== id));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals([]);
  }, []);

  const confirm = useCallback((options: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmLabel?: string;
  }) => {
    let modalId: string;
    modalId = openModal({
      type: 'confirm',
      title: options.title,
      message: options.message,
      confirmLabel: options.confirmLabel || 'Confirm',
      cancelLabel: 'Cancel',
      onConfirm: () => {
        options.onConfirm();
        closeModal(modalId);
      },
      onCancel: () => closeModal(modalId),
      size: 'md',
    });
  }, [openModal, closeModal]);

  const alert = useCallback((options: { 
    title: string; 
    message: string; 
    type?: 'info' | 'warning' | 'error';
  }) => {
    openModal({
      type: 'alert',
      title: options.title,
      message: options.message,
      confirmLabel: 'OK',
      size: 'sm',
    });
  }, [openModal]);

  const success = useCallback((options: { title: string; message: string }) => {
    openModal({
      type: 'success',
      title: options.title,
      message: options.message,
      confirmLabel: 'Done',
      size: 'sm',
    });
  }, [openModal]);

  const error = useCallback((options: { title: string; message: string }) => {
    openModal({
      type: 'error',
      title: options.title,
      message: options.message,
      confirmLabel: 'Close',
      size: 'sm',
    });
  }, [openModal]);

  const getModalIcon = (type: ModalType) => {
    switch (type) {
      case 'confirm': return <AlertCircle className="w-6 h-6 text-[#F5C518]" />;
      case 'success': return <CheckCircle className="w-6 h-6 text-[#24a148]" />;
      case 'error': return <AlertCircle className="w-6 h-6 text-[#da1e28]" />;
      case 'alert': return <Info className="w-6 h-6 text-[#0f62fe]" />;
      default: return null;
    }
  };

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <ModalContext.Provider value={{ 
      modals, 
      openModal, 
      closeModal, 
      closeAllModals,
      confirm,
      alert,
      success,
      error,
    }}>
      {children}
      
      {/* Modal Portal */}
      {modals.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => closeModal(modals[modals.length - 1]?.id)}
          />
          
          {/* Active Modal */}
          {modals.map((modal, index) => (
            <div
              key={modal.id}
              className={`relative bg-white w-full ${sizeClasses[modal.size || 'md']} shadow-xl z-10 ${
                index === modals.length - 1 ? 'block' : 'hidden'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-[#e0e0e0]">
                <div className="flex items-center gap-3">
                  {getModalIcon(modal.type)}
                  <h3 className="text-lg font-medium text-[#161616]">{modal.title}</h3>
                </div>
                <button
                  onClick={() => closeModal(modal.id)}
                  className="p-1 hover:bg-[#f4f4f4] rounded"
                >
                  <X className="w-5 h-5 text-[#525252]" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {modal.message && (
                  <p className="text-[#6f6f6f]">{modal.message}</p>
                )}
                {modal.content}
              </div>

              {/* Footer */}
              {(modal.type === 'confirm' || modal.onConfirm) && (
                <div className="flex justify-end gap-3 p-4 border-t border-[#e0e0e0]">
                  {modal.cancelLabel && (
                    <button
                      onClick={() => {
                        modal.onCancel?.();
                        closeModal(modal.id);
                      }}
                      className="px-4 py-2 border border-[#8d8d8d] text-[#525252] hover:bg-[#f4f4f4]"
                    >
                      {modal.cancelLabel}
                    </button>
                  )}
                  {modal.confirmLabel && (
                    <button
                      onClick={() => {
                        modal.onConfirm?.();
                        closeModal(modal.id);
                      }}
                      className={`px-4 py-2 font-medium ${
                        modal.type === 'error' 
                          ? 'bg-[#da1e28] text-white hover:bg-[#b91c1c]' :
                        modal.type === 'success'
                          ? 'bg-[#24a148] text-white hover:bg-[#1e8a3c]'
                          : 'bg-[#F5C518] text-[#161616] hover:bg-[#e5b518]'
                      }`}
                    >
                      {modal.confirmLabel}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
