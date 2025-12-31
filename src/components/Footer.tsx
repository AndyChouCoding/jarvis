import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          {["Twitter", "GitHub", "Discord"].map((item) => (
            <Link
              key={item}
              href="#"
              className="text-zinc-400 hover:text-zinc-500"
            >
              <span className="sr-only">{item}</span>
              {/* Placeholder icons or text */}
              <span className="text-sm">{item}</span>
            </Link>
          ))}
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-zinc-500">
            &copy; {new Date().getFullYear()} Jarvis AI, Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
