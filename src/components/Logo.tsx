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
  showTagline = true,
  showSubTagline = true,
}: LogoProps) {
  // Brand colors
  const navy = '#0A2C66';
  const orange = '#F97316';

  if (variant === 'icon') {
    return (
      <svg
        id="logo-icon"
        viewBox="0 0 100 100"
        className={`h-10 w-10 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dynamic human figure reaching up */}
        <path
          d="M 25 75 Q 30 40 45 35 Q 50 30 42 22 Q 40 20 45 18 Q 55 24 50 38 Q 45 42 32 75 Z"
          fill={navy}
        />
        <circle cx="46" cy="15" r="5" fill={navy} />
        {/* Swoosh arc */}
        <path
          d="M 12 70 A 35 35 0 0 1 52 32 Q 40 45 28 65"
          fill="none"
          stroke={navy}
          strokeWidth="3"
        />
        {/* Orange star */}
        <path
          d="M 62 14 L 64 21 L 71 23 L 64 25 L 62 32 L 60 25 L 53 23 L 60 21 Z"
          fill={orange}
        />
        {/* Stylized letters R and K combined background */}
        <text
          x="35"
          y="78"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="900"
          fontSize="48"
          fill={navy}
        >
          RK
        </text>
      </svg>
    );
  }

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Logo Graphic and Text Main Group */}
      <div className="flex items-center gap-3">
        {/* SVG Graphic (High Fidelity Recreation of RK + Reaching Figure + Star Logo) */}
        <svg
          id="logo-graphic"
          viewBox="0 0 320 120"
          className="h-16 w-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="navy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#082250" />
              <stop offset="100%" stopColor="#0E3D8F" />
            </linearGradient>
            <linearGradient id="orange-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EA580C" />
              <stop offset="100%" stopColor="#F97316" />
            </linearGradient>
          </defs>

          {/* Intertwined Human figure reaching up */}
          <g transform="translate(10, 5)">
            {/* Swoosh Ring Arc */}
            <path
              d="M 20 85 A 42 42 0 0 1 74 38 Q 62 50 48 70"
              fill="none"
              stroke={navy}
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Figure Body */}
            <path
              d="M 40 85 C 44 60 55 45 66 38 C 62 34 68 28 62 21 C 67 22 71 18 73 14 C 79 26 73 40 64 48 C 55 54 47 68 42 85 Z"
              fill={navy}
            />
            {/* Figure Head */}
            <circle cx="68" cy="11" r="5" fill={navy} />
            {/* 4-point Star */}
            <path
              d="M 88 12 L 91 19 L 98 22 L 91 25 L 88 32 L 85 25 L 78 22 L 85 19 Z"
              fill={orange}
            />
          </g>

          {/* Stylized R and K letters */}
          <g transform="translate(48, 5)">
            {/* Big "R" path */}
            <path
              d="M 50 35 L 50 85 H 64 V 62 H 78 C 90 62 98 56 98 48 C 98 40 90 35 78 35 H 50 Z M 64 47 H 76 C 80 47 84 48 84 50 C 84 52 80 53 76 53 H 64 V 47 Z"
              fill="url(#navy-gradient)"
            />
            {/* R leg extending downwards styled dynamically */}
            <path
              d="M 74 61 Q 84 72 96 85 H 112 Q 98 70 82 61 Z"
              fill="url(#navy-gradient)"
            />

            {/* Big "K" with custom orange leg */}
            {/* Vertical stem of K (combined with R slightly in overlap) */}
            <path
              d="M 125 35 L 125 85 H 139 L 139 35 Z"
              fill="url(#navy-gradient)"
            />
            {/* Upper arm of K (blue) */}
            <path
              d="M 139 60 L 175 35 H 191 L 148 60 Z"
              fill="url(#navy-gradient)"
            />
            {/* Lower leg of K (orange) */}
            <path
              d="M 148 60 L 191 85 H 175 L 139 60 Z"
              fill="url(#orange-gradient)"
            />
          </g>

          {/* Turenakx text */}
          <g transform="translate(10, 85)">
            {/* Turenak in Navy Blue */}
            <text
              x="0"
              y="22"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="800"
              fontSize="34"
              letterSpacing="0.5"
              fill={variant === 'light' ? '#FFFFFF' : navy}
            >
              Turenak
            </text>
            {/* x in Orange */}
            <text
              x="138"
              y="22"
              fontFamily="system-ui, -apple-system, sans-serif"
              fontWeight="800"
              fontSize="34"
              letterSpacing="0.5"
              fill={orange}
            >
              x
            </text>
          </g>
        </svg>
      </div>

      {/* Sub-text tags matching design system precisely */}
      {showTagline && (
        <div
          className="text-[9px] tracking-[4px] font-bold mt-1.5 uppercase transition-all"
          style={{
            color: variant === 'light' ? '#E2E8F0' : navy,
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          }}
        >
          Staffing & Recruitment Agency
        </div>
      )}

      {showSubTagline && (
        <div className="flex gap-1.5 items-center mt-1 text-[7px] tracking-[2px] font-semibold uppercase">
          <span className={variant === 'light' ? 'text-white' : 'text-slate-600'}>
            Right People.
          </span>
          <span style={{ color: orange }}>Right Jobs.</span>
          <span className={variant === 'light' ? 'text-white' : 'text-slate-600'}>
            Right Future.
          </span>
        </div>
      )}
    </div>
  );
}
