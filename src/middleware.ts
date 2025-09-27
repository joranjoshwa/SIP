import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";
import { isTokenExpired } from "./utils/token";

const publicRoutes = new Set([
    "/", "/login", "/signup", "/recover-password", "/forgot-password", "/verification"
]);

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/login";
const AUTHENTICATED_HOME = "/dashboard";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get("token")?.value;
    const isPublicRoute = publicRoutes.has(pathname);

    if (!authToken || (authToken && isTokenExpired(authToken))) {
        if (!isPublicRoute) {
            return NextResponse.redirect(new URL(REDIRECT_WHEN_NOT_AUTHENTICATED, request.url));
        }
        return NextResponse.next();
    }

    if (isPublicRoute) {
        return NextResponse.redirect(new URL(AUTHENTICATED_HOME, request.url));
    }

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
