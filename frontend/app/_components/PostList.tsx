"use client";

import Link from "next/link";
import { useState } from "react";

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
  published_at: string;
  tags: Tag[];
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostList({
  posts,
  tags,
}: {
  posts: Post[];
  tags: Tag[];
}) {
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

  return (
    <div className="grid grid-cols-4 gap-10">
      {/* 記事一覧 */}
      <div className="col-span-3">
        {filtered.length === 0 ? (
          <p className="text-zinc-700">記事が見つかりません。</p>
        ) : (
          <ul className="space-y-6">
            {filtered.map((post) => (
              <li key={post.id} className="border-b border-zinc-100 pb-6">
                <Link href={`/posts/${post.slug}`} className="group">
                  <h2 className="text-lg font-semibold group-hover:text-blue-600">
                    {post.title}
                  </h2>
                </Link>
                <div className="mt-2 flex items-center gap-3">
                  <time className="text-sm text-zinc-700">
                    {formatDate(post.published_at)}
                  </time>
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
      <aside className="col-span-1 space-y-6">
        <div>
          <p className="mb-2 text-xl font-semibold uppercase tracking-wide text-zinc-600">
            検索
          </p>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="タイトルで検索"
            className="w-full rounded-md border border-zinc-400 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-zinc-500"
          />
        </div>

        {tags.length > 0 && (
          <div>
            <div className="flex flex-col gap-1.5">
              {tags.map((tag) => {
                const active = selectedTagIds.includes(tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`flex items-center gap-2 rounded px-2 py-1 text-left text-sm transition-colors ${
                      active
                        ? "bg-zinc-900 text-white hover:bg-zinc-700"
                        : "text-zinc-700 hover:bg-zinc-300"
                    }`}
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full border border-zinc-600"
                      style={{
                        backgroundColor: tag.color,
                      }}
                    />
                    <span className={active ? "font-medium" : ""}>
                      {tag.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
