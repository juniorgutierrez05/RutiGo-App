/**
 * RatingStars Component
 * Displays rating badges or interactive 1-5 star selector for review submission
 */
import React from 'react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showBadge?: boolean;
  reviewCount?: number;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  max = 5,
  interactive = false,
  onChange,
  size = 'md',
  showBadge = false,
  reviewCount,
}) => {
  if (showBadge) {
    return (
      <div className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-white/80">
        <span
          className="material-symbols-outlined text-[#FFC93C] text-[16px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
        <span className="text-label-sm font-label-sm font-bold text-on-surface">
          {rating.toFixed(1)}
        </span>
        {reviewCount !== undefined && (
          <span className="text-label-sm font-label-sm text-on-surface-variant font-normal">
            ({reviewCount})
          </span>
        )}
      </div>
    );
  }

  const getStarSize = () => {
    switch (size) {
      case 'sm':
        return 'text-[18px]';
      case 'lg':
        return 'text-[32px]';
      case 'md':
      default:
        return 'text-[24px]';
    }
  };

  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFilled = rating >= starValue;

        return (
          <button
            key={index}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange && onChange(starValue)}
            className={`${
              interactive ? 'cursor-pointer hover:scale-115 active:scale-95' : 'cursor-default'
            } transition-transform duration-150 p-0.5 focus:outline-none`}
          >
            <span
              className={`material-symbols-outlined ${getStarSize()} ${
                isFilled ? 'text-[#FFC93C]' : 'text-outline-variant/50'
              }`}
              style={{ fontVariationSettings: isFilled ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          </button>
        );
      })}
    </div>
  );
};
