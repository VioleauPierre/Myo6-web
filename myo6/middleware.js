import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request) {
    const { pathname } = request.nextUrl;

    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/api") ||
        PUBLIC_FILE.test(pathname) ||
        pathname.startsWith("/dataExports")
    ) {
        return NextResponse.next();
    }

    const url = request.nextUrl.clone();
    url.pathname = "/dataExports";
    return NextResponse.redirect(url);
}
