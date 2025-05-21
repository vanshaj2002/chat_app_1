import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // If user is not signed in and the current path is not /login or /signup
  if (!session && !req.nextUrl.pathname.startsWith('/login') && !req.nextUrl.pathname.startsWith('/signup')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // If user is signed in and the current path is /login or /signup, redirect to /dashboard
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images/ (image files)
     */
    '/((?!_next/static|_next/image|favicon.ico|images/).*)',
  ],
};
