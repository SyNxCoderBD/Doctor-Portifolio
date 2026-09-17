import React from 'react';
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  name?: string;
  className?: string;
  size?: number | string;
  style?: React.CSSProperties;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({
  name = 'Sparkles',
  className = 'w-4 h-4',
  size,
  style,
}) => {
  if (!name) return null;

  // Clean name format if needed (e.g., heart-pulse -> HeartPulse)
  const cleanName = name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  const Component =
    (LucideIcons as any)[cleanName] ||
    (LucideIcons as any)[name] ||
    LucideIcons.Sparkles;

  if (typeof Component !== 'function' && typeof Component !== 'object') {
    return <LucideIcons.Sparkles className={className} size={size} style={style} />;
  }

  return <Component className={className} size={size} style={style} />;
};
