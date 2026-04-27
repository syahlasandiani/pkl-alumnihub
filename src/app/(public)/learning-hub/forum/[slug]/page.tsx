import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BackCTA from "@/components/ui/BackCTA";
import CommentForm from "@/components/forum/CommentForm";
import CommentList from "@/components/forum/CommentList";

type ThreadRow = {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: "OPEN" | "LOCKED" | "ARCHIVED" | "HIDDEN";
  created_at: string;
  category_id: string;
  author_id: string;
};

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
};

type RawCommentRow = {
  id: string;
  content: string;
  created_at: string;
  parent_comment_id: string | null;
  author_id: string;
};

type ProfileRow = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
};

type CommentWithAuthor = {
  id: string;
  content: string;
  created_at: string;
  parent_comment_id: string | null;
  author?: {
    id?: string;
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
};

export default async function ThreadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: thread, error: threadError } = await supabase
    .from("forum_threads")
    .select("id, title, slug, content, status, created_at, category_id, author_id")
    .eq("slug", slug)
    .in("status", ["OPEN", "LOCKED"])
    .maybeSingle<ThreadRow>();

  if (threadError || !thread) notFound();

  const [{ data: category }, { data: threadAuthor }, { data: commentsData, error: commentsError }] =
    await Promise.all([
      supabase
        .from("forum_categories")
        .select("id, name, slug")
        .eq("id", thread.category_id)
        .maybeSingle<CategoryRow>(),
      supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .eq("id", thread.author_id)
        .maybeSingle<ProfileRow>(),
      supabase
        .from("thread_comments")
        .select("id, content, created_at, parent_comment_id, author_id")
        .eq("thread_id", thread.id)
        .eq("status", "VISIBLE")
        .order("created_at", { ascending: true }),
    ]);

  if (commentsError) {
    console.error("Failed to load comments:", commentsError.message);
  }

  const rawComments = (commentsData ?? []) as RawCommentRow[];

  const authorIds = [...new Set(rawComments.map((c) => c.author_id).filter(Boolean))];

  let profileMap = new Map<string, ProfileRow>();

  if (authorIds.length > 0) {
    const { data: profileRows, error: profileError } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url")
      .in("id", authorIds);

    if (profileError) {
      console.error("Failed to load comment authors:", profileError.message);
    } else {
      profileMap = new Map(
        ((profileRows ?? []) as ProfileRow[]).map((profile) => [profile.id, profile])
      );
    }
  }

  const comments: CommentWithAuthor[] = rawComments.map((comment) => {
    const author = profileMap.get(comment.author_id);

    return {
      id: comment.id,
      content: comment.content,
      created_at: comment.created_at,
      parent_comment_id: comment.parent_comment_id,
      author: {
        id: comment.author_id,
        display_name:
          author?.display_name?.trim() ||
          "Pengguna Alumni Hub",
        avatar_url: author?.avatar_url || null,
      },
    };
  });
  
  const isLocked = thread.status === "LOCKED";

  return (
    <main className="relative min-h-screen">
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center"
        style={{ backgroundImage: "url(/assets/backgrounds/home-bg.jpg)" }}
      />
      <div className="fixed inset-0 -z-10 bg-black/35" />

      <section className="px-6">
        <div className="max-w-4xl mx-auto pt-6 md:pt-8 pb-24">
          <div className="mb-6">
            <BackCTA href="/learning-hub/forum" />
          </div>

          <article className="rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6 md:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80">
                {category?.name || "Tanpa kategori"}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-[11px] font-medium border ${
                  isLocked
                    ? "border-amber-300/25 bg-amber-400/10 text-amber-100"
                    : "border-emerald-300/25 bg-emerald-400/10 text-emerald-100"
                }`}
              >
                {isLocked ? "Dikunci" : "Terbuka"}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/55">
              <span>
                Oleh {threadAuthor?.display_name?.trim() || "Pengguna Alumni Hub"}
              </span>
              <span>{new Date(thread.created_at).toLocaleString("id-ID")}</span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold text-white">{thread.title}</h1>

            <div className="mt-6 whitespace-pre-line text-white/80 leading-7">
              {thread.content}
            </div>
          </article>

          <section className="mt-8 rounded-3xl border border-white/15 bg-white/10 backdrop-blur-xl p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-white font-semibold text-xl">
                  Komentar ({comments.length})
                </h2>
                <p className="mt-1 text-sm text-white/55">
                  Diskusi seputar thread ini.
                </p>
              </div>

              {!user ? (
                <Link
                  href={`/login?next=/learning-hub/forum/${thread.slug}`}
                  className="text-sm text-white/80 hover:text-white"
                >
                  Login untuk komentar
                </Link>
              ) : isLocked ? (
                <span className="text-sm text-amber-100/90">
                  Thread ini dikunci. Komentar dinonaktifkan.
                </span>
              ) : (
                <span className="text-sm text-white/55">Urutan: Terlama</span>
              )}
            </div>

            {user && !isLocked ? <CommentForm threadId={thread.id} /> : null}

            <div className="mt-6">
              <CommentList comments={comments} />
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}