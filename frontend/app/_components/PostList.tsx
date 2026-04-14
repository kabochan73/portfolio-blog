"use client";

import Link from "next/link";
import { useState } from "react";
import { useFilter } from "../(public)/_context/FilterContext";

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
  const { open: sidebarOpen } = useFilter();

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

  const sidebar = (
    <div className="space-y-6">
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
    </div>
  );

  return (
    <div>
      {/* スマホ用展開パネル */}
      {sidebarOpen && (
        <div className="mb-4 rounded-md border border-zinc-200 p-4 md:hidden">
          {sidebar}
        </div>
      )}

      {/* デスクトップ用グリッド */}
      <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
        {/* 記事一覧 */}
        <div className="md:col-span-3">
          {filtered.length === 0 ? (
            <p className="text-zinc-700">記事が見つかりません。</p>
          ) : (
            <ul className="space-y-6">
              {filtered.map((post) => (
                <li key={post.id} className="border-b border-zinc-400 pb-6 transition-transform hover:scale-[1.02]">
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

        {/* サイドバー（デスクトップのみ） */}
        <aside className="sticky top-24 col-span-1 hidden self-start md:block">
          {sidebar}
        </aside>
      </div>
    </div>
  );
}
