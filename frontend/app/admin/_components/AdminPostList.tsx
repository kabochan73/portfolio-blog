"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  published_at: string | null;
  tags: Tag[];
};

function getToken(): string {
  const match = document.cookie.match(/auth_token=([^;]+)/);
  return match ? match[1] : "";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminPostList({
  title,
  posts: initialPosts,
  tags,
}: {
  title: string;
  posts: Post[];
  tags: Tag[];
}) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [query, setQuery] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  function toggleTag(id: number) {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  const filtered = posts.filter((post) => {
    const matchesQuery =
      query.trim() === "" ||
      post.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchesTags =
      selectedTagIds.length === 0 ||
      selectedTagIds.every((id) => post.tags.some((t) => t.id === id));
    return matchesQuery && matchesTags;
  });

  async function handleDelete(slug: string, postTitle: string) {
    if (!confirm(`「${postTitle}」を削除しますか？`)) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/posts/${slug}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (res.ok) {
      setPosts((prev) => prev.filter((p) => p.slug !== slug));
    } else {
      alert("削除に失敗しました");
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          新規作成
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-10">
        {/* 記事一覧 */}
        <div className="col-span-3">
          {filtered.length === 0 ? (
            <p className="text-zinc-500">記事がありません。</p>
          ) : (
            <ul className="space-y-6">
              {filtered.map((post) => (
                <li key={post.id} className="border-b border-zinc-400 pb-6 transition-transform hover:scale-[1.02]">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-lg font-semibold">{post.title}</h2>
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => router.push(`/admin/posts/${post.slug}/edit`)}
                        className="rounded px-3 py-1 text-sm font-medium bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(post.slug, post.title)}
                        className="rounded px-3 py-1 text-sm font-medium bg-red-50 text-red-500 hover:bg-red-100"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    {post.published_at && (
                      <time className="text-sm text-zinc-500">
                        {formatDate(post.published_at)}
                      </time>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full px-2 py-0.5 text-xs font-medium text-white"
                          style={{ backgroundColor: tag.color }}
                        >
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* サイドバー */}
        <aside className="col-span-1 space-y-6 sticky top-24 self-start">
          <div>
            <p className="mb-2 text-sm font-semibold text-zinc-600">検索</p>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="タイトルで検索"
              className="w-full rounded-md border border-zinc-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
          </div>

          {tags.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-zinc-600">タグ</p>
              <div className="flex flex-col gap-1.5">
                {tags.map((tag) => {
                  const active = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      onClick={() => toggleTag(tag.id)}
                      className="flex items-center gap-2 rounded-full px-3 py-1 text-left text-base font-bold transition-all hover:scale-105 hover:opacity-80"
                      style={
                        active
                          ? { backgroundColor: tag.color, color: "white" }
                          : { backgroundColor: "transparent", color: "#3f3f46" }
                      }
                    >
                      <span
                        className="h-4 w-4 shrink-0 rounded-full"
                        style={{ backgroundColor: active ? "white" : tag.color }}
                      />
                      {tag.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
