import { getEvents } from "@/lib/data/events";
import AlumniEventsSection from "@/components/home/AlumniEventsSection";
import BackCTA from "@/components/ui/BackCTA";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="min-h-screen pb-24">
      <div className="pt-10 max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <BackCTA href="/learning-hub" />
        </div>
        <AlumniEventsSection events={events} />
      </div>
      
      {events.length === 0 && (
        <div className="max-w-6xl mx-auto px-6 text-center py-20 text-white/40">
          Belum ada event yang dibuat. Jadilah yang pertama membuat event!
        </div>
      )}
    </main>
  );
}
