import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <p className="text-8xl font-bold text-zinc-200">404</p>
      <h1 className="text-2xl font-bold">ページが見つかりません</h1>
      <Link
        href="/"
        className="mt-4 rounded-md bg-zinc-900 px-5 py-2 text-sm font-medium text-white hover:bg-zinc-700"
      >
        トップへ戻る
      </Link>
    </div>
  );
}
