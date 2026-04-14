import Link from "next/link";

// APIから返ってくるデータの型定義
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

// 記事一覧をAPIから取得する関数
async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${process.env.API_URL}/posts`, {
    // next.js のキャッシュ設定 — 毎リクエスト最新を取得する
    cache: "no-store",
  });

  if (!res.ok) return [];

  return res.json();
}

// 日付を「2025年4月14日」のように整形する関数
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <div>
      <h1 className="mb-8 text-2xl font-bold">記事一覧</h1>

      {posts.length === 0 ? (
        <p className="text-zinc-500">まだ記事がありません。</p>
      ) : (
        <ul className="space-y-6">
          {posts.map((post) => (
            <li key={post.id} className="border-b border-zinc-100 pb-6">
              <Link href={`/posts/${post.slug}`} className="group">
                <h2 className="text-lg font-semibold group-hover:text-blue-600">
                  {post.title}
                </h2>
              </Link>
              <div className="mt-2 flex items-center gap-3">
                <time className="text-sm text-zinc-500">
                  {formatDate(post.published_at)}
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
