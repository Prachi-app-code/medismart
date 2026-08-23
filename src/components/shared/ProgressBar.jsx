import React from 'react';

export default function ProgressBar({
  value = 0,
  max = 100,
  label = '',
  showValue = true,
  color = 'primary',
  size = 'md',
  className = ''
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const colorClasses = {
    primary: 'bg-primary-500',
    success: 'bg-success',
    danger: 'bg-danger',
    warning: 'bg-warning',
  };

  const heightClasses = {
    sm: 'h-2',
    md: 'h-3.5',
    lg: 'h-5'
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5 text-sm font-medium text-slate-700">
          <span>{label}</span>
          {showValue && <span className="font-bold text-text">{percentage}%</span>}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full bg-slate-100 rounded-full overflow-hidden ${heightClasses[size] || heightClasses.md}`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colorClasses[color] || colorClasses.primary}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
