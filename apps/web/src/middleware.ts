import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = { matcher: '/((?!api|_next|static|public|favicon).*)' };

export const middleware = async (request: NextRequest) => {
  const isMaintenance = await get('isMaintenance');

  if (isMaintenance) {
    request.nextUrl.pathname = '/maintenance';
    return NextResponse.rewrite(request.nextUrl);
  }
};
