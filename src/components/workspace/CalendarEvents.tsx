"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

type Event = {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink: string;
};

export function CalendarEvents() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      fetchEvents();
    } else {
        setEvents([]); // Clear events on logout
    }
  }, [session]);

  const fetchEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/calendar");
      if (!res.ok) {
         if (res.status === 401) return; // Ignore if not auth (though session check should handle it)
         throw new Error("Failed to fetch events");
      }
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error(err);
      setError("Could not load calendar events.");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="mt-6 rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 p-6">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
        <Calendar className="h-5 w-5 text-blue-600" />
        Upcoming Usage
      </h3>

      {loading && <p className="text-sm text-zinc-500">Loading events...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      
      {!loading && !error && events.length === 0 && (
        <p className="text-sm text-zinc-500">No upcoming events found.</p>
      )}

      <div className="space-y-3">
        {events.map((event) => {
            const start = event.start.dateTime ? new Date(event.start.dateTime).toLocaleString() : event.start.date;
            return (
                <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800">
                    <div>
                        <a href={event.htmlLink} target="_blank" rel="noopener noreferrer" className="font-medium text-zinc-900 dark:text-zinc-100 hover:underline">
                            {event.summary || "No Title"}
                        </a>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">{start}</p>
                    </div>
                </div>
            );
        })}
      </div>
    </div>
  );
}
