import { AppIcon } from "@/components/dashboard/AppIcon";
import { Dock } from "@/components/mobile/Dock";
import { Clock, Code2, BarChart3, Bot, Calendar, Settings, Mail, Music, Map, Camera, FolderOpen } from "lucide-react";
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
    },
    {
        title: "Mail",
        icon: Mail,
        href: "/mail",
        color: "bg-blue-400"
    },
    {
        title: "Files",
        icon: FolderOpen,
        href: "/files",
        color: "bg-indigo-400"
    },
    {
        title: "Maps",
        icon: Map,
        href: "/maps",
        color: "bg-green-500"
    },
    {
        title: "Camera",
        icon: Camera,
        href: "/camera",
        color: "bg-zinc-400"
    }
  ];

  const dockApps = apps.slice(0, 4); // First 4 apps in Dock
  const gridApps = apps.slice(4); // Rest in Grid

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
            <div className="w-full flex justify-between items-center p-6 z-20">
                <div className="text-xl font-bold tracking-tight text-white/80">
                    Jarvis OS
                </div>
                <div className="flex items-center gap-4">
                     <div className="opacity-80 hover:opacity-100 transition-opacity">
                        <ConnectGoogle />
                     </div>
                </div>
            </div>

            {/* App Grid Area */}
            <div className="flex-1 px-6 pt-4 pb-36 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-4 gap-y-10 gap-x-6 place-items-center max-w-2xl mx-auto">
                    {gridApps.map((app) => (
                        <AppIcon 
                            key={app.title} 
                            icon={app.icon} 
                            label={app.title} 
                            href={app.href} 
                            color={app.color} 
                        />
                    ))}
                     {/* Add some filler empty slots if needed to push content up from dock */}
                </div>
            </div>

            {/* Dock */}
            <Dock>
                 {dockApps.map((app) => (
                    <div key={app.title} className="hover:-translate-y-2 transition-transform duration-300">
                        <AppIcon 
                            icon={app.icon} 
                            label="" // No label in dock
                            href={app.href} 
                            color={app.color} 
                        />
                    </div>
                ))}
            </Dock>

        </main>
    </div>
  );
}
