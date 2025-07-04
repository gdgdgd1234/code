"use client"
import { getExecutionResult, useCodeEditorStore } from '@/store/useCodeEditorStore';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React from 'react'
import { api } from '../../../../convex/_generated/api';
import { motion } from "framer-motion";
import { Loader2, Play, Zap } from "lucide-react";

function RunButton() {
  const { user } = useUser();
  const { runCode, language, isRunning } = useCodeEditorStore();
  const saveExecution = useMutation(api.codeExecutions.saveExecution);

  const handleRun = async () => {
    await runCode();
    const result = getExecutionResult();

    if (user && result) {
      await saveExecution({
        language,
        code: result.code,
        output: result.output || undefined,
        error: result.error || undefined,
      })
    }
  };

  return (
    <motion.button
      onClick={handleRun}
      disabled={isRunning}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        group relative inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold
        disabled:cursor-not-allowed transition-all duration-300 overflow-hidden
        ${isRunning 
          ? 'bg-gradient-to-r from-orange-500 to-red-500 shadow-glow' 
          : 'btn-primary shadow-glow hover:shadow-glow-purple'
        }
      `}
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative flex items-center gap-3">
        {isRunning ? (
          <>
            <div className="relative">
              <Loader2 className="w-5 h-5 animate-spin text-white" />
              <div className="absolute inset-0 blur animate-pulse" />
            </div>
            <span className="text-white">Executing...</span>
          </>
        ) : (
          <>
            <div className="relative flex items-center justify-center w-5 h-5">
              <Play className="w-5 h-5 text-white transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            </div>
            <span className="text-white">Run Code</span>
            <Zap className="w-4 h-4 text-white/80 group-hover:text-white transition-colors" />
          </>
        )}
      </div>

      {/* Shine effect */}
      {!isRunning && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      )}
    </motion.button>
  );
}

export default RunButton;