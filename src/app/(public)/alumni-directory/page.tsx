// src/app/(public)/alumni-directory/page.tsx
import AlumniDirectoryClient from "@/components/alumni/AlumniDirectoryClient";
import { getAlumni } from "@/lib/data/alumni";

export default async function AlumniDirectoryPage() {
  const alumni = await getAlumni();
  return <AlumniDirectoryClient initialData={alumni} />;
}