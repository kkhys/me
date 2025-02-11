import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { get } from "@vercel/edge-config";
import { ipAddress } from "@vercel/functions";
import { type NextRequest, NextResponse } from "next/server";

const defaultMiddleware = async (request: NextRequest) => {
  const isMaintenance = await get<boolean>("isMaintenance");

  if (isMaintenance) {
    request.nextUrl.pathname = "/maintenance";
    return NextResponse.rewrite(request.nextUrl);
  }

  if (request.nextUrl.pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const blockIps = await get<string[]>("blockIps");
  const accessIp = ipAddress(request);

  if (accessIp && blockIps?.includes(accessIp)) {
    request.nextUrl.pathname = "/forbidden";
    return NextResponse.rewrite(request.nextUrl, { status: 403 });
  }

  if (request.nextUrl.pathname === "/forbidden") {
    return NextResponse.redirect(new URL("/", request.url));
  }
};

const isPublicRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);
const isProtectedRoute = createRouteMatcher(["/secret(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  // if (!isPublicRoute(request)) {
  //   await auth.protect();
  // }

  if (isProtectedRoute(request)) {
    await auth.protect();
  }

  return defaultMiddleware(request);
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
