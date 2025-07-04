"use client"

import { useCodeEditorStore } from '@/store/useCodeEditorStore'
import React, { useEffect, useRef, useState } from 'react'
import { THEMES } from '../_constants';
import { AnimatePresence, motion } from 'framer-motion'
import { CircleOff, Cloud, Github, Laptop, Moon, Palette, Sun, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';

const THEME_ICONS: Record<string, React.ReactNode> = {
  "vs-dark": <Moon className="size-4" />,
  "vs-light": <Sun className="size-4" />,
  "github-dark": <Github className="size-4" />,
  monokai: <Laptop className="size-4" />,
  "solarized-dark": <Cloud className="size-4" />,
};

function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const { theme, setTheme } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const currentTheme = THEMES.find((t) => t.id === theme);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isOpen]);

  if (!mounted) return null;

  const handleThemeSelect = (themeId: string) => {
    setTheme(themeId);
    setIsOpen(false);
  };

  return (
    <>
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-3 px-4 py-2.5 glass-dark hover:bg-white/10 rounded-xl transition-all duration-300 min-w-[180px]"
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex items-center gap-3">
          <Palette className="w-4 h-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          <span className="text-gray-300 group-hover:text-white transition-colors font-medium">
            {currentTheme?.label}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div
            className="relative w-4 h-4 rounded-full border-2 border-gray-500 group-hover:border-gray-400 transition-colors shadow-inner"
            style={{ background: currentTheme?.color }}
          />
          <ChevronDown
            className={`w-4 h-4 text-gray-400 transition-all duration-300 group-hover:text-gray-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </motion.button>

      {mounted && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed glass rounded-2xl shadow-2xl py-3 border border-white/20"
              style={{
                top: dropdownPosition.top,
                left: dropdownPosition.left,
                width: Math.max(dropdownPosition.width, 320),
                zIndex: 99999,
                maxHeight: '400px',
                overflowY: 'auto'
              }}
            >
              <div className="px-4 pb-3 mb-3 border-b border-white/10">
                <p className="text-sm font-semibold text-gray-300">Select Theme</p>
                <p className="text-xs text-gray-500 mt-1">Choose your preferred editor theme</p>
              </div>

              <div className="px-2 space-y-1">
                {THEMES.map((t, index) => (
                  <motion.button
                    key={t.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                      relative group w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200
                      ${theme === t.id 
                        ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30" 
                        : "text-gray-300 hover:bg-white/10"
                      }
                    `}
                    onClick={() => handleThemeSelect(t.id)}
                  >
                    {/* Selection indicator */}
                    {theme === t.id && (
                      <motion.div
                        layoutId="selectedTheme"
                        className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}

                    <div className="relative flex items-center gap-4 w-full">
                      {/* Theme icon */}
                      <div
                        className={`
                          flex items-center justify-center size-10 rounded-xl transition-all duration-200
                          ${theme === t.id 
                            ? "bg-indigo-500/20 text-indigo-400" 
                            : "bg-gray-800/50 text-gray-400 group-hover:bg-gray-700/50"
                          }
                        `}
                      >
                        {THEME_ICONS[t.id] || <CircleOff className="w-4 h-4" />}
                      </div>

                      {/* Theme info */}
                      <div className="flex-1 text-left">
                        <span className="block font-medium group-hover:text-white transition-colors">
                          {t.label}
                        </span>
                        <span className="block text-xs text-gray-500 mt-0.5">
                          {t.id === 'vs-dark' && 'Dark theme with blue accents'}
                          {t.id === 'vs-light' && 'Light theme for bright environments'}
                          {t.id === 'github-dark' && 'GitHub inspired dark theme'}
                          {t.id === 'monokai' && 'Popular dark theme with vibrant colors'}
                          {t.id === 'solarized-dark' && 'Easy on the eyes dark theme'}
                        </span>
                      </div>

                      {/* Theme color preview */}
                      <div
                        className="relative size-6 rounded-lg border-2 border-gray-600 group-hover:border-gray-500 transition-colors shadow-inner"
                        style={{ background: t.color }}
                      />
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default ThemeSelector;