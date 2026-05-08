import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只保护 /admin 路径下的所有路由（排除登录页面）
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // 检查cookie中是否有有效的访问令牌
    const adminToken = request.cookies.get('admin_access_token');
    
    // 如果没有 cookie，重定向到登录页面
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

// 配置需要应用中间件的路径
export const config = {
  matcher: '/admin/:path*',
};
