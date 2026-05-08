/**
 * Session ID 管理工具
 * 用于标识游客用户，在登录时自动合并购物车
 */

const SESSION_ID_KEY = 'inquiry_session_id';

/**
 * 获取或生成 Session ID
 * - 如果已存在则返回现有的
 * - 如果不存在则生成新的并存储
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    // SSR 环境，返回空字符串
    return '';
  }

  let sessionId = localStorage.getItem(SESSION_ID_KEY);
  
  if (!sessionId) {
    // 生成唯一 sessionId: session_{timestamp}_{random}
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * 清除 Session ID（登录成功后调用）
 */
export function clearSessionId(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_ID_KEY);
}

/**
 * 手动设置 Session ID（用于测试或特殊场景）
 */
export function setSessionId(sessionId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_ID_KEY, sessionId);
}
