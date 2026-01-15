import { AppIcon } from "@/components/dashboard/AppIcon";
import { Clock, Code2, BarChart3, Bot, Calendar, Settings } from "lucide-react";
import { ConnectGoogle } from "@/components/workspace/ConnectGoogle";

export default function Home() {
  const apps = [
    {
      title: "Time Agent",
      icon: Clock,
      href: "/tools/chat",
      color: "bg-orange-500",
    },
    {
      title: "Code Gen",
      icon: Code2,
      href: "/tools/code-generator",
      color: "bg-blue-600",
    },
    {
      title: "Data Vis",
      icon: BarChart3,
      href: "/tools/data-analyzer",
      color: "bg-emerald-500",
    },
    {
      title: "Assistant",
      icon: Bot,
      href: "/tools/chat",
      color: "bg-purple-600",
    },
    { 
        title: "Calendar", 
        icon: Calendar, 
        href: "/dashboard", 
        color: "bg-red-500" 
    },
    { 
        title: "Settings", 
        icon: Settings, 
        href: "/settings", 
        color: "bg-zinc-600" 
    }
  ];

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden relative">
        
        {/* Abstract Background Wallpaper */}
        <div className="absolute inset-0 z-0 pointer-events-none">
             {/* Vibrant gradient background */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2670&auto=format&fit=crop')] bg-cover bg-center opacity-40 blur-sm scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>

        {/* Content Container */}
        <main className="relative z-10 flex flex-col h-full">
            
            {/* Simple Minimalist Header */}
            <div className="w-full flex justify-between items-center p-8 z-20">
                <div className="text-2xl font-bold tracking-tight text-white/90">
                    Jarvis OS
                </div>
                <div className="flex items-center gap-4">
                     <div className="opacity-90 hover:opacity-100 transition-opacity">
                        <ConnectGoogle />
                     </div>
                </div>
            </div>

            {/* App Grid Area - Centered for Desktop */}
            <div className="flex-1 flex items-center justify-center p-12 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-12 gap-y-16 place-items-center max-w-5xl mx-auto">
                    {apps.map((app) => (
                        <div key={app.title} className="hover:-translate-y-2 transition-transform duration-300">
                             <AppIcon 
                                icon={app.icon} 
                                label={app.title} 
                                href={app.href} 
                                color={app.color} 
                            />
                        </div>
                    ))}
                </div>
            </div>

        </main>
    </div>
  );
}
