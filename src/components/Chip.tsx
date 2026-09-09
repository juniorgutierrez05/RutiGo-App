/**
 * Reusable Category & Filter Chip Component
 * Claymorphic pill with category-specific gradient color and active 3D states
 */
import React from 'react';
import { CategoryType } from '../types';

interface ChipProps {
  label: string;
  icon?: string;
  category?: CategoryType;
  selected?: boolean;
  onClick?: () => void;
  onClear?: () => void;
  count?: number;
  size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon,
  category,
  selected = false,
  onClick,
  onClear,
  count,
  size = 'md',
}) => {
  const getCategoryStyles = () => {
    if (!category) {
      if (selected) {
        return 'bg-gradient-to-r from-[#FF957D] to-[#FF7A59] text-white shadow-[0_8px_18px_-3px_rgba(255,122,89,0.4),inset_0_2px_4px_rgba(255,255,255,0.7)] border border-white/60';
      }
      return 'bg-white text-on-surface shadow-[0_4px_12px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.9)] border border-white/90 hover:bg-surfaceContainerLow';
    }

    if (selected) {
      switch (category) {
        case 'gastronomia':
          return 'bg-gradient-to-r from-[#FFB199] to-[#FF7A59] text-white shadow-[0_8px_18px_rgba(255,122,89,0.45),inset_0_2px_4px_rgba(255,255,255,0.7)] border border-white/60';
        case 'naturaleza':
          return 'bg-gradient-to-r from-[#7BE9A8] to-[#2ECC71] text-white shadow-[0_8px_18px_rgba(46,204,113,0.4),inset_0_2px_4px_rgba(255,255,255,0.7)] border border-white/60';
        case 'cultura':
          return 'bg-gradient-to-r from-[#A895FF] to-[#7B61FF] text-white shadow-[0_8px_18px_rgba(123,97,255,0.4),inset_0_2px_4px_rgba(255,255,255,0.7)] border border-white/60';
        case 'historia':
          return 'bg-gradient-to-r from-[#FFE180] to-[#FFC93C] text-[#2E2938] shadow-[0_8px_18px_rgba(255,201,60,0.4),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-white/60';
      }
    } else {
      switch (category) {
        case 'gastronomia':
          return 'bg-white text-on-surface hover:text-[#FF7A59] border border-white/80 shadow-[0_4px_10px_rgba(46,41,56,0.05),inset_0_2px_3px_rgba(255,255,255,0.9)]';
        case 'naturaleza':
          return 'bg-white text-on-surface hover:text-[#2ECC71] border border-white/80 shadow-[0_4px_10px_rgba(46,41,56,0.05),inset_0_2px_3px_rgba(255,255,255,0.9)]';
        case 'cultura':
          return 'bg-white text-on-surface hover:text-[#7B61FF] border border-white/80 shadow-[0_4px_10px_rgba(46,41,56,0.05),inset_0_2px_3px_rgba(255,255,255,0.9)]';
        case 'historia':
          return 'bg-white text-on-surface hover:text-[#CA9A00] border border-white/80 shadow-[0_4px_10px_rgba(46,41,56,0.05),inset_0_2px_3px_rgba(255,255,255,0.9)]';
      }
    }
  };

  const getIconColor = () => {
    if (selected) return 'text-white';
    switch (category) {
      case 'gastronomia':
        return 'text-[#FF7A59]';
      case 'naturaleza':
        return 'text-[#2ECC71]';
      case 'cultura':
        return 'text-[#7B61FF]';
      case 'historia':
        return 'text-[#CA9A00]';
      default:
        return 'text-primary';
    }
  };

  const sizeClass =
    size === 'sm'
      ? 'h-8 px-3 text-label-sm font-label-sm'
      : 'h-10 px-4 text-label-md font-label-md';

  return (
    <button
      onClick={onClick}
      type="button"
      className={`inline-flex items-center gap-1.5 rounded-full whitespace-nowrap font-bold active:scale-95 transition-all duration-150 cursor-pointer ${sizeClass} ${getCategoryStyles()}`}
    >
      {icon && (
        <span
          className={`material-symbols-outlined text-[18px] ${getIconColor()}`}
          style={{ fontVariationSettings: selected ? "'FILL' 1" : "'FILL' 0" }}
        >
          {icon}
        </span>
      )}
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-xs opacity-75 font-normal">({count})</span>
      )}
      {onClear && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="ml-1 w-4 h-4 rounded-full bg-white/40 flex items-center justify-center hover:bg-white/80 transition-colors"
        >
          <span className="material-symbols-outlined text-[12px]">close</span>
        </span>
      )}
    </button>
  );
};
