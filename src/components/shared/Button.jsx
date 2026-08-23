import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  ariaLabel,
  ...props
}) {
  const baseClasses = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer min-h-[44px]";

  const variantClasses = {
    primary: "bg-primary-500 hover:bg-primary-600 text-white shadow-sm focus:ring-primary-500 active:scale-[0.98]",
    success: "bg-success hover:bg-success-dark text-white shadow-sm focus:ring-success active:scale-[0.98]",
    danger: "bg-danger hover:bg-danger-dark text-white shadow-sm focus:ring-danger active:scale-[0.98]",
    warning: "bg-warning hover:bg-warning-dark text-text shadow-sm focus:ring-warning active:scale-[0.98]",
    secondary: "bg-white text-text border border-slate-200 hover:bg-slate-50 focus:ring-primary-400 active:scale-[0.98]",
    outline: "bg-transparent border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500 active:scale-[0.98]",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-text focus:ring-slate-400 active:scale-[0.98]",
  };

  const sizeClasses = {
    sm: "px-3.5 py-2 text-sm",
    md: "px-5 py-2.5 text-base",
    lg: "px-6 py-3.5 text-lg font-bold min-h-[52px]",
  };

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.primary} ${sizeClasses[size] || sizeClasses.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
