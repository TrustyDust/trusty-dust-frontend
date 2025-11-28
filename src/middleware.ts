import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ROUTES } from './constant/route';

export async function middleware(request: NextRequest) {
    const {
        pathname,
    } = request.nextUrl;

    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt");

    const {
        signIn, home
    } = ROUTES

    const publicPages = [signIn as string];
    const isPublicPage = publicPages.includes(pathname);

    const redirect = (url: string) => {
        if (pathname === url) {
            return NextResponse.next();
        }
        return NextResponse.redirect(new URL(url, request.url));
    };

    if (pathname === "/") {
        if (!jwt) return redirect(signIn);
        return NextResponse.next();
    }

    if (jwt && isPublicPage) return redirect(home);
    if (!jwt && !isPublicPage) return redirect(signIn);

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.gif|.*\\.svg|.*\\.ico|.*\\.webp).*)",
    ],
};
