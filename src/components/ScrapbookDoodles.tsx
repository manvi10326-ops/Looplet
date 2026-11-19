import React from 'react';

interface DoodleProps {
  className?: string;
}

/** Hand-drawn pastel yarn ball with trailing loop */
export const YarnBallDoodle: React.FC<DoodleProps> = ({ className = 'h-12 w-12' }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
    <path
      d="M18 58C10 60 6 54 11 49C16 44 21 51 16 58C12 64 5 66 4 64"
      stroke="#D78FAE"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
    <circle cx="44" cy="40" r="24" fill="#F4DDE5" stroke="#B9688A" strokeWidth="2.2" />
    <path
      d="M24 30C33 25 49 26 63 34"
      stroke="#B9688A"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path
      d="M21 40C32 34 48 35 66 43"
      stroke="#B9688A"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path
      d="M25 51C36 45 50 46 61 52"
      stroke="#B9688A"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
    <path
      d="M42 17C35 28 33 44 38 62"
      stroke="#D78FAE"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M52 18C45 29 44 45 48 63"
      stroke="#B9688A"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

/** Hand-drawn crochet hook & stitched loop */
export const CrochetHookDoodle: React.FC<DoodleProps> = ({ className = 'h-12 w-12' }) => (
  <svg viewBox="0 0 80 80" fill="none" className={className} aria-hidden="true">
    <path
      d="M16 64L56 24C60 20 65 21 66 25C67 28 64 31 61 30C59 29 59 26 61 25"
      stroke="#B9688A"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22 58L32 48"
      stroke="#F8E9B5"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M46 18C50 12 60 10 66 15"
      stroke="#D6E2C8"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeDasharray="3 4"
    />
  </svg>
);

/** Hand-drawn scalloped crochet daisy */
export const DaisyDoodle: React.FC<DoodleProps> = ({ className = 'h-10 w-10' }) => (
  <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
    <g fill="#FFFDF9" stroke="#D78FAE" strokeWidth="1.8">
      <ellipse cx="32" cy="14" rx="6.5" ry="10" />
      <ellipse cx="32" cy="50" rx="6.5" ry="10" />
      <ellipse cx="14" cy="32" rx="10" ry="6.5" />
      <ellipse cx="50" cy="32" rx="10" ry="6.5" />
      <ellipse cx="19.5" cy="19.5" rx="6.5" ry="9.5" transform="rotate(-45 19.5 19.5)" />
      <ellipse cx="44.5" cy="44.5" rx="6.5" ry="9.5" transform="rotate(-45 44.5 44.5)" />
      <ellipse cx="44.5" cy="19.5" rx="6.5" ry="9.5" transform="rotate(45 44.5 19.5)" />
      <ellipse cx="19.5" cy="44.5" rx="6.5" ry="9.5" transform="rotate(45 19.5 44.5)" />
    </g>
    <circle cx="32" cy="32" r="8.5" fill="#F8E9B5" stroke="#B9688A" strokeWidth="1.8" />
    <circle cx="30" cy="30" r="1.3" fill="#B9688A" />
    <circle cx="35" cy="31" r="1.3" fill="#B9688A" />
    <circle cx="32" cy="35" r="1.3" fill="#B9688A" />
  </svg>
);

/** Hand-drawn ribbon bow */
export const BowDoodle: React.FC<DoodleProps> = ({ className = 'h-9 w-12' }) => (
  <svg viewBox="0 0 72 52" fill="none" className={className} aria-hidden="true">
    <path
      d="M36 24C27 12 12 10 10 20C8 29 22 31 36 24Z"
      fill="#F4DDE5"
      stroke="#B9688A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M36 24C45 12 60 10 62 20C64 29 50 31 36 24Z"
      fill="#F4DDE5"
      stroke="#B9688A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M33 27L21 44M39 27L51 44"
      stroke="#B9688A"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    <circle cx="36" cy="24" r="4.5" fill="#D78FAE" stroke="#B9688A" strokeWidth="1.8" />
  </svg>
);

/** Hand-drawn puffy heart doodle */
export const HeartDoodle: React.FC<DoodleProps> = ({ className = 'h-6 w-6' }) => (
  <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
    <path
      d="M20 33C20 33 7 24.8 7 15.5C7 10.9 10.6 7.5 14.8 7.5C17.4 7.5 19.2 9 20 10.6C20.8 9 22.6 7.5 25.2 7.5C29.4 7.5 33 10.9 33 15.5C33 24.8 20 33 20 33Z"
      fill="#F4DDE5"
      stroke="#B9688A"
      strokeWidth="2.1"
      strokeLinejoin="round"
    />
  </svg>
);

/** Hand-drawn cozy cloud doodle */
export const CloudDoodle: React.FC<DoodleProps> = ({ className = 'h-9 w-12' }) => (
  <svg viewBox="0 0 72 48" fill="none" className={className} aria-hidden="true">
    <path
      d="M20 38H52C58.5 38 63 33.4 63 27.6C63 22.4 59.1 18.2 54 17.4C52.4 10.8 46.5 6 39.4 6C32.4 6 26.5 10.7 24.9 17.2C18.2 17.5 13 22.7 13 29C13 34 16 38 20 38Z"
      fill="#FFF9F2"
      stroke="#B9688A"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <circle cx="31" cy="25" r="1.4" fill="#4A3531" />
    <circle cx="43" cy="25" r="1.4" fill="#4A3531" />
    <path d="M35 27.5C36.3 29 37.7 29 39 27.5" stroke="#4A3531" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

/** Sage leaf sprig */
export const SageSprigDoodle: React.FC<DoodleProps> = ({ className = 'h-10 w-16' }) => (
  <svg viewBox="0 0 96 48" fill="none" className={className} aria-hidden="true">
    <path
      d="M8 34C28 28 54 22 86 16"
      stroke="#8FA87C"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M26 29C22 19 30 12 37 18C40 22 33 28 26 29Z"
      fill="#D6E2C8"
      stroke="#7C9669"
      strokeWidth="1.6"
    />
    <path
      d="M46 24C44 13 54 9 60 16C62 20 53 24 46 24Z"
      fill="#D6E2C8"
      stroke="#7C9669"
      strokeWidth="1.6"
    />
    <path
      d="M64 20C67 29 58 36 51 30C48 26 56 21 64 20Z"
      fill="#D6E2C8"
      stroke="#7C9669"
      strokeWidth="1.6"
    />
    <path
      d="M40 27C41 37 31 41 26 35C24 31 32 27 40 27Z"
      fill="#D6E2C8"
      stroke="#7C9669"
      strokeWidth="1.6"
    />
  </svg>
);

/** Subtle stitched yarn divider */
export const StitchedDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
    <span className="h-px flex-1 border-t border-dashed border-[#D78FAE]/55" />
    <HeartDoodle className="h-4 w-4 shrink-0" />
    <span className="h-px flex-1 border-t border-dashed border-[#D78FAE]/55" />
  </div>
);
