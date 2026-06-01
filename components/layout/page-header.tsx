import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 md:px-8 lg:px-10 py-6 glass -mx-4 md:-mx-8 lg:-mx-10 mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1 tracking-wide">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
