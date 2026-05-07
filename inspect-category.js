const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const filePath = path.join(publicDir, 'category.xls');

console.log('读取文件:', filePath);
const workbook = XLSX.readFile(filePath);

console.log('工作表名称:', workbook.SheetNames);

for (const sheetName of workbook.SheetNames) {
  console.log(`\n========== 工作表: ${sheetName} ==========`);
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  console.log('总行数:', jsonData.length);
  console.log('前20行数据:');
  jsonData.slice(0, 20).forEach((row, index) => {
    console.log(`第${index + 1}行:`, JSON.stringify(row));
  });
}
