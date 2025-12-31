import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ToolCard } from "@/components/dashboard/ToolCard";
import { Clock, Code2, BarChart3, Bot } from "lucide-react";
import { ConnectGoogle } from "@/components/workspace/ConnectGoogle";
import { CalendarEvents } from "@/components/workspace/CalendarEvents";

export default function Home() {
  const tools = [
    {
      title: "Time Agent",
      description: "Get current time for any city worldwide using our smart agent.",
      icon: Clock,
      href: "/tools/chat",
    },
    {
      title: "Code Generator",
      description: "Generate boilerplate code for your next project instantly.",
      icon: Code2,
      href: "/tools/code-generator",
    },
    {
      title: "Data Analyzer",
      description: "Upload datasets and get instant insights and visualizations.",
      icon: BarChart3,
      href: "/tools/data-analyzer",
    },
    {
      title: "Chat Assistant",
      description: "General purpose AI assistant to help you with daily tasks.",
      icon: Bot,
      href: "/tools/chat",
    },
  ];

  return (
    <DashboardShell>
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-zinc-900 dark:text-zinc-50 sm:truncate sm:text-3xl sm:tracking-tight">
            Dashboard
          </h2>
        </div>
        <div className="mt-4 md:mt-0 md:ml-4">
            <ConnectGoogle />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.title} {...tool} />
        ))}
      </div>

      <CalendarEvents />
    </DashboardShell>
  );
}
