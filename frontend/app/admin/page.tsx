import { redirect } from "next/navigation";

// /admin にアクセスしたら記事一覧へリダイレクト
export default function AdminPage() {
  redirect("/admin/posts");
}
