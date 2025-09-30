// contexts/ToastContext.tsx
import React, { createContext, useState, ReactNode } from 'react';
import TravelToast from '@/components/toast';

type ToastType = 'success' | 'error' | 'info';

type ToastContextType = {
  showToast: (type: ToastType, message: string) => void;
};

export const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <TravelToast type={toast.type} message={toast.message} onHide={() => setToast(null)} />}
    </ToastContext.Provider>
  );
};
