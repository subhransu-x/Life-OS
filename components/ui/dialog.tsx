"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Dialog({ isOpen, onClose, title, children }: DialogProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    requestAnimationFrame(() => {
      if (active) setMounted(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mounted]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background/60 backdrop-blur-md transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog container */}
      <div className="relative w-full max-w-lg bg-surface-elevated/95 backdrop-blur-md border border-border/80 rounded-t-2xl sm:rounded-2xl shadow-2xl z-10 overflow-hidden transform transition-all flex flex-col max-h-[85vh] sm:max-h-[90vh] animate-in slide-in-from-bottom-4 duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/40">
          <h3 className="text-lg font-semibold font-display tracking-tight text-foreground">{title}</h3>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-surface/80 text-muted-foreground hover:text-foreground transition-colors outline-none focus:ring-1 focus:ring-ring"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
