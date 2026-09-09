/**
 * Reusable Claymorphic Button Component
 * Generates tactile pill and round buttons adhering to RutiGo Design Tokens
 */
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'circle';
  size?: 'sm' | 'md' | 'lg';
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-[#FFB199] via-primary-container to-primary text-white shadow-[0_12px_24px_-4px_rgba(255,122,89,0.45),inset_0_2.5px_5px_#FFFFFF,inset_0_-2.5px_5px_rgba(184,52,20,0.35)] border border-white/50 active:scale-[0.97]';
      case 'secondary':
        return 'bg-gradient-to-r from-[#7FF0E0] to-[#00C2CB] text-white shadow-[0_10px_22px_-4px_rgba(0,194,203,0.42),inset_0_2px_4px_#FFFFFF,inset_0_-2px_4px_rgba(0,94,99,0.3)] border border-white/50 active:scale-[0.97]';
      case 'outline':
        return 'bg-white text-primary border border-primary/40 shadow-[0_6px_14px_rgba(255,122,89,0.1),inset_0_2px_4px_rgba(255,255,255,0.9)] hover:bg-surfaceContainerLow active:scale-[0.97]';
      case 'ghost':
        return 'bg-transparent text-on-surface hover:text-primary hover:bg-surfaceContainerLow/50 active:scale-[0.97]';
      case 'circle':
        return 'w-11 h-11 rounded-full bg-white text-on-surface shadow-[0_8px_20px_rgba(70,30,15,0.12),inset_0_2px_4px_rgba(255,255,255,0.9),inset_0_-2px_4px_rgba(46,41,56,0.05)] border border-white/90 active:scale-90 flex items-center justify-center p-0';
      default:
        return '';
    }
  };

  const getSizeStyles = () => {
    if (variant === 'circle') return '';
    switch (size) {
      case 'sm':
        return 'h-9 px-4 text-label-sm font-label-sm rounded-full';
      case 'lg':
        return 'h-[54px] px-6 text-label-lg font-label-lg rounded-full';
      case 'md':
      default:
        return 'h-12 px-5 text-label-md font-label-md rounded-full';
    }
  };

  return (
    <button
      disabled={disabled}
      className={`relative inline-flex items-center justify-center gap-2 font-bold transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${
        fullWidth ? 'w-full' : ''
      } ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      )}
    </button>
  );
};
