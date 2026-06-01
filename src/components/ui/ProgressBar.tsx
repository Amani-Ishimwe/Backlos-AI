import React from "react";

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  className?: string;
  showPercentage?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  className = "",
  showPercentage = true,
}) => {
  const percentage = Math.min(Math.max(Math.round(value), 0), 100);

  return (
    <div className={`w-full flex flex-col space-y-1 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-brand-text mb-1">
          {label && <span>{label}</span>}
          {showPercentage && <span>{percentage}%</span>}
        </div>
      )}
      <div className="w-full h-3 bg-brand-light border border-brand-border rounded-badge overflow-hidden">
        <div
          className="h-full bg-brand-primary rounded-badge transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
