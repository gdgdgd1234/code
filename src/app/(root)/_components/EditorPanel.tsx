"use client";

import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { useClerk } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import { defineMonacoThemes, LANGUAGE_CONFIG } from '../_constants';
import Image from 'next/image';
import { RotateCcwIcon, ShareIcon, TypeIcon, Code2, Settings } from 'lucide-react';
import { motion } from "framer-motion";
import { Editor } from '@monaco-editor/react';
import ShareSnippetDialog from './ShareSnippetDialog';
import { EditorPanelSkeleton } from './EditorPanelSkeleton';

import type { editor as MonacoEditor } from 'monaco-editor';

function EditorPanel() {
  const clerk = useClerk();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  
  const { language, theme, fontSize, editor, setFontSize, setEditor } = useCodeEditorStore() as {
    language: string;
    theme: string;
    fontSize: number;
    editor: MonacoEditor.IStandaloneCodeEditor | null;
    setFontSize: (size: number) => void;
    setEditor: (editor: MonacoEditor.IStandaloneCodeEditor) => void;
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;

    if (editor) editor.setValue(newCode);
  }, [language, editor]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem('editor-font-size');
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };

  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem('editor-font-size', size.toString());
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative slide-in-up">
      <div className="glass rounded-2xl p-6 relative overflow-hidden card-hover">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5 opacity-50" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30" />
                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-glow">
                  <Image
                    src={`/${language}.png`}
                    alt="logo"
                    width={28}
                    height={28}
                    className="relative z-10"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Code2 className="w-5 h-5 text-indigo-400" />
                  Code Editor
                </h2>
                <p className="text-sm text-gray-400">
                  Write and execute code in your favorite language
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Font size control */}
              <div className="flex items-center gap-3 px-4 py-2 glass-dark rounded-xl">
                <TypeIcon className="size-4 text-gray-400" />
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="12"
                    max="24"
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
                    className="w-20 h-2 bg-gray-600 rounded-lg cursor-pointer accent-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-300 min-w-[2rem] text-center">
                    {fontSize}
                  </span>
                </div>
              </div>

              {/* Reset button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                className="p-3 glass-dark hover:bg-red-500/20 rounded-xl transition-all duration-300 group"
                aria-label="Reset to default code"
              >
                <RotateCcwIcon className="size-4 text-gray-400 group-hover:text-red-400 transition-colors" />
              </motion.button>

              {/* Share button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsShareDialogOpen(true)}
                className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-glow"
              >
                <ShareIcon className="size-4" />
                <span className="text-sm">Share Code</span>
              </motion.button>
            </div>
          </div>

          {/* Editor container */}
          <div className="relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Editor header */}
            <div className="code-header">
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <span className="text-sm text-gray-400 ml-3">
                  {LANGUAGE_CONFIG[language].label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            {clerk.loaded && (
              <Editor
                height="600px"
                language={LANGUAGE_CONFIG[language].monacoLanguage}
                onChange={handleEditorChange}
                theme={theme}
                beforeMount={defineMonacoThemes}
                onMount={(editorInstance) =>
                  setEditor(editorInstance as MonacoEditor.IStandaloneCodeEditor)
                }
                options={{
                  minimap: { enabled: true },
                  fontSize,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  padding: { top: 20, bottom: 20 },
                  renderWhitespace: "selection",
                  fontFamily: '"Fira Code", "JetBrains Mono", "Cascadia Code", Consolas, monospace',
                  fontLigatures: true,
                  cursorBlinking: "smooth",
                  smoothScrolling: true,
                  contextmenu: true,
                  renderLineHighlight: "all",
                  lineHeight: 1.6,
                  letterSpacing: 0.5,
                  roundedSelection: true,
                  scrollbar: {
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10,
                  },
                  bracketPairColorization: {
                    enabled: true,
                  },
                  guides: {
                    indentation: true,
                    bracketPairs: true,
                  },
                }}
              />
            )}
            {!clerk.loaded && <EditorPanelSkeleton />}
          </div>
        </div>
      </div>

      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
    </div>
  );
}

export default EditorPanel;