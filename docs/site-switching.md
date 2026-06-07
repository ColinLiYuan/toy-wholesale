# 站点切换服务 (Site Switching Service)

## 概述

本项目支持多租户架构，目前包含两个站点：
- `toy` - LuxeAdult (Toy)
- `myth` - MythToy

## 核心文件

### 1. 站点服务 (`lib/site-service.ts`)

提供站点管理的核心功能：

```typescript
import { getAllSites, getCurrentSite, switchToSite, SiteConfig } from '@/lib/site-service';

// 获取所有可用站点
const sites = getAllSites();

// 获取当前站点配置
const currentSite = getCurrentSite();

// 切换到指定站点
const success = switchToSite('myth');
```

### 2. API 客户端集成 (`lib/api-client.ts`)

API 客户端自动在请求头中添加 `X-Site-Id` 标识：

```typescript
// 请求拦截器自动添加站点标识
config.headers['X-Site-Id'] = currentSiteId;
```

### 3. UI 组件

#### SiteSwitcher 组件 (`components/SiteSwitcher.tsx`)

快速站点切换下拉菜单：

```tsx
import SiteSwitcher from '@/components/SiteSwitcher';

// 在页面中使用
<SiteSwitcher />
```

#### SiteManager 组件 (`components/SiteManager.tsx`)

完整的站点管理界面：

```tsx
import SiteManager from '@/components/SiteManager';

// 在页面中使用
<SiteManager />
```

## 使用方法

### 1. 在管理后台使用

管理后台布局已集成站点切换功能，位于顶部导航栏。

### 2. 在自定义页面使用

```tsx
'use client';

import { useState, useEffect } from 'react';
import { getCurrentSite, switchToSite } from '@/lib/site-service';

export default function MyPage() {
  const [currentSite, setCurrentSite] = useState<string>('toy');

  useEffect(() => {
    // 获取当前站点
    const site = getCurrentSite();
    setCurrentSite(site.id);
  }, []);

  const handleSiteChange = (newSiteId: string) => {
    if (switchToSite(newSiteId)) {
      // 刷新页面以应用新站点配置
      window.location.reload();
    }
  };

  return (
    <div>
      <p>当前站点: {currentSite}</p>
      <button onClick={() => handleSiteChange('myth')}>
        切换到 Myth
      </button>
    </div>
  );
}
```

### 3. 编程方式切换

```typescript
import { switchToSite, isValidSite } from '@/lib/site-service';

// 检查站点是否有效
if (isValidSite('myth')) {
  // 切换站点
  switchToSite('myth');
  
  // 刷新页面或重新加载数据
  window.location.reload();
}
```

## 技术实现

### 站点持久化

站点选择通过 `localStorage` 持久化存储：

```typescript
// 保存站点选择
localStorage.setItem('admin_site_id', siteId);

// 恢复站点选择（在 api-client.ts 中自动执行）
const saved = localStorage.getItem('admin_site_id');
if (saved && SUPPORTED_SITES.includes(saved)) {
  currentSiteId = saved;
}
```

### API 请求隔离

每个 API 请求都会自动携带站点标识：

```typescript
// 请求头示例
{
  "X-Site-Id": "toy",
  "Content-Type": "application/json",
  "Authorization": "Bearer xxx"
}
```

后端根据 `X-Site-Id` 进行数据隔离。

## 扩展新站点

要添加新站点，需要：

1. 在 `lib/site-service.ts` 中添加站点配置：

```typescript
const SITE_CONFIGS: Record<SiteId, SiteConfig> = {
  // ... 现有站点
  newSite: {
    id: 'newSite',
    label: 'New Site Label',
    adminName: 'New Site Admin',
    domain: 'www.newsite.com'
  }
};
```

2. 在 `lib/api-client.ts` 中添加支持的站点：

```typescript
const SUPPORTED_SITES = ['toy', 'myth', 'newSite'];
```

3. 在 `app/admin/layout.tsx` 中添加站点菜单配置（如果需要不同的菜单结构）。

## 测试

访问 `/site-test` 页面可以测试站点切换功能：

```
http://localhost:3000/site-test
```

该页面展示了：
- 当前站点信息
- 所有可用站点列表
- 快速切换组件
- 完整的管理组件

## 注意事项

1. **站点切换会刷新页面**：切换站点后会调用 `window.location.reload()` 以确保所有数据重新加载。

2. **SSR 兼容性**：站点服务在客户端和服务器端都能正常工作，但站点选择仅在客户端持久化。

3. **默认站点**：如果未设置站点或设置的站点无效，系统会自动回退到 `toy` 站点。

4. **安全性**：站点验证在服务端和客户端都会进行，确保只能切换到已配置的站点。