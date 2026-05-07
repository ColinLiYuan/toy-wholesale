const XLSX = require('xlsx');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const filePath = path.join(publicDir, 'category.xls');

console.log('读取文件:', filePath);
const workbook = XLSX.readFile(filePath);

// 中英文翻译映射
const translations = {
  // 工作表名称
  '电动硅胶阳具': 'Electric Silicone Dildo',
  '手动硅胶阳具': 'Manual Silicone Dildo',
  '人妖产品': 'Transgender Products',
  
  // 标题行常见词汇
  '编号': 'Number',
  'Product number': 'Number',
  '产品图片': 'Product Image',
  'product images': 'Product Image',
  '产品名称': 'Product Name',
  'product name': 'Product Name',
  '功能介绍': 'Function',
  'function': 'Function',
  '伸缩模式（2选1）': 'Mode (Choose 1 of 2)',
  'model(choose 1 out of 2)': 'Mode (Choose 1 of 2)',
  '尺寸信息': 'Size Info',
  'size': 'Size Info',
  '价格CNY50个起批单价': 'Price CNY (MOQ 50)',
  'price': 'Price',
  '价格CNY1000个起批单价': 'Price CNY (MOQ 1000)',
  '价格CNY500个起批单价': 'Price CNY (MOQ 500)',
  '价格CNY(1000个起批）': 'Price CNY (MOQ 1000)',
  
  // 产品信息标签
  '产品信息': 'Product Info',
  'OPI': 'Product Info',
  '产品材质': 'Material',
  '产品尺寸': 'Size',
  '深度尺寸': 'Depth Size',
  '产品净重': 'Net Weight',
  '阴茎内置龙骨': 'Built-in Bone',
  '价格': 'Price',
  
  // 常见描述词
  '硅胶': 'Silicone',
  '磁吸充电': 'Magnetic Charging',
  '无线遥控': 'Wireless Remote',
  '伸缩摇摆': 'Telescopic Swing',
  '加温': 'Heating',
  '多频震动': 'Multi-frequency Vibration',
  '化妆烤漆工艺': 'Cosmetic Paint Process',
  '三种伸缩9震动': '3 Telescopic 9 Vibrations',
  '十种伸缩10震动': '10 Telescopic 10 Vibrations',
  '内置跳单震动': 'Built-in Single Vibration',
  '新品': 'New Product',
  '纹理更真': 'More Realistic Texture',
  '开模': 'Custom Mold',
  '硅胶新品工艺': 'New Silicone Craft',
  '内置龙骨': 'Built-in Bone',
  
  // 人妖产品标题
  '人妖产品目录（100个起批）': 'Transgender Products Catalog (MOQ 100)',
  
  // 其他
  '2025高端全自动液态硅胶阳具产品明细及报价': '2025 Premium Automatic Liquid Silicone Dildo Product Details & Pricing',
  '2025高端双层液态硅胶阳具产品明细及报价': '2025 Premium Double-layer Liquid Silicone Dildo Product Details & Pricing'
};

function translateText(text) {
  if (!text || typeof text !== 'string') return text;
  
  let translated = text;
  
  // 逐个替换（使用字符串替换，不用正则）
  for (const [chinese, english] of Object.entries(translations)) {
    while (translated.includes(chinese)) {
      translated = translated.replace(chinese, english);
    }
  }
  
  return translated;
}

// 遍历所有工作表
for (const sheetName of workbook.SheetNames) {
  console.log(`\n处理工作表: ${sheetName}`);
  const worksheet = workbook.Sheets[sheetName];
  
  // 转换为数组格式
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  // 翻译每个单元格
  let translatedCount = 0;
  for (let i = 0; i < data.length; i++) {
    for (let j = 0; j < data[i].length; j++) {
      const cell = data[i][j];
      if (cell && typeof cell === 'string') {
        const translated = translateText(cell);
        if (translated !== cell) {
          data[i][j] = translated;
          translatedCount++;
        }
      }
    }
  }
  
  console.log(`  翻译了 ${translatedCount} 个单元格`);
  
  // 将翻译后的数据写回工作表
  const newWorksheet = XLSX.utils.aoa_to_sheet(data);
  workbook.Sheets[sheetName] = newWorksheet;
}

// 保存文件（覆盖原文件）
XLSX.writeFile(workbook, filePath);
console.log(`\n✅ 完成！已翻译并覆盖文件: ${filePath}`);
