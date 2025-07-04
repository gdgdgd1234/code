import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel';
import { Activity, Code2, Star, Timer, TrendingUp, Trophy, UserIcon, Zap, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { UserResource } from "@clerk/types";
import Image from 'next/image';

interface ProfileHeaderProps {
  userStats: {
    totalExecutions: number;
    languagesCount: number;
    languages: string[];
    last24Hours: number;
    favoriteLanguage: string;
    languageStats: Record<string, number>;
    mostStarredLanguage: string;
  };
  userData: {
    _id: Id<"users">;
    _creationTime: number;
    proSince?: number | undefined;
    lemonSqueezyCustomerId?: string | undefined;
    lemonSqueezyOrderId?: string | undefined;
    name: string;
    userId: string;
    email: string;
    isPro: boolean;
  };
  user: UserResource;
}

function ProfileHeader({ userStats, userData, user }: ProfileHeaderProps) {
  const starredSnippets = useQuery(api.snippets.getStarredSnippets);
  
  const STATS = [
    {
      label: "Code Executions",
      value: userStats?.totalExecutions ?? 0,
      icon: Activity,
      color: "from-indigo-500 to-blue-500",
      gradient: "group-hover:via-indigo-400",
      description: "Total code runs",
      metric: {
        label: "Last 24h",
        value: userStats?.last24Hours ?? 0,
        icon: Timer,
      },
    },
    {
      label: "Starred Snippets",
      value: starredSnippets?.length ?? 0,
      icon: Star,
      color: "from-amber-500 to-orange-500",
      gradient: "group-hover:via-amber-400",
      description: "Saved for later",
      metric: {
        label: "Most starred",
        value: userStats?.mostStarredLanguage ?? "N/A",
        icon: Trophy,
      },
    },
    {
      label: "Languages Used",
      value: userStats?.languagesCount ?? 0,
      icon: Code2,
      color: "from-purple-500 to-pink-500",
      gradient: "group-hover:via-purple-400",
      description: "Different languages",
      metric: {
        label: "Most used",
        value: userStats?.favoriteLanguage ?? "N/A",
        icon: TrendingUp,
      },
    },
  ];

  return (
    <div className="relative mb-8 glass rounded-3xl p-8 overflow-hidden card-hover">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-cyan-500/5 opacity-50" />
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:32px]" />
      
      <div className="relative">
        {/* Profile section */}
        <div className="flex items-center gap-8 mb-8">
          <div className="relative group">
            {/* Animated glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
            
            <div className="relative">
              <Image
                src={user.imageUrl}
                alt="Profile"
                width={120}
                height={120}
                className="rounded-full border-4 border-white/20 relative z-10 group-hover:scale-105 transition-transform duration-300 shadow-2xl"
              />

              {userData.isPro && (
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-full z-20 shadow-glow-purple animate-pulse">
                  <Zap className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold gradient-text">{userData.name}</h1>
              {userData.isPro && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 rounded-xl">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-300 font-semibold">Pro Member</span>
                </div>
              )}
            </div>
            <p className="text-gray-300 flex items-center gap-3 text-lg">
              <UserIcon className="w-5 h-5 text-indigo-400" />
              {userData.email}
            </p>
            {userData.isPro && userData.proSince && (
              <p className="text-sm text-purple-400">
                Pro member since {new Date(userData.proSince).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map((stat, index) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={index}
              className="group relative glass rounded-2xl overflow-hidden card-hover"
            >
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 transition-all duration-500 ${stat.gradient}`} />
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-400">{stat.description}</span>
                    </div>
                    <h3 className="text-3xl font-bold text-white tracking-tight">
                      {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
                    </h3>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                  
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} bg-opacity-20 border border-white/10 shadow-glow`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Metric */}
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <stat.metric.icon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-400">{stat.metric.label}:</span>
                  <span className="text-sm font-semibold text-white">{stat.metric.value}</span>
                </div>
              </div>

              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader;