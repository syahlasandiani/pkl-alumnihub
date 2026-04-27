import AlumniShell from "@/components/alumni/AlumniShell";
import {
  AlumniInput,
  AlumniTextarea,
} from "@/components/alumni/AlumniField";

export default function CreateEventPage() {
  return (
    <AlumniShell
      title="Buat Event"
      subtitle="Buat webinar, mentoring, atau acara lainnya untuk alumni."
      backHref="/alumni"
      backLabel="Kembali ke Dashboard"
      actionLabel="Buat Event"
      actionHref="/alumni/create-event"
    >
      <section className="rounded-[30px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">
        <div className="space-y-5">
          <AlumniInput
            label="Judul Event*"
            placeholder="Masukkan judul event"
          />

          <div>
            <p className="mb-2 text-sm text-white/85">Jenis Event*</p>
            <div className="flex gap-6 text-sm text-white/80">
              <label>
                <input
                  type="radio"
                  name="eventType"
                  className="mr-2"
                  defaultChecked
                />
                Online
              </label>
              <label>
                <input type="radio" name="eventType" className="mr-2" />
                Offline
              </label>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <AlumniInput label="Tanggal Event*" type="date" />
            <AlumniInput label="Waktu Event*" type="time" />
          </div>

          <AlumniTextarea
            label="Deskripsi Event*"
            placeholder="Masukkan deskripsi event"
          />
        </div>
      </section>
    </AlumniShell>
  );
}