import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Blocks, Code2, Sparkles, Zap } from "lucide-react";
import { SignedIn } from "@clerk/nextjs";

import RunButton from "./RunButton";
import HeaderProfileBtn from "./HeaderProfileBtn";
import ThemeSelector from "./ThemeSelector";
import LanguageSelector from "./LanguageSelector";

async function Header() {
  // Check if Convex URL is available
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  
  let convexUser = null;
  let user = null;

  try {
    if (convexUrl) {
      const convex = new ConvexHttpClient(convexUrl);
      user = await currentUser();

      if (user?.id) {
        convexUser = await convex.query(api.users.getUser, {
          userId: user.id,
        });
      }
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Continue rendering without user data
  }

  return (
    <div className="relative z-10">
      {/* Floating particles background */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <div className="glass rounded-2xl p-6 mb-6 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 opacity-50" />
        
        <div className="relative flex items-center lg:justify-between justify-center">
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="flex items-center gap-4 group relative">
              {/* Animated glow effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl" />

              {/* Logo container */}
              <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 p-3 rounded-2xl shadow-glow group-hover:shadow-glow-purple transition-all duration-300 transform group-hover:scale-110">
                <Blocks className="size-7 text-white transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
              </div>

              <div className="flex flex-col">
                <span className="block text-2xl font-bold gradient-text">
                  SyntaxForge
                </span>
                <span className="block text-sm text-indigo-400/80 font-medium">
                  Where Code Comes Alive
                </span>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center space-x-2">
              <Link
                href="/snippets"
                className="relative group flex items-center gap-3 px-6 py-3 rounded-xl glass-dark hover:bg-indigo-500/20 transition-all duration-300 shadow-lg overflow-hidden card-hover"
              >
                <Code2 className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors group-hover:rotate-3 transform duration-300" />
                <span className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors">
                  Code Snippets
                </span>
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 glass-dark rounded-xl p-2">
              <ThemeSelector />
              <div className="w-px h-8 bg-white/20" />
              <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
            </div>

            {!convexUser?.isPro && (
              <Link
                href="/pricing"
                className="flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 hover:border-amber-400/50 transition-all duration-300 card-hover shadow-glow"
              >
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span className="text-sm font-semibold text-amber-300">
                  Upgrade to Pro
                </span>
              </Link>
            )}

            {convexUser?.isPro && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-300">Pro</span>
              </div>
            )}

            <SignedIn>
              <RunButton />
            </SignedIn>

            <div className="pl-4 border-l border-white/20">
              <HeaderProfileBtn />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;