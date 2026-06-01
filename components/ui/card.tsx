import * as React from "react";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border border-border bg-surface text-foreground shadow-sm ${className || ""}`}
    {...props}
  />
))
Card.displayName = "Card"

export { Card }
