import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', size = 28, showText = true }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Minimal Continuity & Renewal Symbol */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-brand-600 dark:text-brand-400"
        >
          {/* Outer continuous curve */}
          <path
            d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C21.3045 28 25.803 24.5574 27.3512 19.5"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Inner memory node curve */}
          <path
            d="M16 10C12.6863 10 10 12.6863 10 16C10 19.3137 12.6863 22 16 22C18.6522 22 20.9015 20.2787 21.6756 17.75"
            stroke="currentColor"
            strokeWidth="2.8"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Focal renewal dot */}
          <circle cx="16" cy="16" r="2.5" fill="currentColor" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight leading-none">
            RenewalOS
          </span>
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-wide mt-0.5">
            Customer Memory Workspace
          </span>
        </div>
      )}
    </div>
  );
};
