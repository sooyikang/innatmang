import { useEffect, useState } from 'react';
import { thinkerPortraits } from '../data/archiveData';

interface ThinkerAvatarProps {
  thinkerId: string;
  name: string;
  sizeClass?: string;
  className?: string;
}

export function ThinkerAvatar({
  thinkerId,
  name,
  sizeClass = 'w-10 h-10',
  className = '',
}: ThinkerAvatarProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [thinkerId]);

  const portrait = thinkerPortraits[thinkerId];
  const initial = name.replace(/^G\.\s*W\.\s*F\.\s*/i, '').charAt(0) || '?';

  if (!portrait || hasError) {
    return (
      <div
        className={`${sizeClass} rounded-full bg-stone-900 text-amber-100 flex items-center justify-center font-serif font-bold text-sm border border-stone-700 shrink-0 ${className}`}
        aria-hidden="true"
      >
        {initial}
      </div>
    );
  }

  return (
    <img
      src={portrait.imageUrl}
      alt={`${name} 초상화`}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={`${sizeClass} rounded-full object-cover object-top border border-stone-300 bg-stone-200 shrink-0 ${className}`}
    />
  );
}
