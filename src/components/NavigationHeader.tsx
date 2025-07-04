import HeaderProfileBtn from '@/app/(root)/_components/HeaderProfileBtn';
import { SignedOut } from '@clerk/nextjs';
import { Blocks, Code2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

function NavigationHeader() {
  return (
    <div className="sticky top-0 z-50 w-full border-b border-white/10 glass backdrop-blur-2xl">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-cyan-500/5" />
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 group relative">
              {/* Animated glow effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />

              {/* Logo container */}
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-glow group-hover:shadow-glow-purple transition-all duration-300 transform group-hover:scale-110">
                <Blocks className="w-7 h-7 text-white transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
              </div>

              <div className="relative">
                <span className="block text-2xl font-bold gradient-text">
                  SyntaxForge
                </span>
                <span className="block text-sm text-indigo-400/80 font-medium">
                  Interactive Code Editor
                </span>
              </div>
            </Link>

            <Link
              href="/snippets"
              className="relative group flex items-center gap-3 px-6 py-3 rounded-xl glass-dark hover:bg-indigo-500/20 transition-all duration-300 shadow-lg overflow-hidden card-hover"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Code2 className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors group-hover:rotate-3 transform duration-300" />
              <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors relative z-10">
                Code Snippets
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <SignedOut>
              <Link
                href="/pricing"
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 card-hover shadow-glow"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">
                  Upgrade to Pro
                </span>
              </Link>
            </SignedOut>
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavigationHeader;