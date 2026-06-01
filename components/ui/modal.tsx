"use client";

import { useState } from "react";
import { Dialog } from "./dialog";

interface ModalProps {
  title: string;
  description?: string;
  trigger: React.ReactNode;
  children: (close: () => void) => React.ReactNode;
}

export function Modal({ title, description, trigger, children }: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div onClick={() => setIsOpen(true)} className="inline-block">
        {trigger}
      </div>
      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
      >
        {description && (
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
        )}
        {children(() => setIsOpen(false))}
      </Dialog>
    </>
  );
}
