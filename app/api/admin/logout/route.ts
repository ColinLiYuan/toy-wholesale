import { NextRequest, NextResponse } from 'next/server';

// 登出 API，清除认证 cookie
export async function POST(request: NextRequest) {
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  );

  // 清除认证 cookie
  response.cookies.set('admin_access_token', '', {
    maxAge: 0,
    path: '/admin',
  });

  return response;
}
