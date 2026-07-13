import { NextResponse } from "next/server";

/* Layer 1 (this file): route access, the real security boundary.
   Layer 2 (dashboard layouts): client-side safety net for stale role state.
   Layer 3 (<Can>): UI visibility within shared pages. */

const ROLE_HOME = {
  USER: "/dashboard",
  AGENT: "/agent",
  HOTEL_OWNER: "/hotel-owner",
  ADMIN: "/admin",
  SUPER_ADMIN: "/admin",
};

const ROUTE_ACCESS = [
  { prefix: "/dashboard", roles: ["USER", "ADMIN", "SUPER_ADMIN"] },
  { prefix: "/agent", roles: ["AGENT", "ADMIN", "SUPER_ADMIN"] },
  { prefix: "/hotel-owner", roles: ["HOTEL_OWNER", "ADMIN", "SUPER_ADMIN"] },
  { prefix: "/admin", roles: ["ADMIN", "SUPER_ADMIN"] },
];

const GUEST_ONLY_ROUTES = ["/login", "/register"];

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth_token")?.value;
  const role = request.cookies.get("user_role")?.value;

  // Guest-only pages — redirect to role home if already logged in
  if (GUEST_ONLY_ROUTES.includes(pathname)) {
    if (token) {
      const home = ROLE_HOME[role] || "/dashboard";
      return NextResponse.redirect(new URL(home, request.url));
    }
    return NextResponse.next();
  }

  // Protected dashboard routes
  for (const entry of ROUTE_ACCESS) {
    if (pathname.startsWith(entry.prefix)) {
      if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
      if (!role || !entry.roles.includes(role)) {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
