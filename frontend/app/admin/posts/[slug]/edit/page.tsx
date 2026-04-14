"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import MarkdownBody from "../../../../_components/MarkdownBody";

type Tag = {
  id: number;
  name: string;
  slug: string;
  color: string;
};

type Post = {
  id: number;
  title: string;
  slug: string;
  body: string;
  published_at: string | null;
  tags: Tag[];
};

function getToken(): string {
  const match = document.cookie.match(/auth_token=([^;]+)/);
  return match ? match[1] : "";
}

export default function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js 16 ではクライアントコンポーネントの params も Promise なので use() で取得
  const { slug } = use(params);
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [tags, setTags] = useState<Tag[]>([]);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 記事とタグ一覧を並行取得
  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${slug}`).then((r) =>
        r.json()
      ),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`).then((r) => r.json()),
    ]).then(([post, allTags]: [Post, Tag[]]) => {
      setTitle(post.title);
      setBody(post.body);
      setPublishedAt(post.published_at);
      setSelectedTagIds(post.tags.map((t) => t.id));
      setTags(allTags);
      setLoading(false);
    });
  }, [slug]);

  function toggleTag(id: number) {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  async function handleSubmit(publish: boolean) {
    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }
    if (!body.trim()) {
      setError("本文を入力してください");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/posts/${slug}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            title,
            body,
            tag_ids: selectedTagIds,
            published_at: publish ? (publishedAt ?? new Date().toISOString()) : null,
          }),
        }
      );

      if (!res.ok) {
        setError("保存に失敗しました");
        return;
      }

      router.push("/admin/posts");
    } catch {
      setError("保存に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="text-zinc-500">読み込み中...</p>;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold">記事編集</h1>

      <div className="space-y-6">
        {/* タイトル */}
        <div>
          <label className="mb-1 block text-sm font-medium text-zinc-700">
            タイトル
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        {/* タグ */}
        {tags.length > 0 && (
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              タグ
            </label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-opacity ${
                    selectedTagIds.includes(tag.id)
                      ? "opacity-100"
                      : "opacity-30"
                  }`}
                  style={{ backgroundColor: tag.color, color: "white" }}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 本文 */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-700">
              本文（Markdown）
            </label>
            <div className="flex rounded-md border border-zinc-300 text-sm">
              <button
                type="button"
                onClick={() => setTab("edit")}
                className={`px-3 py-1 ${tab === "edit" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-50"}`}
              >
                編集
              </button>
              <button
                type="button"
                onClick={() => setTab("preview")}
                className={`px-3 py-1 ${tab === "preview" ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-50"}`}
              >
                プレビュー
              </button>
            </div>
          </div>
          {tab === "edit" ? (
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={20}
              className="w-full rounded-md border border-zinc-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          ) : (
            <div className="min-h-120 rounded-md border border-zinc-300 px-4 py-3">
              {body.trim() ? (
                <MarkdownBody body={body} />
              ) : (
                <p className="text-sm text-zinc-400">本文がありません</p>
              )}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* ボタン */}
        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit(true)}
            disabled={submitting}
            className="rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {publishedAt ? "更新する" : "公開する"}
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            className="rounded-md border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          >
            下書きに戻す
          </button>
          <button
            onClick={() => router.back()}
            disabled={submitting}
            className="ml-auto text-sm text-zinc-500 hover:text-zinc-700"
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
