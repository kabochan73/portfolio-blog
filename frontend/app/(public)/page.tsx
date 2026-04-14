import PostList from "../_components/PostList";

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

async function getPosts(): Promise<Post[]> {
  const res = await fetch(`${process.env.API_URL}/posts`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

async function getTags(): Promise<Tag[]> {
  const res = await fetch(`${process.env.API_URL}/tags`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function HomePage() {
  const [posts, tags] = await Promise.all([getPosts(), getTags()]);

  return (
    <div>
      <PostList posts={posts} tags={tags} />
    </div>
  );
}
