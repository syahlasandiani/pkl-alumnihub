import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BackCTA from "@/components/ui/BackCTA";
import SectionHeading from "@/components/shared/SectionHeading";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
};

type Thread = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "OPEN" | "LOCKED" | "ARCHIVED" | "HIDDEN";
  created_at: string;
  author_id: string;
  category_id: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  verification_status?: string | null;
};

type CommentCountRow = {
  thread_id: string;
};

export default async function ForumPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currentUserProfile: ProfileRow | null = null;

  if (user) {
    const { data: me } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, verification_status")
      .eq("id", user.id)
      .maybeSingle<ProfileRow>();

    currentUserProfile = me ?? null;
  }

  const [{ data: categories, error: categoriesError }, { data: threads, error: threadsError }] =
    await Promise.all([
      supabase
        .from("forum_categories")
        .select("id, name, slug, description")
        .order("name", { ascending: true }),
      supabase
        .from("forum_threads")
        .select("id, title, slug, content, status, created_at, author_id, category_id")
        .in("status", ["OPEN", "LOCKED"])
        .order("created_at", { ascending: false }),
    ]);

  if (categoriesError) {
    console.error("Failed to load categories:", categoriesError.message);
  }

  if (threadsError) {
    console.error("Failed to load threads:", threadsError.message);
  }

  const safeCategories = (categories ?? []) as Category[];
  const safeThreads = (threads ?? []) as Thread[];

  const categoryMap = new Map(safeCategories.map((c) => [c.id, c]));

  const authorIds = [...new Set(safeThreads.map((thread) => thread.author_id).filter(Boolean))];

  let authorMap = new Map<string, ProfileRow>();

  if (authorIds.length > 0) {
    const { data: authorRows, error: authorError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", authorIds);

    if (authorError) {
      console.error("Failed to load thread authors:", authorError.message);
    } else {
      authorMap = new Map(
        ((authorRows ?? []) as ProfileRow[]).map((author) => [author.id, author])
      );
    }
  }

  const threadIds = safeThreads.map((thread) => thread.id);

  const commentCountMap = new Map<string, number>();

  if (threadIds.length > 0) {
    const { data: commentRows, error: commentCountError } = await supabase
      .from("thread_comments")
      .select("thread_id")
      .in("thread_id", threadIds)
      .eq("status", "VISIBLE");

    if (commentCountError) {
      console.error("Failed to load thread comment counts:", commentCountError.message);
    } else {
      for (const row of (commentRows ?? []) as CommentCountRow[]) {
        commentCountMap.set(row.thread_id, (commentCountMap.get(row.thread_id) ?? 0) + 1);
      }
    }
  }

  const isVerifiedAlumni =
    !!user && currentUserProfile?.verification_status?.toUpperCase() === "VERIFIED";

  return (
    <main className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/backgrounds/home-bg.jpg)" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/35" />

      <section className="px-6">
        <div className="max-w-6xl mx-auto pt-6 md:pt-8 pb-24">
          <div className="mb-6">
            <BackCTA href="/learning-hub" />
          </div>

          <SectionHeading
            title="Forum Diskusi"
            subtitle="Tempat alumni dan member berdiskusi, bertanya, dan berbagi insight."
            align="left"
          />

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-[320px_minmax(0,1fr)] gap-8">
            <aside className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-5">
              <h2 className="text-white font-semibold text-lg">Kategori</h2>

              <div className="mt-4 space-y-3">
                {safeCategories.length === 0 ? (
                  <p className="text-white/60 text-sm">Belum ada kategori.</p>
                ) : (
                  safeCategories.map((category) => (
                    <div
                      key={category.id}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div className="text-white font-medium">{category.name}</div>
                      <p className="mt-1 text-sm text-white/65">
                        {category.description || "Tanpa deskripsi"}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </aside>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-white font-semibold text-lg">Thread Terbaru</h2>

                {!user ? (
                  <Link
                    href="/login?next=/learning-hub/forum"
                    className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 text-white px-5 py-2 text-sm font-medium hover:bg-white/15 transition"
                  >
                    Login untuk interaksi
                  </Link>
                ) : isVerifiedAlumni ? (
                  <Link
                    href="/alumni/create/thread"
                    className="inline-flex items-center justify-center rounded-full border border-emerald-300/30 bg-emerald-400/15 text-white px-5 py-2 text-sm font-medium hover:bg-emerald-400/20 transition"
                  >
                    Buat Thread
                  </Link>
                ) : (
                  <span className="text-sm text-white/65">
                    Alumni terverifikasi dapat membuat thread.
                  </span>
                )}
              </div>

              {safeThreads.length === 0 ? (
                <div className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 text-white/70">
                  Belum ada thread.
                </div>
              ) : (
                safeThreads.map((thread) => {
                  const category = categoryMap.get(thread.category_id);
                  const author = authorMap.get(thread.author_id);
                  const commentCount = commentCountMap.get(thread.id) ?? 0;

                  return (
                    <Link
                      key={thread.id}
                      href={`/learning-hub/forum/${thread.slug}`}
                      className="block rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 hover:bg-white/15 transition"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
                          {category?.name || "Tanpa kategori"}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-medium border ${
                            thread.status === "LOCKED"
                              ? "border-amber-300/25 bg-amber-400/10 text-amber-100"
                              : "border-emerald-300/25 bg-emerald-400/10 text-emerald-100"
                          }`}
                        >
                          {thread.status === "LOCKED" ? "Dikunci" : "Terbuka"}
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-semibold text-white">{thread.title}</h3>

                      <p className="mt-2 line-clamp-2 text-sm text-white/70">{thread.content}</p>

                      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/55">
                        <span>
                          Oleh {author?.display_name?.trim() || "Pengguna Alumni Hub"}
                        </span>
                        <span>{commentCount} komentar</span>
                        <span>{new Date(thread.created_at).toLocaleString("id-ID")}</span>
                      </div>
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}