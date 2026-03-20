import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Admin routes protection
    if (path.startsWith('/admin') || path.startsWith('/api/admin')) {
      if (!token?.isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Seller routes protection
    if (path.startsWith('/seller') && path.includes('/edit')) {
      if (!token?.isSeller && !token?.isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        // Public API routes that don't need auth
        const publicApiRoutes = [
          '/api/auth',
          '/api/products',
          '/api/users/signin',
          '/api/users/register',
          '/api/users/password-recovery',
          '/api/users/password-replacement',
          '/api/users/verification',
          '/api/users/newsletter',
          '/api/users/sellers',
          '/api/users/top-sellers',
          '/api/config',
        ];

        // Check if it's a public API route
        if (publicApiRoutes.some((route) => path.startsWith(route))) {
          return true;
        }

        // Protected routes require token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    // Protected pages
    '/profile/:path*',
    '/orderhistory/:path*',
    '/order/:path*',
    '/shipping/:path*',
    '/payment/:path*',
    '/placeorder/:path*',
    '/admin/:path*',
    '/productlist/:path*',
    '/product/:id/edit',
    // Protected API routes
    '/api/orders/:path*',
    '/api/users/profile/:path*',
    '/api/uploads/:path*',
  ],
};
