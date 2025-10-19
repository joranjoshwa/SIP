import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";
import { isTokenExpired, extractRoleFromToken } from "./utils/token";
import { Role } from "./enums/role";

const PUBLIC_ROUTES = ["/", "/login", "/signup", "/recover-password", "/forgot-password", "/verification"];
const ADMIN_PREFIXES = ["/dashboard/schedule"];

const LOGIN = "/login";
const DASHBOARD = "/dashboard";

const normalize = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);
const isPublic = (p: string) => PUBLIC_ROUTES.includes(normalize(p));
const startsWithAny = (p: string, list: string[]) =>
    list.some((prefix) => normalize(p) === prefix || normalize(p).startsWith(prefix + "/"));

const redirect = (request: NextRequest, path: string, query = "") => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = query;
    return NextResponse.redirect(url);
};

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const token = request.cookies.get("token")?.value;
    const publicRoute = isPublic(pathname);
    const adminArea = startsWithAny(pathname, ADMIN_PREFIXES);

    if (!token || isTokenExpired(token)) {
        return publicRoute ? NextResponse.next() : redirect(request, LOGIN, `?returnTo=${encodeURIComponent(pathname + search)}`);
    }

    let role: Role | null;
    try {
        role = extractRoleFromToken(token) as Role;
    } catch {
        return redirect(request, LOGIN, `?returnTo=${encodeURIComponent(pathname + search)}`);
    }

    if (publicRoute) return redirect(request, DASHBOARD);
    if (adminArea && role !== Role.ADMIN) return redirect(request, DASHBOARD);

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
