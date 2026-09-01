import React from 'react';
import { motion } from 'motion/react';
import { Sun, Moon } from 'lucide-react';
import { hapticLight } from '../utils/haptics';

export interface ThemeRadioSliderProps {
  darkMode: boolean;
  onChange: (isDark: boolean) => void;
  size?: 'xs' | 'sm' | 'md';
  variant?: 'toolbar' | 'light' | 'floating';
  className?: string;
  idPrefix?: string;
}

export const ThemeRadioSlider: React.FC<ThemeRadioSliderProps> = ({
  darkMode,
  onChange,
  size = 'sm',
  variant = 'toolbar',
  className = '',
  idPrefix = 'theme-radio'
}) => {
  const handleSelect = (isDark: boolean) => {
    if (isDark !== darkMode) {
      hapticLight();
      onChange(isDark);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, isDark: boolean) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleSelect(isDark);
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleSelect(true);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      handleSelect(false);
    }
  };

  // Size styling maps
  const sizeStyles = {
    xs: {
      container: 'p-0.5 text-[10px] gap-0.5',
      option: 'px-2 py-0.5 gap-1 min-h-[22px]',
      icon: 'w-3 h-3',
      sliderRadius: 'rounded-full'
    },
    sm: {
      container: 'p-1 text-[11px] gap-1',
      option: 'px-2.5 py-1 gap-1.5 min-h-[26px]',
      icon: 'w-3.5 h-3.5',
      sliderRadius: 'rounded-full'
    },
    md: {
      container: 'p-1.5 text-xs gap-1.5',
      option: 'px-3.5 py-1.5 gap-2 min-h-[32px]',
      icon: 'w-4 h-4',
      sliderRadius: 'rounded-full'
    }
  }[size];

  // Variant color themes
  const variantStyles = {
    toolbar: {
      container: 'bg-[#221C17] border border-[#C59B27]/40 shadow-inner',
      activeText: 'text-[#181411] font-bold',
      inactiveText: 'text-[#B8A898] hover:text-[#FAF7F2]',
      sliderBg: 'bg-gradient-to-r from-[#D4AF37] via-[#E5C365] to-[#C59B27] shadow-sm'
    },
    light: {
      container: 'bg-[#EAE2D4] border border-[#DDD3BC] shadow-inner',
      activeText: 'text-[#FAF7F2] font-bold',
      inactiveText: 'text-[#6B5E52] hover:text-[#181411]',
      sliderBg: 'bg-[#181411] shadow-sm'
    },
    floating: {
      container: 'bg-[#181411]/90 backdrop-blur-md border border-[#C59B27]/50 shadow-lg',
      activeText: 'text-[#181411] font-bold',
      inactiveText: 'text-[#D4C5B5] hover:text-[#FAF7F2]',
      sliderBg: 'bg-[#C59B27] shadow-md'
    }
  }[variant];

  return (
    <div
      id={`${idPrefix}-group`}
      role="radiogroup"
      aria-label="Color theme selection (Light or Dark Mode)"
      className={`relative inline-flex items-center rounded-full font-sans-ui select-none ${variantStyles.container} ${sizeStyles.container} ${className}`}
    >
      {/* Option 1: Light Mode Radio */}
      <button
        type="button"
        id={`${idPrefix}-light`}
        role="radio"
        aria-checked={!darkMode}
        tabIndex={!darkMode ? 0 : -1}
        onClick={() => handleSelect(false)}
        onKeyDown={(e) => handleKeyDown(e, false)}
        className={`relative z-10 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${
          sizeStyles.option
        } ${!darkMode ? variantStyles.activeText : variantStyles.inactiveText}`}
      >
        <Sun
          className={`${sizeStyles.icon} transition-transform duration-200 ${
            !darkMode ? 'scale-110 text-amber-900 drop-shadow-2xs rotate-0' : 'text-current opacity-70 -rotate-12'
          }`}
        />
        <span className="font-cinzel tracking-wider text-[10.5px]">Light</span>

        {/* Sliding Indicator Thumb if Light is Active */}
        {!darkMode && (
          <motion.div
            layoutId={`${idPrefix}-slider-thumb`}
            className={`absolute inset-0 z-[-1] ${sizeStyles.sliderRadius} ${variantStyles.sliderBg}`}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 32,
              mass: 0.8
            }}
          />
        )}
      </button>

      {/* Option 2: Dark Mode Radio */}
      <button
        type="button"
        id={`${idPrefix}-dark`}
        role="radio"
        aria-checked={darkMode}
        tabIndex={darkMode ? 0 : -1}
        onClick={() => handleSelect(true)}
        onKeyDown={(e) => handleKeyDown(e, true)}
        className={`relative z-10 flex items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${
          sizeStyles.option
        } ${darkMode ? variantStyles.activeText : variantStyles.inactiveText}`}
      >
        <Moon
          className={`${sizeStyles.icon} transition-transform duration-200 ${
            darkMode ? 'scale-110 text-[#181411] drop-shadow-2xs rotate-0' : 'text-current opacity-70 rotate-12'
          }`}
        />
        <span className="font-cinzel tracking-wider text-[10.5px]">Dark</span>

        {/* Sliding Indicator Thumb if Dark is Active */}
        {darkMode && (
          <motion.div
            layoutId={`${idPrefix}-slider-thumb`}
            className={`absolute inset-0 z-[-1] ${sizeStyles.sliderRadius} ${variantStyles.sliderBg}`}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 32,
              mass: 0.8
            }}
          />
        )}
      </button>
    </div>
  );
};
