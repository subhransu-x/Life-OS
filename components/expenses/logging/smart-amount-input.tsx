"use client";

import { useEffect, useRef } from "react";

export function SmartAmountInput({ 
  value, 
  onChange,
  autoFocus = false
}: { 
  value: string; 
  onChange: (val: string) => void;
  autoFocus?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      // Small timeout to ensure sheet transition is done before focusing
      const t = setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits
    let rawValue = e.target.value.replace(/[^0-9]/g, ""); 
    
    // Prevent huge numbers that overflow
    if (rawValue.length > 9) {
      rawValue = rawValue.slice(0, 9);
    }

    onChange(rawValue);
  };

  const formattedValue = value ? `₹${Number(value).toLocaleString("en-IN")}` : "";

  return (
    <div className="relative w-full py-4 border-b border-border/50 bg-background/50 rounded-2xl mb-4 group focus-within:border-primary/50 transition-colors">
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        value={formattedValue}
        onChange={handleChange}
        placeholder="₹0"
        className="w-full text-center text-5xl sm:text-6xl font-black font-mono tracking-tighter bg-transparent border-none focus:ring-0 placeholder:text-muted-foreground/20 outline-none"
      />
      
      {/* Invisible ghost input for raw value to ensure native autofill behavior if needed, though mostly visual */}
    </div>
  );
}
