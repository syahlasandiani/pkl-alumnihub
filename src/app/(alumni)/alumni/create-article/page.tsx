import AlumniShell from "@/components/alumni/AlumniShell";
import CreateArticleForm from "@/components/alumni/CreateArticleForm";

export default function CreateArticlePage() {
  return (
    <AlumniShell
      title="Buat Berita"
      subtitle="Tulis artikel atau berita terbaru untuk komunitas alumni."
      backHref="/alumni"
      backLabel="Kembali ke Dashboard"
    >
      <CreateArticleForm />
    </AlumniShell>
  );
}
