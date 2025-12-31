"use client";

import { signIn, signOut, useSession } from "next-auth/react";
// Checking previous files, I don't recall seeing a UI library. I'll use standard Tailwind classes.

export function ConnectGoogle() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="flex items-center gap-2">
            {session.user?.image && (
                <img src={session.user.image} alt={session.user.name || "User"} className="w-8 h-8 rounded-full" />
            )}
            <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {session.user?.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Workspace Connected
                </p>
            </div>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm text-red-600 hover:text-red-700 font-medium"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm text-center">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">Connect Workspace</h3>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
            Sign in with Google to access Calendar and Drive features.
        </p>
      <button
        onClick={() => signIn("google")}
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
}
