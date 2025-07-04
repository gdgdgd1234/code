"use client";

import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import React, { useEffect } from 'react'
import { LANGUAGE_CONFIG } from '../_constants';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDownIcon, Lock, Sparkles, Code } from "lucide-react";
import { createPortal } from 'react-dom';

function LanguageSelector({ hasAccess }: { hasAccess: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0, width: 0 });
  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const currentLanguageObj = LANGUAGE_CONFIG[language];

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

  const handleLanguageSelect = (langId: string) => {
    if (!hasAccess && langId !== 'javascript') return;
    setLanguage(langId);
    setIsOpen(false);
  };

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

  return (
    <>
      <motion.button
        ref={buttonRef}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center gap-3 px-4 py-2.5 glass-dark hover:bg-white/10 rounded-xl transition-all duration-300 min-w-[160px] ${
          !hasAccess && language !== "javascript" ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative flex items-center gap-3">
          <div className="relative">
            <div className="size-8 rounded-lg bg-gray-800/50 p-1 group-hover:scale-110 transition-transform duration-300">
              <Image
                src={currentLanguageObj.logoPath}
                alt="programming language logo"
                width={24}
                height={24}
                className="w-full h-full object-contain relative z-10"
              />
            </div>
          </div>

          <span className="text-gray-300 group-hover:text-white transition-colors font-medium">
            {currentLanguageObj.label}
          </span>
        </div>

        <ChevronDownIcon
          className={`size-4 text-gray-400 transition-all duration-300 group-hover:text-gray-300 ml-auto ${
            isOpen ? "rotate-180" : ""
          }`}
        />
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
                width: Math.max(dropdownPosition.width, 380),
                zIndex: 99999,
                maxHeight: '500px',
                overflowY: 'auto'
              }}
            >
              <div className="px-4 pb-3 mb-3 border-b border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Code className="w-4 h-4 text-purple-400" />
                  <p className="text-sm font-semibold text-gray-300">Select Language</p>
                </div>
                <p className="text-xs text-gray-500">Choose your programming language</p>
              </div>

              <div className="px-2 space-y-1">
                {Object.values(LANGUAGE_CONFIG).map((lang, index) => {
                  const isLocked = !hasAccess && lang.id !== "javascript";

                  return (
                    <motion.div
                      key={lang.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="relative group"
                    >
                      <button
                        className={`
                          relative w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-200
                          ${language === lang.id 
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" 
                            : isLocked 
                              ? "opacity-50 cursor-not-allowed" 
                              : "text-gray-300 hover:bg-white/10"
                          }
                        `}
                        onClick={() => handleLanguageSelect(lang.id)}
                        disabled={isLocked}
                      >
                        {/* Selection indicator */}
                        {language === lang.id && (
                          <motion.div
                            layoutId="selectedLanguage"
                            className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-xl"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}

                        <div className="relative flex items-center gap-4 w-full">
                          {/* Language icon */}
                          <div
                            className={`
                              relative size-10 rounded-xl p-2 transition-all duration-200
                              ${language === lang.id 
                                ? "bg-purple-500/20" 
                                : "bg-gray-800/50 group-hover:bg-gray-700/50"
                              }
                            `}
                          >
                            <Image
                              width={24}
                              height={24}
                              src={lang.logoPath}
                              alt={`${lang.label} logo`}
                              className="w-full h-full object-contain relative z-10"
                            />
                          </div>

                          {/* Language info */}
                          <div className="flex-1 text-left">
                            <span className="block font-medium group-hover:text-white transition-colors">
                              {lang.label}
                            </span>
                            <span className="block text-xs text-gray-500 mt-0.5">
                              {lang.id === 'javascript' && 'Dynamic programming language'}
                              {lang.id === 'typescript' && 'JavaScript with static typing'}
                              {lang.id === 'python' && 'High-level programming language'}
                              {lang.id === 'java' && 'Object-oriented programming'}
                              {lang.id === 'cpp' && 'Systems programming language'}
                              {lang.id === 'go' && 'Fast and simple language'}
                              {lang.id === 'rust' && 'Memory-safe systems language'}
                              {lang.id === 'csharp' && 'Microsoft .NET language'}
                              {lang.id === 'ruby' && 'Dynamic object-oriented language'}
                              {lang.id === 'swift' && 'Apple platform development'}
                            </span>
                          </div>

                          {/* Status indicator */}
                          <div className="flex items-center">
                            {isLocked ? (
                              <div className="flex items-center gap-2 px-2 py-1 bg-amber-500/20 rounded-lg">
                                <Lock className="w-3 h-3 text-amber-400" />
                                <span className="text-xs text-amber-400 font-medium">Pro</span>
                              </div>
                            ) : language === lang.id ? (
                              <div className="flex items-center gap-1">
                                <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </button>
                    </motion.div>
                  );
                })}
              </div>

              {!hasAccess && (
                <div className="px-4 pt-3 mt-3 border-t border-white/10">
                  <div className="flex items-center gap-2 text-amber-400 text-xs">
                    <Lock className="w-3 h-3" />
                    <span>Upgrade to Pro to unlock all languages</span>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

export default LanguageSelector;