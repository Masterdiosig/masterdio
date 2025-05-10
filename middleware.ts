import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CIDRMatcher } from 'cidr-matcher';
import { vietnamCIDRs } from './vietnamCIDRs';

const matcher = new CIDRMatcher(vietnamCIDRs);

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '';

  if (matcher.contains(ip)) {
    return new NextResponse(
      `
        <div style="text-align:center;padding:50px;color:red">
          <h1>Website này không khả dụng tại Việt Nam.</h1>
        </div>
      `,
      {
        status: 403,
        headers: { 'Content-Type': 'text/html' },
      }
    );
  }

  return NextResponse.next();
}

// ⚠️ QUAN TRỌNG: chặn mọi route, kể cả API và assets
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
