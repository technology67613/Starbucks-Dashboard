import React, { useState } from 'react';
import { Coffee, CupSoda, Cake, UtensilsCrossed, ShoppingBag } from 'lucide-react';
import { Category } from '../../types/order';
import { getItemImage } from '../../lib/itemImages';
import { cn } from '../../lib/utils';

interface CategoryIconProps {
  category: Category | string;
  size?: number;
  className?: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({
  category,
  size = 20,
  className,
}) => {
  switch (category) {
    case 'Hot Beverages':
      return <Coffee size={size} className={cn('text-emerald-800', className)} />;
    case 'Cold Beverages':
      return <CupSoda size={size} className={cn('text-teal-600', className)} />;
    case 'Bakery':
      return <Cake size={size} className={cn('text-amber-600', className)} />;
    case 'Food':
      return <UtensilsCrossed size={size} className={cn('text-rose-600', className)} />;
    case 'Merchandise':
      return <ShoppingBag size={size} className={cn('text-indigo-600', className)} />;
    default:
      return <Coffee size={size} className={cn('text-emerald-800', className)} />;
  }
};

export const ProductImage: React.FC<{
  name: string;
  category: Category | string;
  className?: string;
}> = ({ name, category, className }) => {
  const [imageError, setImageError] = useState(false);
  const imageUrl = getItemImage(name);

  if (imageUrl && !imageError) {
    return (
      <div className={cn('w-full h-40 rounded-img relative overflow-hidden bg-black/5 group shadow-sm', className)}>
        <img
          src={imageUrl}
          alt={name}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
        <div className="absolute bottom-2 left-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/20">
            {category}
          </span>
        </div>
      </div>
    );
  }

  return <CategoryIllustration category={category} className={className} />;
};

export const CategoryIllustration: React.FC<{ category: Category | string; className?: string }> = ({
  category,
  className,
}) => {
  const getBgAndBorder = () => {
    switch (category) {
      case 'Hot Beverages':
        return 'bg-gradient-to-br from-emerald-500/10 via-emerald-100/50 to-white text-emerald-900 border-emerald-500/20';
      case 'Cold Beverages':
        return 'bg-gradient-to-br from-teal-500/10 via-cyan-100/50 to-white text-teal-900 border-teal-500/20';
      case 'Bakery':
        return 'bg-gradient-to-br from-amber-500/10 via-orange-100/50 to-white text-amber-900 border-amber-500/20';
      case 'Food':
        return 'bg-gradient-to-br from-rose-500/10 via-red-100/50 to-white text-rose-900 border-rose-500/20';
      case 'Merchandise':
        return 'bg-gradient-to-br from-indigo-500/10 via-purple-100/50 to-white text-indigo-900 border-indigo-500/20';
      default:
        return 'bg-emerald-50 text-emerald-900 border-emerald-500/20';
    }
  };

  return (
    <div
      className={cn(
        'w-full h-40 rounded-img flex flex-col items-center justify-center relative overflow-hidden border shadow-inner backdrop-blur-sm',
        getBgAndBorder(),
        className
      )}
    >
      <div className="p-3.5 rounded-full bg-white/90 shadow-sm backdrop-blur-md border border-white/60">
        <CategoryIcon category={category} size={32} />
      </div>
      <span className="text-xs font-semibold mt-2 tracking-wide uppercase opacity-75">
        {category}
      </span>
    </div>
  );
};
