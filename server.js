const express = require('express');
const ipRangeCheck = require('ip-range-check');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Đọc danh sách IP Việt Nam đã lưu
let vietnamCIDRs = [];
try {
  vietnamCIDRs = JSON.parse(fs.readFileSync(path.join(__dirname, 'vietnam_ips.json'), 'utf8'));
  console.log(`✅ Tải ${vietnamCIDRs.length} IP Việt Nam từ file vietnam_ips.json`);
} catch (err) {
  console.error('❌ Không tìm thấy hoặc lỗi khi đọc vietnam_ips.json:', err.message);
}

// Middleware chặn IP
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (ipRangeCheck(ip, vietnamCIDRs)) {
    return res.status(403).send('Access denied for Vietnam IPs.');
  }

  next();
});

app.get('/', (req, res) => {
  res.send('Welcome! You are not from Vietnam.');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
