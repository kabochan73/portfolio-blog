"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

// cookieからトークンを取り出すユーティリティ
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

export default function AdminPostsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // 記事一覧を取得
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  }, []);

  // 記事削除
  async function handleDelete(slug: string, title: string) {
    if (!confirm(`「${title}」を削除しますか？`)) return;

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

  if (loading) return <p className="text-zinc-500">読み込み中...</p>;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">記事一覧</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          新規作成
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-zinc-500">記事がありません。</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-zinc-100 pb-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-lg font-semibold">{post.title}</h2>
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => router.push(`/admin/posts/${post.slug}/edit`)}
                    className="rounded px-3 py-1 text-xs font-medium text-zinc-600 hover:bg-zinc-100"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(post.slug, post.title)}
                    className="rounded px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                  >
                    削除
                  </button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <time className="text-sm text-zinc-500">
                  {post.published_at ? formatDate(post.published_at) : "下書き"}
                </time>
                <div className="flex gap-2">
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
  );
}
