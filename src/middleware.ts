import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // List of protected routes
  const protectedRoutes = ["/projects", "/projects/create", "/projects/"];

  // Check if the request path is protected
  const isProtected = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtected) {
    // Check for authentication cookie (adjust cookie name as needed)
    const authCookie = request.cookies.get("token");
    console.log(authCookie, "token")
    if (!authCookie) {
      // Redirect to login if not authenticated
      return NextResponse.redirect(new URL("/signin", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/projects/:path*"],
};
