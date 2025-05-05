import { NextRequest, NextResponse } from 'next/server';
import CIDR from 'ip-cidr';
import fs from 'fs';
import path from 'path';

// Load danh sách CIDR nhà mạng VN
const ispsPath = path.resolve('./vietnam_isps.json');
const vietnamISPs = JSON.parse(fs.readFileSync(ispsPath, 'utf8'));

// Hàm kiểm tra IP có nằm trong CIDR nào không
function isVietnamISP(ip: string): boolean {
  return vietnamISPs.some((isp: { cidr: string }) => {
    const cidr = new CIDR(isp.cidr);
    return cidr.contains(ip);
  });
}

export function middleware(request: NextRequest) {
  const ip = request.headers.get('x-real-ip') || request.ip || '';

  if (ip && isVietnamISP(ip)) {
    return new NextResponse(
      `
        <div style="max-width: 600px; margin: 100px auto; padding: 30px; border: 3px solid red; border-radius: 10px; color: red; font-family: sans-serif; text-align: center; background-color: #fff5f5;">
          <img src="https://flagcdn.com/w320/vn.png" alt="Vietnam Flag" style="width: 100px; margin-bottom: 20px;" />
          <h1>Website này không khả dụng cho nhà mạng Việt Nam.</h1>
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
