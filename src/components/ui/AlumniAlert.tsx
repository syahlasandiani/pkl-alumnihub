"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

interface AlumniAlertProps {
  isOpen: boolean;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

export default function AlumniAlert({ 
  isOpen, 
  type, 
  title, 
  message, 
  onClose,
  onConfirm 
}: AlumniAlertProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show && !isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-6 transition-all duration-300 ${
      isOpen ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full max-w-sm overflow-hidden rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${
        isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
      }`}>
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`mb-6 flex h-20 w-20 items-center justify-center rounded-3xl ${
            type === 'success' ? 'bg-[#7dd3d3]/20 text-[#7dd3d3]' : 
            type === 'error' ? 'bg-red-500/20 text-red-400' : 
            'bg-blue-500/20 text-blue-400'
          }`}>
            {type === 'success' && <CheckCircle2 className="h-10 w-10" />}
            {type === 'error' && <AlertCircle className="h-10 w-10" />}
            {type === 'info' && <Info className="h-10 w-10" />}
          </div>

          <h3 className="mb-2 text-2xl font-bold text-white">
            {title}
          </h3>
          <p className="mb-8 text-sm leading-relaxed text-white/60">
            {message}
          </p>

          <button
            onClick={() => {
              onClose();
              if (onConfirm) onConfirm();
            }}
            className="w-full rounded-2xl bg-white/10 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/20 active:scale-95 border border-white/5"
          >
            {type === 'success' ? 'Oke, Mantap!' : 'Tutup'}
          </button>
        </div>
      </div>
    </div>
  );
}
