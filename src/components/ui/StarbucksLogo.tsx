import React from 'react';
import { cn } from '../../lib/utils';

interface StarbucksLogoProps {
  className?: string;
  size?: number;
}

/**
 * Authentic Starbucks Siren Logo matching the official brand mark
 */
export const StarbucksLogo: React.FC<StarbucksLogoProps> = ({
  className,
  size = 40,
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={cn('relative shrink-0 rounded-full overflow-hidden select-none flex items-center justify-center', className)}
    >
      <img
        src="/starbucks-logo.png"
        alt="Starbucks"
        width={size}
        height={size}
        className="w-full h-full object-contain mix-blend-multiply contrast-[1.1] scale-[1.35]"
      />
    </div>
  );
};
