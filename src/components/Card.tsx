/**
 * Reusable Card Component
 * Tactile Claymorphic Container with diffuse warm shadows and rounded 20-32px corners
 */
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'ambient' | 'hero' | 'chip';
  rounded?: 'lg' | 'xl' | '2xl' | '3xl';
  padding?: 'sm' | 'md' | 'lg' | 'none';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'white',
  rounded = '2xl',
  padding = 'md',
  interactive = false,
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'white':
        return 'bg-white shadow-[0_14px_28px_-6px_rgba(227,213,202,0.45),0_4px_10px_-2px_rgba(46,41,56,0.04),inset_0_3px_6px_rgba(255,255,255,0.9),inset_0_-3px_6px_rgba(46,41,56,0.04)] border-[1.5px] border-white/90';
      case 'ambient':
        return 'bg-gradient-to-b from-white to-[#FFF9F5] shadow-[0_16px_32px_-8px_rgba(167,57,30,0.10),0_4px_12px_rgba(46,41,56,0.03),inset_0_2px_5px_rgba(255,255,255,0.95)] border border-white/90';
      case 'hero':
        return 'bg-gradient-to-br from-[#FFF6F0] via-[#FFEBE3] to-[#F5F1FF] shadow-[0_18px_36px_-10px_rgba(255,122,89,0.18),inset_0_3px_6px_rgba(255,255,255,0.8)] border-2 border-white/95';
      case 'chip':
        return 'bg-white shadow-[0_6px_14px_-3px_rgba(167,57,30,0.1),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(46,41,56,0.04)] border border-white/80';
      default:
        return '';
    }
  };

  const getRadiusStyles = () => {
    switch (rounded) {
      case 'lg':
        return 'rounded-[20px]';
      case 'xl':
        return 'rounded-[24px]';
      case '2xl':
        return 'rounded-[28px]';
      case '3xl':
        return 'rounded-[32px]';
      default:
        return 'rounded-[28px]';
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'none':
        return 'p-0';
      case 'sm':
        return 'p-3';
      case 'lg':
        return 'p-5';
      case 'md':
      default:
        return 'p-4';
    }
  };

  return (
    <div
      className={`relative overflow-hidden transition-all duration-200 ${getVariantStyles()} ${getRadiusStyles()} ${getPaddingStyles()} ${
        interactive ? 'active:scale-[0.98] cursor-pointer hover:shadow-xl' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
