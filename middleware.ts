import { NextResponse, type NextRequest } from 'next/server';

/**
 * The admin panel never lives at /admin publicly.
 * Requests are rewritten from the secret ADMIN_PATH to the internal /admin route,
 * and a direct /admin visit always returns a 404.
 */
function adminPath(): string {
  const raw = (process.env.ADMIN_PATH || '/studio-7f3k9').trim();
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`;
  const clean = withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : withSlash;
  if (clean === '/' || clean === '/admin' || clean.startsWith('/admin/')) {
    return '/studio-7f3k9';
  }
  return clean;
}

/**
 * In production the panel is only exposed when ADMIN_PASSWORD is configured.
 * (Kept inline on purpose: middleware runs on the edge runtime and cannot
 * import lib/auth.ts which depends on node:crypto.)
 */
function isAdminConfigured(): boolean {
  const isProduction =
    process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL);
  if (!isProduction) return true;
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = adminPath();

  if (pathname === secret) {
    if (!isAdminConfigured()) {
      return new NextResponse('Not found', {
        status: 404,
        headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' }
      });
    }
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    const response = NextResponse.rewrite(url);
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    response.headers.set('Cache-Control', 'no-store, max-age=0');
    return response;
  }

  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return new NextResponse('Not found', {
      status: 404,
      headers: { 'content-type': 'text/plain; charset=utf-8', 'x-robots-tag': 'noindex' }
    });
  }

  // Sorgu parametrelerini (?v=12 vb.) ana sayfadan temizle: /?x -> / (308, kalıcı)
  if (pathname === '/' && request.nextUrl.search) {
    const clean = request.nextUrl.clone();
    clean.search = '';
    return NextResponse.redirect(clean, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
