type CommentItem = {
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

type CommentListProps = {
  comments: CommentItem[];
};

function getInitial(name?: string | null) {
  if (!name) return "U";
  return name.trim().charAt(0).toUpperCase() || "U";
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/60">
        Belum ada komentar.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => {
        const displayName = comment.author?.display_name || "User";
        const avatarUrl = comment.author?.avatar_url || null;

        return (
          <div
            key={comment.id}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
          >
            <div className="flex items-start gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-10 w-10 shrink-0 rounded-full object-cover border border-white/15"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 text-sm font-semibold text-white">
                  {getInitial(displayName)}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <p className="font-medium text-white">{displayName}</p>
                  <span className="text-xs text-white/45">
                    {new Date(comment.created_at).toLocaleString("id-ID")}
                  </span>
                </div>

                <p className="mt-2 whitespace-pre-line text-white/80 leading-7">
                  {comment.content}
                </p>

                <div className="mt-3 flex items-center gap-4 text-sm text-white/55">
                  <button
                    type="button"
                    className="transition hover:text-white"
                    disabled
                    title="Fitur balas menyusul"
                  >
                    Balas
                  </button>
                  <button
                    type="button"
                    className="transition hover:text-white"
                    disabled
                    title="Fitur like menyusul"
                  >
                    Like
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}