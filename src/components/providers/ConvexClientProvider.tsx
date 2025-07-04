"use client"
import { ClerkProvider, useAuth } from '@clerk/nextjs'
import { ConvexReactClient } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import React from 'react'

// Check for required environment variables
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!convexUrl) {
  console.error('Missing NEXT_PUBLIC_CONVEX_URL environment variable');
}

if (!clerkPublishableKey) {
  console.error('Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY environment variable');
}

// Only create Convex client if URL is available
const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

function ConvexClientProvider({children}: {children: React.ReactNode}) {
  // If required environment variables are missing, show error message
  if (!clerkPublishableKey || !convexUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-red-900/20 border border-red-500/30 rounded-lg">
          <h2 className="text-xl font-bold text-red-400 mb-4">Configuration Error</h2>
          <p className="text-red-300 mb-4">Missing required environment variables:</p>
          <ul className="text-red-300 text-left space-y-1">
            {!clerkPublishableKey && <li>• NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</li>}
            {!convexUrl && <li>• NEXT_PUBLIC_CONVEX_URL</li>}
          </ul>
          <p className="text-red-300 mt-4 text-sm">
            Please check your .env.local file and ensure these variables are set.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
        <ConvexProviderWithClerk client={convex!} useAuth={useAuth}>
            {children}
        </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}

export default ConvexClientProvider