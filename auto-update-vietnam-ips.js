const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const inputFilePath = path.join(__dirname, 'IP2LOCATION-LITE-DB1.IPV6.CSV');
const outputFilePath = path.join(__dirname, 'vietnam_ips.json');

console.log(`[${new Date().toISOString()}] Đang tải dữ liệu IP từ IP2Location...`);

const vietnamIPs = [];

fs.createReadStream(inputFilePath)
  .pipe(csv({ headers: false })) // Không dùng tên cột, vì file không có header
  .on('data', (row) => {
    // row là mảng: [0] start_ip, [1] end_ip, [2] provider, [3] country_code, [4] country_name
    if (row[3] === 'VN') {
      vietnamIPs.push(`${row[0]} - ${row[1]}`);
    }
  })
  .on('end', () => {
    fs.writeFileSync(outputFilePath, JSON.stringify(vietnamIPs, null, 2), 'utf8');
    console.log(`✅ Đã lưu ${vietnamIPs.length} IP Việt Nam vào vietnam_ips.json`);
  })
  .on('error', (err) => {
    console.error('❌ Lỗi đọc file:', err.message);
  });
