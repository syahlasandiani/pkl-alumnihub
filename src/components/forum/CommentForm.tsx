"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type CommentFormProps = {
  threadId: string;
};

export default function CommentForm({ threadId }: CommentFormProps) {
  const supabase = createClient();
  const router = useRouter();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) return;

    setLoading(true);
    setErrorMsg("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      setErrorMsg("Kamu harus login untuk menulis komentar.");
      return;
    }

    const { error } = await supabase.from("thread_comments").insert({
      thread_id: threadId,
      author_id: user.id,
      content: trimmed,
      status: "VISIBLE",
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setContent("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5">
      <div className="rounded-[28px] border border-white/15 bg-white/10 backdrop-blur-xl p-4 md:p-5">
        <div className="mb-3">
          <h3 className="text-base md:text-lg font-semibold text-white">
            Tambahkan komentar
          </h3>
          <p className="mt-1 text-sm text-white/60">
            Bagikan pendapatmu dengan sopan dan tetap relevan dengan topik.
          </p>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis komentarmu di sini..."
          rows={5}
          className="w-full resize-none rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-white placeholder:text-white/45 outline-none focus:border-white/30"
        />

        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="text-xs text-white/50">
            Hindari spam, ujaran kebencian, dan informasi yang tidak relevan.
          </div>

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="inline-flex h-11 items-center justify-center rounded-full border border-white/15 bg-white/15 px-5 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </div>

        {errorMsg ? (
          <p className="mt-3 text-sm text-red-200">{errorMsg}</p>
        ) : null}
      </div>
    </form>
  );
}