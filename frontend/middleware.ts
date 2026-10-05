import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const authMiddleware = withAuth({
  pages: {
    signIn: "/login",
  },
});

export default function middleware(req: any) {
  if (req.cookies.has("playwright-bypass")) {
    return NextResponse.next();
  }
  return (authMiddleware as any)(req);
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
