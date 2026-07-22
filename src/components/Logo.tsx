import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'compact' | 'light' | 'icon';
  showTagline?: boolean;
  showSubTagline?: boolean;
}

export default function Logo({
  className = '',
  variant = 'full',
}: LogoProps) {
  // Official uploaded high-resolution Turenakx logo asset
  const logoSrc = '/official_turenakx_logo.jpg';

  if (variant === 'icon') {
    return (
      <div className={`inline-flex items-center justify-center select-none overflow-hidden rounded-lg ${className}`}>
        <img
          src={logoSrc}
          alt="Turenakx RK Emblem"
          className="h-11 w-11 object-cover object-top"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <img
          src={logoSrc}
          alt="Turenakx Staffing & Recruitment Agency"
          className="h-12 w-auto object-contain max-w-[180px]"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  if (variant === 'light') {
    return (
      <div className={`inline-flex items-center select-none bg-white p-2 rounded-xl shadow-md border border-slate-200/40 max-w-[280px] ${className}`}>
        <img
          src={logoSrc}
          alt="Turenakx Staffing & Recruitment Agency"
          className="h-16 sm:h-20 w-auto object-contain max-w-full"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  // Default 'full' variant (header, login screens, main displays)
  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <img
        src={logoSrc}
        alt="Turenakx Staffing & Recruitment Agency - Right People. Right Jobs. Right Future."
        className="h-16 sm:h-20 md:h-24 w-auto object-contain max-w-full transition-all duration-200"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

