"use client";
import { Snippet } from '@/types'
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import React, { useState } from 'react'
import { api } from '../../../../convex/_generated/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Trash2, User, Code, Calendar } from 'lucide-react';
import StarButton from '@/components/StarButton';

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { user } = useUser();
  const deleteSnippet = useMutation(api.snippets.deleteSnippet);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteSnippet({ snippetId: snippet._id });
      toast.success('Snippet deleted successfully');
    } catch (error) {
      console.log("Error deleting snippet:", error);
      toast.error("Error deleting snippet");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      className="group relative card-hover"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Link href={`/snippets/${snippet._id}`} className="h-full block">
        <div className="relative h-full glass rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className='p-6 relative'>
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-all duration-500" />
                  <div className="relative p-3 rounded-xl bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-white/10 group-hover:border-white/20 transition-all duration-300">
                    <Image
                      src={`/${snippet.language}.png`}
                      alt={`${snippet.language} logo`}
                      className="w-6 h-6 object-contain relative z-10"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg text-xs font-semibold border border-indigo-500/30">
                      {snippet.language}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar className="size-3" />
                    {new Date(snippet._creationTime).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div
                className="absolute top-6 right-6 z-10 flex gap-2 items-center"
                onClick={(e) => e.preventDefault()}
              >
                <StarButton snippetId={snippet._id} />
                {user?.id === snippet.userId && (
                  <div className="z-10" onClick={(e) => e.preventDefault()}>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                        isDeleting
                          ? "bg-red-500/20 text-red-400 cursor-not-allowed"
                          : "bg-gray-500/10 text-gray-400 hover:bg-red-500/20 hover:text-red-400 border border-transparent hover:border-red-500/30"
                      }`}
                    >
                      {isDeleting ? (
                        <div className="size-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-white mb-3 line-clamp-1 group-hover:text-indigo-300 transition-colors">
                  {snippet.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-gray-800/50 border border-gray-700/50">
                      <User className="size-3" />
                    </div>
                    <span className="truncate max-w-[150px] font-medium">{snippet.userName}</span>
                  </div>
                </div>
              </div>

              {/* Code preview */}
              <div className="relative group/code">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover/code:opacity-100 transition-all duration-300" />
                <div className="code-block">
                  <div className="code-header">
                    <div className="flex items-center gap-2">
                      <Code className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500">Preview</span>
                    </div>
                  </div>
                  <pre className="relative bg-black/40 rounded-b-xl p-4 overflow-hidden text-sm text-gray-300 font-mono line-clamp-3 leading-relaxed">
                    {snippet.code}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default SnippetCard;