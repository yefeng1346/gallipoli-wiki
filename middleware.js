import { NextResponse } from 'next/server';

const CANONICAL_HOST = 'www.gallipoligame.wiki';
const REDIRECT_HOSTS = new Set([
  'gallipoligame.wiki',
]);

export function middleware(request) {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const requestHost = forwardedHost || request.headers.get('host') || request.nextUrl.hostname;
  const hostname = requestHost.split(',')[0].trim().split(':')[0].toLowerCase();

  if (REDIRECT_HOSTS.has(hostname)) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.hostname = CANONICAL_HOST;
    return NextResponse.redirect(url, 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
