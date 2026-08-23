import React from 'react';

export default function ProgressCircle({
  percentage = 0,
  taken = 0,
  total = 0,
  size = 180,
  strokeWidth = 14
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const validPercentage = Math.min(100, Math.max(0, percentage));
  const strokeDashoffset = circumference - (validPercentage / 100) * circumference;

  let strokeColor = '#2A7DE1'; // Primary
  let statusText = 'In Progress';
  let badgeColor = 'bg-primary-50 text-primary-700 border-primary-200';

  if (validPercentage === 100 && total > 0) {
    strokeColor = '#00C9A7'; // Success
    statusText = 'Completed';
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (validPercentage >= 75) {
    strokeColor = '#2A7DE1';
    statusText = 'On Track';
    badgeColor = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (validPercentage >= 50) {
    strokeColor = '#FFB800'; // Warning
    statusText = 'Pending Doses';
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
  } else {
    strokeColor = '#FF6B6B'; // Danger
    statusText = 'Attention Needed';
    badgeColor = 'bg-rose-50 text-rose-700 border-rose-200';
  }

  return (
    <div className="flex flex-col items-center justify-center relative">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90 origin-center"
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#E2E8F0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
          <span className="text-3xl sm:text-4xl font-black text-text tracking-tight">
            {validPercentage}%
          </span>
          <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
            {taken} of {total} doses
          </span>
        </div>
      </div>

      <div className={`mt-3 px-3 py-1 rounded-full text-xs font-bold border ${badgeColor}`}>
        {statusText}
      </div>
    </div>
  );
}
