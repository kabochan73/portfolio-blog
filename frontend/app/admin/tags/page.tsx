"use client";

import { useEffect, useState } from "react";

type Tag = {
  id: number;
  name: string;
  slug: string;
  color: string;
};

function getToken(): string {
  const match = document.cookie.match(/auth_token=([^;]+)/);
  return match ? match[1] : "";
}

export default function AdminTagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6b7280");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`)
      .then((res) => res.json())
      .then((data) => setTags(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("タグ名を入力してください");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/tags`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name: name.trim(), color }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? "作成に失敗しました");
        return;
      }

      const newTag: Tag = await res.json();
      setTags((prev) => [...prev, newTag].sort((a, b) => a.name.localeCompare(b.name)));
      setName("");
      setColor("#6b7280");
    } catch {
      setError("作成に失敗しました");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(slug: string, tagName: string) {
    if (!confirm(`「${tagName}」を削除しますか？`)) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/tags/${slug}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      }
    );

    if (res.ok) {
      setTags((prev) => prev.filter((t) => t.slug !== slug));
    } else {
      alert("削除に失敗しました");
    }
  }

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">タグ管理</h1>

      {/* 新規作成フォーム */}
      <section className="mb-10">
        <form onSubmit={handleCreate} className="flex items-end gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              タグ名
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={20}
              className="rounded-md border border-zinc-400 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-600"
              placeholder="例：Next.js"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-700">
              カラー
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-md border border-zinc-600 p-0.5"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            作成
          </button>
        </form>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </section>

      {/* タグ一覧 */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500">
          タグ一覧
        </h2>
        {loading ? (
          <p className="text-zinc-500">読み込み中...</p>
        ) : tags.length === 0 ? (
          <p className="text-zinc-500">タグがありません。</p>
        ) : (
          <ul className="space-y-2">
            {tags.map((tag) => (
              <li
                key={tag.id}
                className="flex items-center justify-between rounded-md border border-zinc-400 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="text-sm font-medium">{tag.name}</span>
                  <span className="text-xs text-zinc-400">{tag.slug}</span>
                </div>
                <button
                  onClick={() => handleDelete(tag.slug, tag.name)}
                  className="rounded px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50"
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
