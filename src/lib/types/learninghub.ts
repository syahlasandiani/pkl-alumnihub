export type EventMode = "Online" | "Offline";

export type HubEvent = {
  id: string;
  slug: string;
  title: string;
  mode: EventMode;      // Online/Offline
  dateLabel: string;    // "Sabtu, 15 Maret 2025"
  timeLabel: string;    // "16.00 WIB"
  locationLabel: string; // "Zoom" / "Bandung" / "Jakarta"
  // nanti kalau sudah supabase: start_at, end_at, city, meeting_link, dll
};