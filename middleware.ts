import { auth } from "~/server/auth";

export default auth((req) => {
    const { pathname } = req.nextUrl;

    // Allow access to auth routes and home page
    if (pathname === "/" || pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/register") {
        return;
    }

    // Redirect to login if not authenticated
    if (!req.auth) {
        const url = new URL("/login", req.nextUrl.origin);
        return Response.redirect(url);
    }
});

export const config = {
    matcher: ["/((?!_next|favicon|public).*)"],
};