import { get } from "@vercel/edge-config";
import { ipAddress } from "@vercel/functions";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export const config = { matcher: "/((?!api|_next|static|public|favicon).*)" };

export const middleware = async (request: NextRequest) => {
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
