import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";
import { isTokenExpired, extractRoleFromToken } from "./utils/token";
import { Role } from "./enums/role";

const PUBLIC_ROUTES = [
    "/",
    "/login",
    "/signup",
    "/recover-password",
    "/forgot-password",
    "/verification",
];

const LOGIN = "/login";
const DASHBOARD = "/dashboard";

const normalize = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);
const isPublic = (p: string) => PUBLIC_ROUTES.includes(normalize(p));
const matchesAny = (p: string, rules: RegExp[]) => rules.some((r) => r.test(p));

const redirect = (request: NextRequest, path: string, query = "") => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = query;
    return NextResponse.redirect(url);
};

const AUTH_AREA: RegExp[] = [
    /^\/dashboard(\/|$)/,
];

const ROOT_ONLY: RegExp[] = [
    /^\/dashboard\/admins(\/|$)/,
    /^\/dashboard\/items\/search\/delete(\/|$)/,
];

const ADMIN_AREA: RegExp[] = [
    /^\/dashboard\/requests(\/|$)/,
    /^\/dashboard\/schedule\/edit(\/|$)/,
    /^\/dashboard\/items\/new(\/|$)/,
    /^\/dashboard\/items\/edit(\/|$)/,
];

const isRoot = (role: Role) => role === Role.ROOT;
const isAdmin = (role: Role) => role === Role.ADMIN;

export function middleware(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const token = request.cookies.get("token")?.value;

    const publicRoute = isPublic(pathname);
    const isAuthArea = matchesAny(pathname, AUTH_AREA);

    if (publicRoute) {
        if (token && !isTokenExpired(token)) return redirect(request, DASHBOARD);
        return NextResponse.next();
    }

    if (isAuthArea) {
        if (!token || isTokenExpired(token)) {
            return redirect(request, LOGIN, `?returnTo=${encodeURIComponent(pathname + search)}`);
        }

        let role: Role;
        try {
            role = extractRoleFromToken(token) as Role;
        } catch {
            return redirect(request, LOGIN, `?returnTo=${encodeURIComponent(pathname + search)}`);
        }

        if (matchesAny(pathname, ROOT_ONLY) && !isRoot(role)) {
            return redirect(request, DASHBOARD);
        }

        if (matchesAny(pathname, ADMIN_AREA) && !isAdmin(role)) {
            return redirect(request, DASHBOARD);
        }

        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
