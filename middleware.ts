// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const country = request.headers.get('x-vercel-ip-country') || '';

  if (country.toUpperCase() === 'VN') {
    return new NextResponse(
      `
        <div style="
          max-width: 600px;
          margin: 100px auto;
          padding: 30px;
          border: 3px solid red;
          border-radius: 10px;
          color: red;
          font-family: sans-serif;
          text-align: center;
          background-color: #fff5f5;
        ">
          <img src="https://flagcdn.com/w320/vn.png" alt="Vietnam Flag" style="width: 100px; margin-bottom: 20px;" />
          <h1>Website này không khả dụng tại Việt Nam.</h1>
        </div>
      `,
      {
        status: 403,
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }

  return NextResponse.next();
}
