"use client";

import { Home, Settings, Box, Database, MessageSquare, Terminal } from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "All Tools", href: "/tools", icon: Box },
  { name: "Agents", href: "/agents", icon: MessageSquare },
  { name: "Workflows", href: "/workflows", icon: Terminal },
  { name: "Knowledge", href: "/knowledge", icon: Database },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-zinc-200 bg-white px-6 pb-4 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex h-16 shrink-0 items-center">
        <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Jarvis
        </span>
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-zinc-700 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-indigo-400"
                  >
                    <item.icon
                      className="h-6 w-6 shrink-0 text-zinc-400 group-hover:text-indigo-600 dark:text-zinc-500 dark:group-hover:text-indigo-400"
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <Link
              href="/profile"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-zinc-700 hover:bg-zinc-50 hover:text-indigo-600 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-indigo-400"
            >
              <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800" />
              My Profile
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}
