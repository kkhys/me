import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export { auth } from '@kkhys/auth';

export const config = { matcher: '/((?!api|_next|static|public|favicon).*)' };

export const middleware = async (request: NextRequest) => {
  const isMaintenance = await get<boolean>('isMaintenance');

  if (isMaintenance) {
    request.nextUrl.pathname = '/maintenance';
    return NextResponse.rewrite(request.nextUrl);
  }

  const blockIps = await get<string[]>('blockIps');
  const accessIp = request.ip;

  if (accessIp && blockIps?.includes(accessIp)) {
    request.nextUrl.pathname = '/forbidden';
    return NextResponse.rewrite(request.nextUrl, { status: 403 });
  }
};
