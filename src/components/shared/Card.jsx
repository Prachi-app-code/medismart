import React from 'react';

export default function Card({
  children,
  className = '',
  interactive = false,
  onClick,
  ...props
}) {
  const baseClasses = "bg-white rounded-2xl p-5 border border-slate-100/90 shadow-card";
  const interactiveClasses = interactive ? "hover:shadow-card-hover hover:border-primary-200 transition-all duration-200 cursor-pointer active:scale-[0.99]" : "";

  return (
    <div
      onClick={onClick}
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
