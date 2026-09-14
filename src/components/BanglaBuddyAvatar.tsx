import React from 'react';

interface BanglaBuddyAvatarProps {
  size?: number;
  mood?: 'happy' | 'thinking' | 'excited' | 'wink';
  animated?: boolean;
  className?: string;
}

export const BanglaBuddyAvatar: React.FC<BanglaBuddyAvatarProps> = ({
  size = 40,
  mood = 'happy',
  animated = false,
  className = ''
}) => {
  const eyeStyle = mood === 'thinking' ? '😐' : mood === 'excited' ? '🤩' : mood === 'wink' ? '😉' : '😊';

  return (
    <div
      className={`flex items-center justify-center rounded-full select-none ${animated ? 'animate-pulse' : ''} ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.65 }}
      aria-hidden="true"
    >
      {eyeStyle === '😊' ? (
        <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Book body */}
          <rect x="6" y="8" width="28" height="24" rx="3" fill="#d97706" />
          <rect x="6" y="8" width="14" height="24" rx="2" fill="#f59e0b" />
          {/* Spine */}
          <rect x="18" y="8" width="3" height="24" fill="#b45309" />
          {/* Lines on right page */}
          <rect x="23" y="14" width="8" height="1.5" rx="0.75" fill="#fef3c7" />
          <rect x="23" y="18" width="8" height="1.5" rx="0.75" fill="#fef3c7" />
          <rect x="23" y="22" width="6" height="1.5" rx="0.75" fill="#fef3c7" />
          {/* Face on left page */}
          <circle cx="12" cy="17" r="1.5" fill="#78350f" />
          <circle cx="16" cy="17" r="1.5" fill="#78350f" />
          {/* Smile */}
          <path d="M10.5 21 Q14 24 17.5 21" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" fill="none" />
        </svg>
      ) : (
        <span style={{ fontSize: size * 0.72, lineHeight: 1 }}>{eyeStyle}</span>
      )}
    </div>
  );
};
