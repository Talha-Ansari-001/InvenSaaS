import React from 'react';
import { HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { type Toast as ToastType } from '../hooks/useToast';

interface ToastProps {
  toasts: ToastType[];
}

const Toast: React.FC<ToastProps> = ({ toasts }) => {
  return (
    <div className="fixed bottom-5 right-5 z-[60] space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center space-x-3 rounded-lg px-4 py-3 shadow-lg transition-all animate-in slide-in-from-right ${
            toast.type === 'success' ? 'bg-green-600 text-white' : 
            toast.type === 'error' ? 'bg-red-600 text-white' : 
            'bg-indigo-600 text-white'
          }`}
        >
          {toast.type === 'success' ? <HiCheckCircle className="h-5 w-5" /> : <HiExclamationCircle className="h-5 w-5" />}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
