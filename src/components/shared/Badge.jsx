import React from 'react';

export default function Badge({
  children,
  variant = 'primary',
  size = 'md',
  dot = false,
  className = ''
}) {
  const variantStyles = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-200',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
    indigo: 'bg-indigo-50 text-indigo-700 border border-indigo-200'
  };

  const dotStyles = {
    primary: 'bg-primary-500',
    success: 'bg-success',
    danger: 'bg-danger',
    warning: 'bg-warning',
    neutral: 'bg-slate-400',
    indigo: 'bg-indigo-500'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-sm px-3 py-1 font-semibold',
    lg: 'text-base px-3.5 py-1.5 font-semibold'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.md} ${className}`}>
      {dot && <span className={`w-2 h-2 rounded-full ${dotStyles[variant] || 'bg-primary-500'}`} />}
      {children}
    </span>
  );
}
