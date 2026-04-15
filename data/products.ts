import { getImageUrl, IMAGE_PATHS } from '@/lib/r2-config';

export interface Product {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  category: string;
  material: string;
  thickness: string;
  temperature: string;
  securityLevel: string;
  securityLevelEn: string;
  industries: string[];
  ctaText?: string;
}

// 产品数据库
export const products: Product[] = [
  {
    id: 'holographic-foil',
    name: '高安全全息烫印箔',
    nameEn: 'High-Security Holographic Foil',
    description: '采用先进激光全息技术，具有彩虹效果和3D视觉，适用于高速工业应用',
    descriptionEn: 'Advanced laser holographic technology with rainbow effects and 3D visuals, suitable for high-speed industrial applications',
    image: getImageUrl(`${IMAGE_PATHS.products}/holographic-foil-v1.jpg`),
    category: 'Holographic Solutions',
    material: 'PET/PVC',
    thickness: '12-16 micron',
    temperature: '-40°C ~ 120°C',
    securityLevel: '一级 + 二级防伪特征',
    securityLevelEn: 'Level 1 + Level 2 Security Features',
    industries: ['Pharmaceuticals', 'Luxury Goods', 'Documents'],
  },
  {
    id: 'wallpaper-film',
    name: '壁纸安全膜',
    nameEn: 'Wallpaper Security Film',
    description: '全幅面安全覆膜，具有多光谱防伪特征，适用于高端证件保护',
    descriptionEn: 'Full-area security overlay with multi-spectral anti-counterfeiting features for premium document protection',
    image: getImageUrl(`${IMAGE_PATHS.products}/wallpaper-film-v1.jpg`),
    category: 'Document Security',
    material: 'BOPP/PET',
    thickness: '25 micron',
    temperature: '-30°C ~ 100°C',
    securityLevel: '二级 + 三级司法鉴定',
    securityLevelEn: 'Level 2 + Level 3 Forensic',
    industries: ['Government Documents', 'ID Cards'],
  },
  {
    id: 'transparent-overlay',
    name: '透明HRI覆膜',
    nameEn: 'Transparent HRI Overlay',
    description: '高分辨率成像覆膜，支持激光雕刻和个性化数据处理',
    descriptionEn: 'High-resolution imaging overlay supporting laser engraving and personalized data processing',
    image: getImageUrl(`${IMAGE_PATHS.products}/transparent-overlay-v1.jpg`),
    category: 'HRI Technology',
    material: 'Clear PET',
    thickness: '20 micron',
    temperature: '-40°C ~ 150°C',
    securityLevel: '三级司法鉴定级',
    securityLevelEn: 'Level 3 Forensic Grade',
    industries: ['Passports', 'ID Cards', 'Driver Licenses'],
  },
  {
    id: 'tamper-evident-void',
    name: 'VOID防篡改标签',
    nameEn: 'VOID Tamper Evident Label',
    description: '移除时显示VOID图案，不可逆破坏结构，防止标签重复使用',
    descriptionEn: 'Displays VOID pattern upon removal, irreversible destructive structure prevents label reuse',
    image: getImageUrl(`${IMAGE_PATHS.products}/void-label-v1.jpg`),
    category: 'Tamper Evident',
    material: 'PET/PP',
    thickness: '25-50 micron',
    temperature: '-20°C ~ 80°C',
    securityLevel: '一级肉眼可见',
    securityLevelEn: 'Level 1 Visible',
    industries: ['Electronics', 'Pharmaceuticals', 'Cosmetics'],
  },
  {
    id: 'security-qr',
    name: '加密二维码标签',
    nameEn: 'Encrypted QR Security Label',
    description: '集成加密二维码与追溯系统，支持移动端即时验证',
    descriptionEn: 'Integrated encrypted QR codes with traceability system, supports instant mobile verification',
    image: getImageUrl(`${IMAGE_PATHS.products}/qr-label-v1.jpg`),
    category: 'Digital Tracking',
    material: 'Coated Paper/PET',
    thickness: '60-80 micron',
    temperature: '-10°C ~ 60°C',
    securityLevel: '数字加密验证',
    securityLevelEn: 'Digital Encrypted Verification',
    industries: ['Food & Beverage', 'Cosmetics', 'Retail'],
  },
  {
    id: 'rainbow-hologram',
    name: '彩虹全息标签',
    nameEn: 'Rainbow Hologram Label',
    description: '绚丽彩虹光学效果，视觉冲击力强，消费者易于识别',
    descriptionEn: 'Brilliant rainbow optical effects with strong visual impact, easy for consumers to identify',
    image: getImageUrl(`${IMAGE_PATHS.products}/rainbow-hologram-v1.jpg`),
    category: 'Holographic Solutions',
    material: 'PET/VMPET',
    thickness: '16-25 micron',
    temperature: '-30°C ~ 90°C',
    securityLevel: '一级彩虹效应',
    securityLevelEn: 'Level 1 Rainbow Effect',
    industries: ['Luxury Goods', 'Liquor', 'Tobacco'],
  },
];

// 按分类获取产品
export const getProductsByCategory = (category: string) => {
  return products.filter(p => p.category === category);
};

// 按行业获取产品
export const getProductsByIndustry = (industry: string) => {
  return products.filter(p => p.industries.includes(industry));
};

// 获取所有产品分类
export const getAllCategories = () => {
  return [...new Set(products.map(p => p.category))];
};
