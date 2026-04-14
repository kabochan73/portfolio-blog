"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  function handleLogout() {
    document.cookie = "auth_token=; path=/; max-age=0";
    router.push("/admin/login");
  }

  return (
    <div>
      <header className="border-b border-zinc-200 bg-white px-6 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/posts"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
            >
              記事
            </Link>
            <Link
              href="/admin/tags"
              className="text-sm font-medium text-zinc-700 hover:text-zinc-900"
            >
              タグ
            </Link>
          </nav>
          <button
            onClick={handleLogout}
            className="rounded px-3 py-1 text-sm text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            ログアウト
          </button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-10">{children}</main>
    </div>
  );
}
