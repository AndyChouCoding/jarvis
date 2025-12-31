import { LucideIcon, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export function ToolCard({ title, description, icon: Icon, href }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-6 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
    >
      <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/30 transition-colors">
        <Icon className="h-6 w-6 text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
      </div>
      <div>
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </h3>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2">
          {description}
        </p>
      </div>
      <div className="mt-auto pt-4 flex items-center text-sm font-medium text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
        Open Tool <ArrowRight className="ml-1 h-4 w-4" />
      </div>
    </Link>
  );
}
