'use client';

import { motion } from 'framer-motion';
import { getThemeConfig } from '@/lib/theme-config';

interface ThemePreviewProps {
  themeName: string;
  isDark: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

export function ThemePreview({ themeName, isDark, isSelected = false, onClick }: ThemePreviewProps) {
  const themeConfig = getThemeConfig(themeName, isDark);
  const colors = themeConfig.colors;

  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative p-4 rounded-xl cursor-pointer transition-all duration-300 ${
        isSelected ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-800' : ''
      }`}
      style={{
        background: colors.background,
        border: `1px solid ${colors.border}`,
      }}
    >
      {/* Theme Name */}
      <div className="mb-3">
        <h3 className="font-semibold text-sm" style={{ color: colors.content }}>
          {themeConfig.displayName}
        </h3>
        <p className="text-xs" style={{ color: colors.contentMuted }}>
          {themeConfig.description}
        </p>
      </div>

      {/* Color Palette Preview */}
      <div className="grid grid-cols-4 gap-2">
        {/* Primary Colors */}
        <div
          className="w-6 h-6 rounded-full border border-white/20"
          style={{ backgroundColor: colors.accent }}
          title="Accent"
        />
        <div
          className="w-6 h-6 rounded-full border border-white/20"
          style={{ backgroundColor: colors.button.primary }}
          title="Primary Button"
        />
        <div
          className="w-6 h-6 rounded-full border border-white/20"
          style={{ backgroundColor: colors.success }}
          title="Success"
        />
        <div
          className="w-6 h-6 rounded-full border border-white/20"
          style={{ backgroundColor: colors.error }}
          title="Error"
        />

        {/* Background Colors */}
        <div
          className="w-6 h-6 rounded-full border border-white/20"
          style={{ backgroundColor: colors.backgroundSecondary }}
          title="Secondary Background"
        />
        <div
          className="w-6 h-6 rounded-full border border-white/20"
          style={{ backgroundColor: colors.backgroundTertiary }}
          title="Tertiary Background"
        />
        <div
          className="w-6 h-6 rounded-full border border-white/20"
          style={{ backgroundColor: colors.glass.background }}
          title="Glass Background"
        />
        <div
          className="w-6 h-6 rounded-full border border-white/20"
          style={{ backgroundColor: colors.border }}
          title="Border"
        />
      </div>

      {/* Sample UI Elements */}
      <div className="mt-3 space-y-2">
        {/* Sample Button */}
        <div
          className="h-6 rounded-md"
          style={{ backgroundColor: colors.button.primary }}
        />
        
        {/* Sample Text */}
        <div className="space-y-1">
          <div
            className="h-2 rounded"
            style={{ backgroundColor: colors.content, width: '80%' }}
          />
          <div
            className="h-2 rounded"
            style={{ backgroundColor: colors.contentSecondary, width: '60%' }}
          />
        </div>
      </div>

      {/* Selection Indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
        >
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </motion.div>
      )}
    </motion.div>
  );
} 