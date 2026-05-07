import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 只保护 /admin 路径下的所有路由（排除登录页面）
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    // 检查cookie中是否有有效的访问令牌
    const adminToken = request.cookies.get('admin_access_token');
    
    // 如果cookie中没有有效令牌，检查URL参数
    if (!adminToken || adminToken.value !== 'admin2024') {
      const accessKey = request.nextUrl.searchParams.get('key');
      
      // 如果URL参数也不匹配，重定向到首页
      if (accessKey !== 'admin2024') {
        return NextResponse.redirect(new URL('/', request.url));
      }
      
      // 如果URL参数正确，设置30天有效的cookie
      const response = NextResponse.next();
      response.cookies.set('admin_access_token', 'admin2024', {
        maxAge: 60 * 60 * 24 * 30, // 30天（秒）
        path: '/admin',
        httpOnly: true,
        sameSite: 'strict',
      });
      return response;
    }
  }

  return NextResponse.next();
}

// 配置需要应用中间件的路径
export const config = {
  matcher: '/admin/:path*',
};
