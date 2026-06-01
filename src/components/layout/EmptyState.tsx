import React from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  actionHref,
}) => {
  return (
    <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-2 border-brand-border bg-slate-50/50">
      {/* Icon Circle */}
      <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center text-brand-primary text-2xl font-bold mb-4 shadow-sm select-none">
        ↺
      </div>
      
      <h3 className="text-lg font-bold text-brand-text mb-1">
        {title}
      </h3>
      
      <p className="text-sm text-brand-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button variant="primary" size="sm">
            {actionLabel}
          </Button>
        </Link>
      )}
    </Card>
  );
};

export default EmptyState;
