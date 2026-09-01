import React from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  React.useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div 
      id="app-notification-toast"
      className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#1E1A17] text-[#FAF7F2] border border-[#C59B27]/40 px-5 py-2.5 shadow-2xl flex items-center gap-3 text-xs tracking-wider font-sans-ui animate-in fade-in slide-in-from-bottom-3 duration-200"
    >
      <div className="w-4 h-4 bg-[#C59B27] rounded-full flex items-center justify-center text-[#1E1A17]">
        <Check className="w-2.5 h-2.5 stroke-[3]" />
      </div>
      <span>{message}</span>
    </div>
  );
};
