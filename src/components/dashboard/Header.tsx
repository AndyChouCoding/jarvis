import { Search, Bell } from "lucide-react";

export function Header() {
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-zinc-200 bg-white px-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:gap-x-6 sm:px-6 lg:px-8">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <div className="relative w-full text-zinc-400 focus-within:text-zinc-600 dark:focus-within:text-zinc-200">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-5 w-5" aria-hidden="true" />
            </div>
            <input
                id="search-field"
                className="block h-full w-full border-0 py-0 pl-10 pr-0 text-zinc-900 placeholder:text-zinc-400 focus:ring-0 dark:bg-transparent dark:text-zinc-100 sm:text-sm"
                placeholder="Search tools, agents, workflows..."
                type="search"
                name="search"
            />
          </div>
        </form>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-zinc-400 hover:text-zinc-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" aria-hidden="true" />
          </button>
          <div
            className="hidden lg:block lg:h-6 lg:w-px lg:bg-zinc-200 dark:lg:bg-zinc-800"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
