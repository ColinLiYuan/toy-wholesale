/**
 * 格式化电话号码，添加区号显示
 * @param phone 原始电话号码
 * @returns 格式化后的电话号码
 */
export function formatPhoneWithCountryCode(phone?: string): string {
  if (!phone) return '-';
  
  // 如果已经包含 + 号，说明已经有国际区号
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // 如果包含括号或明显的区号格式，直接返回
  if (phone.includes('(') || phone.match(/^\d{2,4}-/)) {
    return phone;
  }
  
  // 如果是纯数字，根据长度判断可能的国家
  const digitsOnly = phone.replace(/\D/g, '');
  
  // 美国/加拿大号码 (10位)
  if (digitsOnly.length === 10) {
    return `+1 ${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  
  // 中国手机号 (11位)
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+86 ${digitsOnly.slice(0, 3)} ${digitsOnly.slice(3, 7)} ${digitsOnly.slice(7)}`;
  }
  
  // 中国固定电话 (带区号)
  if (digitsOnly.length >= 10 && digitsOnly.length <= 12) {
    // 假设前3-4位是区号
    const areaCodeLength = digitsOnly.startsWith('10') || digitsOnly.startsWith('2') ? 2 : 3;
    const areaCode = digitsOnly.slice(0, areaCodeLength);
    const localNumber = digitsOnly.slice(areaCodeLength);
    return `+86 ${areaCode}-${localNumber}`;
  }
  
  // 其他情况，尝试智能分组
  if (digitsOnly.length > 0) {
    // 默认格式：+国家码 号码
    return `+${digitsOnly}`;
  }
  
  return phone;
}

/**
 * 提取区号
 * @param phone 电话号码
 * @returns 区号（如果有）
 */
export function extractCountryCode(phone?: string): string | null {
  if (!phone) return null;
  
  // 匹配 +XX 格式
  const match = phone.match(/^\+(\d{1,3})/);
  if (match) {
    return '+' + match[1];
  }
  
  return null;
}
