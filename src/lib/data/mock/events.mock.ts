import type { HubEvent } from "@/lib/types/learninghub";

export const eventsMock: HubEvent[] = [
  {
    id: "ev-001",
    slug: "ngobrol-riset-topik-novelty",
    title: "Ngobrol Riset: Menentukan Topik dan Novelty Penelitian",
    mode: "Online",
    dateLabel: "Sabtu, 15 Maret 2025",
    timeLabel: "16.00 WIB",
    locationLabel: "Zoom",
  },
  {
    id: "ev-002",
    slug: "open-volunteer-pengabdian-desa",
    title: "Open Volunteer Pengabdian Desa",
    mode: "Offline",
    dateLabel: "Sabtu, 15 Maret 2025",
    timeLabel: "16.00 WIB",
    locationLabel: "Bandung",
  },
  // …lanjutkan sampai 10–12 item (variasikan Online/Offline, tanggal, kota)
];