import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const isLoginPage = request.nextUrl.pathname === "/admin/login";

  // 未ログインで /admin 以下にアクセスしたらログインページへ
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // ログイン済みでログインページにアクセスしたら管理画面トップへ
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

// /admin および /admin 以下のパスに適用する
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
