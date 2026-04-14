"use client";

import { useEffect, useState } from "react";
import AdminPostList from "../../_components/AdminPostList";

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

export default function AdminDraftsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/posts`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }).then((r) => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags`).then((r) => r.json()),
    ]).then(([allPosts, allTags]) => {
      setPosts(allPosts.filter((p: Post) => p.published_at === null));
      setTags(allTags);
      setLoading(false);
    });
  }, []);

  if (loading) return <p className="text-zinc-500">読み込み中...</p>;

  return <AdminPostList title="下書き" posts={posts} tags={tags} />;
}
