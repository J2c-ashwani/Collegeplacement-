import NextAuth from 'next-auth';
import { authConfig } from './lib/auth.config';
import { NextResponse } from 'next/dist/server/web/spec-extension/response';

const { auth } = NextAuth(authConfig);

const publicRoutes = [
  '/',
  '/for-colleges',
  '/for-students',
  '/for-employers',
  '/placement-assurance',
  '/contact',
  '/faqs',
  '/terms',
  '/privacy',
  '/refund-policy',
  '/pricing'
];

const authRoutes = ['/login', '/register', '/forgot-password', '/verify-email'];

function getRoleDashboard(role?: string) {
  switch (role) {
    case 'STUDENT':
      return '/student/dashboard';
    case 'INSTITUTION_ADMIN':
      return '/institution/overview';
    case 'EMPLOYER':
      return '/employer/overview';
    case 'SUPER_ADMIN':
    case 'OPERATIONS':
      return '/admin/overview';
    default:
      return '/';
  }
}

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;
  const isPublicApiRoute =
    nextUrl.pathname.startsWith('/api/auth') ||
    nextUrl.pathname.startsWith('/api/webhooks') ||
    nextUrl.pathname.startsWith('/api/students') ||
    nextUrl.pathname.startsWith('/api/register') ||
    nextUrl.pathname.startsWith('/api/institutions/plans') ||
    nextUrl.pathname.startsWith('/api/health');

  if (isPublicApiRoute) {
    return;
  }

  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(getRoleDashboard(role), nextUrl));
    }
    return;
  }

  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith('/register/') ||
    nextUrl.pathname.startsWith('/verify/');
  if (isPublicRoute) {
    return;
  }


  const isProtectedPrefix =
    nextUrl.pathname.startsWith('/admin') ||
    nextUrl.pathname.startsWith('/institution') ||
    nextUrl.pathname.startsWith('/employer') ||
    nextUrl.pathname.startsWith('/student') ||
    nextUrl.pathname.startsWith('/counsellor');

  if (!isLoggedIn) {
    if (nextUrl.pathname.startsWith('/api')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (isProtectedPrefix) {
      const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
      return NextResponse.redirect(new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl));
    }
    return;
  }

  if (nextUrl.pathname.startsWith('/admin') && role !== 'SUPER_ADMIN' && role !== 'OPERATIONS') {
    return NextResponse.redirect(new URL(getRoleDashboard(role), nextUrl));
  }
  
  if (nextUrl.pathname.startsWith('/institution') && role !== 'INSTITUTION_ADMIN') {
    return NextResponse.redirect(new URL(getRoleDashboard(role), nextUrl));
  }

  if (nextUrl.pathname.startsWith('/student') && role !== 'STUDENT') {
    return NextResponse.redirect(new URL(getRoleDashboard(role), nextUrl));
  }

  if (nextUrl.pathname.startsWith('/employer') && role !== 'EMPLOYER') {
    return NextResponse.redirect(new URL(getRoleDashboard(role), nextUrl));
  }

  if (nextUrl.pathname.startsWith('/counsellor') && role !== 'COUNSELLOR') {
    return NextResponse.redirect(new URL(getRoleDashboard(role), nextUrl));
  }

  return;
});

export const config = {
  matcher: ['/((?!.+\.[\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
