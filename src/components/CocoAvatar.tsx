import React from 'react';

interface CocoAvatarProps {
  className?: string;
}

/** Cute handmade cream yarn-ball mascot with a blush-pink bow matching Looplet's aesthetic */
export const CocoAvatar: React.FC<CocoAvatarProps> = ({ className = 'h-8 w-8' }) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Loose yarn tail */}
      <path
        d="M14 48C8 48 6 42 10 38"
        stroke="#D78FAE"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* Yarn ball body */}
      <circle cx="32" cy="36" r="20" fill="#FFF9F2" stroke="#D78FAE" strokeWidth="2.6" />
      {/* Yarn wrap lines */}
      <path
        d="M17 26C24 23 39 24 47 30"
        stroke="#EED8E0"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M15 35C22 31 31 30 39 33"
        stroke="#F4DDE5"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M36 18C41 25 43 37 39 51"
        stroke="#EED8E0"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Cute kawaii eyes & blush */}
      <circle cx="25.5" cy="38" r="2.2" fill="#4A3531" />
      <circle cx="38.5" cy="38" r="2.2" fill="#4A3531" />
      <circle cx="21.5" cy="41.5" r="2.6" fill="#F4B6C8" opacity="0.85" />
      <circle cx="42.5" cy="41.5" r="2.6" fill="#F4B6C8" opacity="0.85" />
      {/* Smile */}
      <path
        d="M29.5 40.5C30.8 42.3 33.2 42.3 34.5 40.5"
        stroke="#4A3531"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Pink crochet bow on top */}
      <path
        d="M32 17C28 12 21 11 20 16C19 20 26 20 32 17Z"
        fill="#D78FAE"
        stroke="#B9688A"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M32 17C36 12 43 11 44 16C45 20 38 20 32 17Z"
        fill="#D78FAE"
        stroke="#B9688A"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="17" r="3" fill="#F4DDE5" stroke="#B9688A" strokeWidth="1.6" />
    </svg>
  );
};
