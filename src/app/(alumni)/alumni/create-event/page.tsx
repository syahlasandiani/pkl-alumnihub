import AlumniShell from "@/components/alumni/AlumniShell";
import CreateEventForm from "@/components/alumni/CreateEventForm";

export default function CreateEventPage() {
  return (
    <AlumniShell
      title="Buat Event"
      subtitle="Bagikan webinar, mentoring, atau acara lainnya untuk komunitas alumni."
      backHref="/alumni"
      backLabel="Kembali ke Dashboard"
    >
      <CreateEventForm />
    </AlumniShell>
  );
}