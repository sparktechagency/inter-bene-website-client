import { NextRequest, NextResponse } from "next/server";

// Helper function to check for authentication
function isAuthenticated(request: NextRequest): boolean {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  return !!accessToken && !!refreshToken;
}

// Middleware function to protect routes
export function middleware(request: NextRequest) {
  if (!isAuthenticated(request)) {
    // If not authenticated, redirect to the login page
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect_url", request.nextUrl.pathname); // Save the original path
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated, allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login, register, forgot-password, etc. (auth pages)
     * - about-us, privacy-policy, terms-and-conditions (public pages)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|register|forgot-password|reset-password|verify-email|about-us|privacy-policy|terms-and-conditions|feed|search|journeys|photos|watch-videos).*)",
  ],
};
