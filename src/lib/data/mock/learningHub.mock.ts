// src/features/learning-hub/data/learningHub.mock.ts
export const eventPreview = [
  {
    title: "Ngobrol Riset: Menentukan Topik dan Novelty Penelitian",
    date: "Sabtu, 15 Maret 2025",
    time: "16.00 WIB",
    mode: "Online" as const,
    href: "/learning-hub/events/ngobrol-riset-topik-novelty",
  },
  {
    title: "Open Volunteer Pengabdian Desa",
    date: "Minggu, 17 Maret 2025",
    time: "16.00 WIB",
    mode: "Offline" as const,
    href: "/learning-hub/events/open-volunteer-pengabdian-desa",
  },
  {
    title: "Ngobrol Riset: Menentukan Topik dan Novelty Penelitian",
    date: "Sabtu, 15 Maret 2025",
    time: "16.00 WIB",
    mode: "Online" as const,
    href: "/learning-hub/events/ngobrol-riset-2",
  },
];

export const articlePreview = [
  {
    title: "Juara Kompetisi Informatika Nasional: Tips AWd A...",
    category: "Inspirasi",
    href: "/learning-hub/articles/juara-kompetisi-informatika",
    cover: "/assets/content/mapres.jpg",
  },
  {
    title: "Juara Kompetisi Robotik Internasional: Fajar Khoirul F...",
    category: "Prestasi",
    href: "/learning-hub/articles/juara-robotik-internasional",
    cover: "/assets/content/pegawai.jpg",
  },
  {
    title: "Juara Nasional Kompetisi Jenis Fisika: M. Imam Hanif",
    category: "Prestasi",
    href: "/learning-hub/articles/juara-nasional-fisika",
    cover: "/assets/content/mapres.jpg",
  },
];

export const resourcesPreview: Record<
  string,
  { label: string; href: string }[]
> = {
  "Contoh Essay": [
    { label: "Essay Beasiswa Unggulan 2021", href: "/learning-hub/resources/essay-2021" },
    { label: "Essay Beasiswa Unggulan 2022", href: "/learning-hub/resources/essay-2022" },
    { label: "Essay Beasiswa Unggulan 2023", href: "/learning-hub/resources/essay-2023" },
  ],
  "Contoh Soal": [
    { label: "Contoh Soal BU (Paket 2021)", href: "/learning-hub/resources/soal-2021" },
    { label: "Contoh Soal BU (Paket 2022)", href: "/learning-hub/resources/soal-2022" },
    { label: "Contoh Soal BU (Paket 2023)", href: "/learning-hub/resources/soal-2023" },
  ],
  "Format Surat": [
    { label: "Format Berkas Persyaratan BU", href: "/learning-hub/resources/format-berkas" },
    { label: "Surat Pernyataan 2025", href: "/learning-hub/resources/surat-pernyataan" },
    { label: "Format Dokumen Pendukung", href: "/learning-hub/resources/format-dokumen" },
  ],
};

export const forumPreview = [
  {
    title: "Tips Essay BU 2025",
    tag: "Tips",
    href: "/forum/tips-essay-bu-2025",
    meta: "Terakhir aktif: 2 jam lalu",
  },
  {
    title: "Career Switching",
    tag: "Karier",
    href: "/forum/career-switching",
    meta: "Terakhir aktif: 2 jam lalu",
  },
  {
    title: "Publikasi Jurnal",
    tag: "Studi Lanjut",
    href: "/forum/publikasi-jurnal",
    meta: "Terakhir aktif: 2 jam lalu",
  },
  {
    title: "Kolaborasi Program Literasi",
    tag: "Kolaborasi",
    href: "/forum/kolaborasi-literasi",
    meta: "Terakhir aktif: 2 jam lalu",
  },
  {
    title: "Tips Essay BU 2025",
    tag: "Tips",
    href: "/forum/tips-essay-bu-2025-2",
    meta: "Terakhir aktif: 2 jam lalu",
  },
  {
    title: "Tips Essay BU 2025",
    tag: "Tips",
    href: "/forum/tips-essay-bu-2025-3",
    meta: "Terakhir aktif: 2 jam lalu",
  },
];