const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// 读取Excel文件
function readExcelFile(filePath) {
  console.log(`\n正在读取文件: ${filePath}`);
  const workbook = XLSX.readFile(filePath);
  
  // 获取所有工作表名称
  console.log('工作表名称:', workbook.SheetNames);
  
  const allData = [];
  
  // 遍历所有工作表
  for (const sheetName of workbook.SheetNames) {
    console.log(`\n处理工作表: ${sheetName}`);
    const worksheet = workbook.Sheets[sheetName];
    
    // 转换为JSON（使用第一行作为标题）
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`总行数: ${jsonData.length}`);
    if (jsonData.length > 0) {
      console.log('前5行数据:');
      jsonData.slice(0, 5).forEach((row, index) => {
        console.log(`第${index + 1}行:`, JSON.stringify(row));
      });
    }
    
    allData.push({
      sheetName,
      data: jsonData
    });
  }
  
  return allData;
}

// 从复杂结构中提取产品信息（适配 category.xls）
function extractProductsFromData(data, sourceFile) {
  const products = [];
  
  // 跳过前几行标题，从实际数据开始
  let startRow = 2; // 从第3行开始（索引2）
  
  for (let i = startRow; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;
    
    // 检查是否是产品信息行（有编号的行）
    if (row[0] && (typeof row[0] === 'number' || typeof row[0] === 'string')) {
      // 这是一个新产品行
      const product = {
        编号: row[0],
        图片: '', // Excel中的图片是嵌入对象，无法直接提取
        名称: row[2] || '',
        材质: '',
        尺寸: '',
        重量: '',
        价格: '',
        分类: getSourceCategory(sourceFile),
        来源文件: sourceFile
      };
      
      // 查找后续行的材质、尺寸等信息
      for (let j = i + 1; j < Math.min(i + 8, data.length); j++) {
        const nextRow = data[j];
        if (!nextRow || !nextRow[2]) break;
        
        const label = String(nextRow[2]).trim();
        if (label.includes('材质')) {
          product.材质 = nextRow[3] || '';
        } else if (label.includes('尺寸') && !label.includes('深度')) {
          product.尺寸 = nextRow[3] || '';
        } else if (label.includes('重量') || label.includes('净重')) {
          product.重量 = nextRow[3] || '';
        } else if (label.includes('价格')) {
          product.价格 = nextRow[3] || '';
        }
        
        // 如果遇到下一个产品，停止
        if (nextRow[0] && (typeof nextRow[0] === 'number' || typeof nextRow[0] === 'string')) {
          break;
        }
      }
      
      products.push(product);
    }
  }
  
  return products;
}

// 根据来源文件确定产品分类
function getSourceCategory(sourceFile) {
  if (sourceFile.includes('沃色男用')) {
    return 'Male Masturbator';
  } else if (sourceFile.includes('液态硅胶')) {
    if (sourceFile.includes('电动')) {
      return 'Electric Silicone Dildo';
    } else if (sourceFile.includes('手动')) {
      return 'Manual Silicone Dildo';
    } else if (sourceFile.includes('人妖')) {
      return 'Transgender Products';
    }
    return 'Silicone Dildo';
  }
  return 'Other';
}

// 主函数
async function main() {
  const publicDir = path.join(__dirname, 'public');
  
  // Excel文件 - 使用 category.xls
  const files = [
    'category.xls'
  ];
  
  const allProducts = [];
  
  for (const file of files) {
    const filePath = path.join(publicDir, file);
    if (fs.existsSync(filePath)) {
      const sheetsData = readExcelFile(filePath);
      
      // 处理每个工作表
      for (const { sheetName, data } of sheetsData) {
        const products = extractProductsFromData(data, `${file} (${sheetName})`);
        console.log(`\n从 ${file} [${sheetName}] 提取了 ${products.length} 个产品`);
        allProducts.push(...products);
      }
    } else {
      console.log(`\n⚠️  文件不存在: ${filePath}`);
      console.log('public目录下的文件列表:');
      const files = fs.readdirSync(publicDir);
      files.filter(f => f.endsWith('.xls')).forEach(f => {
        console.log(`  - ${f}`);
      });
    }
  }
  
  console.log(`\n总共提取了 ${allProducts.length} 个产品`);
  
  // 显示前几个产品作为示例
  if (allProducts.length > 0) {
    console.log('\n前3个产品示例:');
    allProducts.slice(0, 3).forEach((p, idx) => {
      console.log(`${idx + 1}. 编号:${p.编号}, 名称:${p.名称}, 尺寸:${p.尺寸}, 重量:${p.重量}`);
    });
  }
  
  // 创建新的工作簿
  const newWorkbook = XLSX.utils.book_new();
  
  // 准备数据（包含标题行）
  const exportData = [
    ['编号', '名称', '分类', '图片', '尺寸', '重量', '材质', '价格'],  // 标题行
    ...allProducts.map(p => [p.编号, p.名称, p.分类, p.图片, p.尺寸, p.重量, p.材质, p.价格])
  ];
  
  // 创建工作表
  const newWorksheet = XLSX.utils.aoa_to_sheet(exportData);
  
  // 将工作表添加到工作簿
  XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, '产品目录');
  
  // 保存文件
  const outputPath = path.join(publicDir, '产品目录.xlsx');
  XLSX.writeFile(newWorkbook, outputPath);
  
  console.log(`\n✅ 成功生成产品目录: ${outputPath}`);
  console.log(`包含 ${allProducts.length} 个产品`);
}

main().catch(err => {
  console.error('错误:', err);
});
