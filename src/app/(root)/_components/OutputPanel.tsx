"use client"
import { useCodeEditorStore } from '@/store/useCodeEditorStore';
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal, Play, Zap } from 'lucide-react';
import React, { useState } from 'react'
import RunningCodeSkeleton from './RunningCodeSkeleton';
import { motion } from 'framer-motion';

function OutputPanel() {
  const { output, error, isRunning } = useCodeEditorStore();
  const [isCopied, setIsCopied] = useState(false);
  const hasContent = output || error;

  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(output || error || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative slide-in-up" style={{ animationDelay: '0.1s' }}>
      <div className="glass rounded-2xl p-6 relative overflow-hidden card-hover">
        {/* Gradient background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-blue-500/5 to-indigo-500/5 opacity-50" />
        
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-30" />
                <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-600 shadow-glow-cyan">
                  <Terminal className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cyan-400" />
                  Output Console
                </h2>
                <p className="text-sm text-gray-400">
                  View your code execution results
                </p>
              </div>
            </div>

            {hasContent && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 glass-dark hover:bg-cyan-500/20 rounded-xl transition-all duration-300 group"
              >
                {isCopied ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-green-400 font-medium">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                    <span className="text-sm text-gray-400 group-hover:text-cyan-400 transition-colors font-medium">Copy</span>
                  </>
                )}
              </motion.button>
            )}
          </div>

          {/* Output container */}
          <div className="relative">
            <div className="code-block">
              {/* Console header */}
              <div className="code-header">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-sm text-gray-400 ml-3">Console</span>
                </div>
                <div className="flex items-center gap-2">
                  {isRunning && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-400">Running</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Console content */}
              <div className="relative bg-black/40 p-6 h-[600px] overflow-auto font-mono text-sm">
                {isRunning ? (
                  <RunningCodeSkeleton />
                ) : error ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 text-red-400"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center mt-1">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold text-red-300">Execution Error</div>
                      <pre className="whitespace-pre-wrap text-red-400/90 leading-relaxed">{error}</pre>
                    </div>
                  </motion.div>
                ) : output ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-3 text-emerald-400 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-emerald-300">Execution Successful</span>
                    </div>
                    <pre className="whitespace-pre-wrap text-gray-200 leading-relaxed pl-11">{output}</pre>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-700/50 border border-gray-600/50 mb-6">
                        <Play className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-300 mb-2">Ready to Execute</h3>
                      <p className="text-gray-500 max-w-sm">
                        Click the "Run Code" button to execute your code and see the output here
                      </p>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;