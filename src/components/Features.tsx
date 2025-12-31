import { Terminal, Cpu, BarChart3, ShieldCheck } from "lucide-react";

const features = [
  {
    name: "Task Automation",
    description:
      "Delegate repetitive tasks to autonomous agents that work 24/7 to keep your projects moving forward.",
    icon: Terminal,
  },
  {
    name: "Code Generation",
    description:
      "Generate high-quality, production-ready code in seconds with context-aware AI programming assistants.",
    icon: Cpu,
  },
  {
    name: "Smart Analysis",
    description:
      "Gain deep insights from your data with advanced analytical models that uncover hidden patterns and trends.",
    icon: BarChart3,
  },
  {
    name: "Secure & Private",
    description:
      "Enterprise-grade security ensures your data and intellectual property remain protected at all times.",
    icon: ShieldCheck,
  },
];

export function Features() {
  return (
    <div className="bg-white py-24 sm:py-32 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">
            Deploy Faster
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
            Everything you need to build intelligent apps
          </p>
          <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Jarvis provides a comprehensive suite of tools designed to accelerate
            development and enhance capabilities of your AI-powered applications.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-zinc-900 dark:text-zinc-50">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                    <feature.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
