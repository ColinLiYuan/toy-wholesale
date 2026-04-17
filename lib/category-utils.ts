/**
 * 解析分类数据（支持 JSON 数组和斜杠分隔格式）
 * @param categoriesData - 分类数据，可能是 JSON 数组字符串、数组或斜杠分隔的字符串
 * @returns 分类 slug 数组
 */
export const parseCategories = (categoriesData: string | string[] | undefined): string[] => {
  try {
    if (!categoriesData) {
      return [];
    }
    
    if (Array.isArray(categoriesData)) {
      return categoriesData;
    }
    
    if (typeof categoriesData === 'string') {
      // 尝试解析 JSON 数组
      try {
        const jsonParsed = JSON.parse(categoriesData);
        if (Array.isArray(jsonParsed)) {
          return jsonParsed;
        }
      } catch {
        // 如果不是 JSON，尝试斜杠分隔格式 "category/subcategory"
        const parts = categoriesData.split('/').filter(Boolean);
        if (parts.length > 0) {
          return parts;
        }
      }
    }
    
    return [];
  } catch (error) {
    console.error('Failed to parse categories:', error);
    return [];
  }
};
