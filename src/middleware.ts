import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";
import { isTokenExpired } from "./utils/token";

const publicRoutes = [
    { path: "/", whenAuthenticated: "redirect" },
    { path: "/login", whenAuthenticated: "redirect" },
    { path: "/signup", whenAuthenticated: "redirect" },
    { path: "/recover-password", whenAuthenticated: "redirect" },
    { path: "/forgot-password", whenAuthenticated: "redirect" },
    { path: "/verification", whenAuthenticated: "redirect" },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = "/login";
const AUTHENTICATED_HOME = "/dashboard";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const publicRoute = publicRoutes.find((route) => route.path === path);
    const authToken = request.cookies.get("token")?.value;

    if (!authToken && publicRoute) {
        return NextResponse.next();
    }

    if (!authToken && !publicRoute) {
        if (path !== REDIRECT_WHEN_NOT_AUTHENTICATED) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
            return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.next();
    }

    if (authToken && isTokenExpired(authToken)) {
        if (path !== REDIRECT_WHEN_NOT_AUTHENTICATED) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
            return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.next();
    }

    if (authToken && publicRoute?.whenAuthenticated === "redirect") {
        if (path !== AUTHENTICATED_HOME) {
            const redirectUrl = request.nextUrl.clone();
            redirectUrl.pathname = AUTHENTICATED_HOME;
            return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config: MiddlewareConfig = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
