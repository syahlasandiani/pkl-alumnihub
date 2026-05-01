import AlumniShell from "@/components/alumni/AlumniShell";
import UploadResourceForm from "@/components/alumni/UploadResourceForm";

export default function UploadResourcePage() {
  return (
    <AlumniShell
      title="Upload Resource"
      subtitle="Bagikan dokumen, template, atau file pembelajaran dengan alumni lainnya."
      backHref="/alumni"
      backLabel="Kembali ke Dashboard"
    >
      <UploadResourceForm />
    </AlumniShell>
  );
}