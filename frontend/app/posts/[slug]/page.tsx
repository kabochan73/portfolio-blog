import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MarkdownBody from "./MarkdownBody";

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
  published_at: string;
  tags: Tag[];
};

async function getPost(slug: string): Promise<Post | null> {
  const res = await fetch(`${process.env.API_URL}/posts/${slug}`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) return null;

  return res.json();
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) return { title: "記事が見つかりません | Blog" };

  return {
    title: `${post.title} | Blog`,
    description: post.body.slice(0, 100),
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // Next.js 16 では params が Promise なので await が必要
  const { slug } = await params;
  const post = await getPost(slug);

  // 記事が見つからなければ 404 ページを表示
  if (!post) notFound();

  return (
    <article>
      <header className="mb-8">
        <h1 className="text-3xl font-bold leading-snug">{post.title}</h1>
        <div className="mt-3 flex items-center gap-3">
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
      </header>

      <MarkdownBody body={post.body} />
    </article>
  );
}
