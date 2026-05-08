import { NextRequest, NextResponse } from 'next/server';

// 登录 API，设置认证 cookie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // 创建响应并设置 cookie
    const response = NextResponse.json(
      { success: true },
      { status: 200 }
    );

    // 设置认证 cookie，有效期 30 天
    response.cookies.set('admin_access_token', token, {
      maxAge: 60 * 60 * 24 * 30, // 30天（秒）
      path: '/admin',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to set cookie' },
      { status: 500 }
    );
  }
}
