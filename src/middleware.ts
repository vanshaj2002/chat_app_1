import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(route => 
    req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`)
  );

  // If user is not signed in and the current path is not public
  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // If user is signed in and trying to access auth pages, redirect to dashboard
  if (session && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  return res;
}

// List of public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/'];

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
