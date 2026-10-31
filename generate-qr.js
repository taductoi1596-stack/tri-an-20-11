const fs = require('fs');
const path = require('path');
const QRCode = require('./qrcode.js');

function generateQRCard(targetUrl) {
    // Generate QR matrix
    const qr = new QRCode(0, 0); // 0 = auto-detect version, 0 = EC level M
    qr.addData(targetUrl);
    qr.make();
    
    const moduleCount = qr.getModuleCount();
    const qrRenderSize = 340; // QR width/height in px inside card
    const cellSize = qrRenderSize / moduleCount;
    const qrOffsetX = (800 - qrRenderSize) / 2; // Center horizontally in 800px canvas
    const qrOffsetY = 380; // QR Y position
    
    let pathD = '';
    for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
            if (qr.isDark(r, c)) {
                const x = (qrOffsetX + c * cellSize).toFixed(2);
                const y = (qrOffsetY + r * cellSize).toFixed(2);
                const w = (cellSize + 0.1).toFixed(2);
                const h = (cellSize + 0.1).toFixed(2);
                pathD += `M${x},${y}h${w}v${h}h-${w}z `;
            }
        }
    }

    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1020" width="800" height="1020">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5c0612" />
      <stop offset="40%" stop-color="#8a101f" />
      <stop offset="100%" stop-color="#3d030b" />
    </linearGradient>

    <!-- Gold Metallic Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f9e6a2" />
      <stop offset="35%" stop-color="#d4af37" />
      <stop offset="70%" stop-color="#aa771c" />
      <stop offset="100%" stop-color="#ffd97d" />
    </linearGradient>

    <!-- Soft Card Glow -->
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.45" />
    </filter>
    <filter id="qrShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.2" />
    </filter>
  </defs>

  <style>
    .title-sub { font-family: 'Cinzel', 'Playfair Display', 'Times New Roman', serif; font-size: 15px; letter-spacing: 5px; fill: #f9e6a2; text-anchor: middle; font-weight: 600; }
    .title-main { font-family: 'Playfair Display', 'Times New Roman', serif; font-size: 38px; fill: url(#goldGrad); font-weight: 700; text-anchor: middle; letter-spacing: 2px; }
    .title-date { font-family: 'Cinzel', 'Playfair Display', serif; font-size: 52px; fill: #ffffff; font-weight: 900; text-anchor: middle; letter-spacing: 6px; }
    .quote { font-family: 'Times New Roman', serif; font-style: italic; font-size: 18px; fill: #f3dfba; text-anchor: middle; }
    .scan-instruction { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 17px; font-weight: 600; fill: #2c1810; text-anchor: middle; letter-spacing: 0.5px; }
    .scan-sub { font-family: 'Segoe UI', 'Roboto', sans-serif; font-size: 14px; fill: #665248; text-anchor: middle; }
    .url-text { font-family: 'Courier New', monospace; font-size: 13px; fill: #f9e6a2; text-anchor: middle; opacity: 0.85; }
    .footer-text { font-family: 'Times New Roman', serif; font-size: 16px; font-style: italic; fill: #ffffff; text-anchor: middle; opacity: 0.92; }
  </style>

  <!-- Background Canvas -->
  <rect width="800" height="1020" fill="url(#bgGradient)" rx="24" />

  <!-- Outer Elegant Border -->
  <rect x="25" y="25" width="750" height="970" rx="16" fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.65" />
  <rect x="35" y="35" width="730" height="950" rx="12" fill="none" stroke="url(#goldGrad)" stroke-width="1" stroke-dasharray="6,4" opacity="0.4" />

  <!-- Decorative Corner Ornaments -->
  <g stroke="url(#goldGrad)" stroke-width="2" fill="none">
    <!-- Top-Left -->
    <path d="M45,75 Q45,45 75,45 L105,45 M45,75 L45,105" />
    <circle cx="50" cy="50" r="3" fill="url(#goldGrad)" />
    <!-- Top-Right -->
    <path d="M755,75 Q755,45 725,45 L695,45 M755,75 L755,105" />
    <circle cx="750" cy="50" r="3" fill="url(#goldGrad)" />
    <!-- Bottom-Left -->
    <path d="M45,945 Q45,975 75,975 L105,975 M45,945 L45,915" />
    <circle cx="50" cy="970" r="3" fill="url(#goldGrad)" />
    <!-- Bottom-Right -->
    <path d="M755,945 Q755,975 725,975 L695,975 M755,945 L755,915" />
    <circle cx="750" cy="970" r="3" fill="url(#goldGrad)" />
  </g>

  <!-- Header Section -->
  <text x="400" y="90" class="title-sub">TRI ÂN THẦY CÔ GIÁO VIỆT NAM</text>
  
  <!-- Ribbon Line -->
  <line x1="280" y1="105" x2="520" y2="105" stroke="url(#goldGrad)" stroke-width="1.5" />
  <polygon points="400,100 406,105 400,110 394,105" fill="url(#goldGrad)" />

  <text x="400" y="155" class="title-main">CHÚC MỪNG NGÀY</text>
  <text x="400" y="215" class="title-date">20 · 11</text>
  <text x="400" y="255" class="quote">"Một gánh tri thức nặng ơn đò • Một đời thầm lặng chở ước mơ"</text>

  <!-- Central Card for QR Code -->
  <g filter="url(#shadow)">
    <!-- Main White Rounded Card -->
    <rect x="180" y="295" width="440" height="520" rx="28" fill="#fffdfa" />
    <!-- Subtle Gold Border on Card -->
    <rect x="180" y="295" width="440" height="520" rx="28" fill="none" stroke="url(#goldGrad)" stroke-width="2.5" />
  </g>

  <!-- QR Instruction Header inside card -->
  <g>
    <!-- Little Flower Icon -->
    <circle cx="400" cy="335" r="14" fill="#8a101f" opacity="0.1" />
    <text x="400" y="340" font-size="16" text-anchor="middle" fill="#8a101f">❀</text>
    <text x="400" y="362" class="scan-instruction">QUÉT MÃ ĐỂ NHẬN THIỆP TRI ÂN</text>
  </g>

  <!-- QR Code Background Frame with delicate border -->
  <rect x="${qrOffsetX - 15}" y="${qrOffsetY - 15}" width="${qrRenderSize + 30}" height="${qrRenderSize + 30}" rx="16" fill="#ffffff" filter="url(#qrShadow)" stroke="#ebd6b3" stroke-width="1" />

  <!-- The Actual QR Code Dots -->
  <path fill="#22120e" d="${pathD}" />

  <!-- QR Center Decorative Emblem -->
  <g transform="translate(400, 550)">
    <circle cx="0" cy="0" r="28" fill="#ffffff" stroke="url(#goldGrad)" stroke-width="2.5" />
    <circle cx="0" cy="0" r="24" fill="#8a101f" />
    <text x="0" y="7" font-family="'Playfair Display', serif" font-weight="900" font-size="15" fill="#f9e6a2" text-anchor="middle">20/11</text>
  </g>

  <!-- Card Subtitle -->
  <text x="400" y="760" class="scan-sub">Mở camera hoặc Zalo để quét xem thiệp chúc mừng tương tác</text>
  <text x="400" y="785" font-family="'Segoe UI', sans-serif" font-size="13" font-style="italic" fill="#8a101f" text-anchor="middle">✨ Có nhạc du dương &amp; hiệu ứng cánh hoa bay ✨</text>

  <!-- Footer Link & Blessings -->
  <text x="400" y="870" class="url-text">${targetUrl}</text>
  <line x1="220" y1="895" x2="580" y2="895" stroke="url(#goldGrad)" stroke-width="1" opacity="0.5" />
  
  <text x="400" y="930" class="footer-text">Kính chúc Quý Thầy Cô luôn dồi dào sức khỏe, hạnh phúc và thành công!</text>
  <text x="400" y="955" font-family="'Segoe UI', sans-serif" font-size="13" fill="#e0c29a" text-anchor="middle">Thiệp tri ân kỷ niệm ngày Nhà giáo Việt Nam 20/11</text>
</svg>`;

    return svg;
}

const targetUrl = process.argv[2] || 'https://taductoi1596-stack.github.io/tri-an-20-11/';
console.log('Generating QR code card for:', targetUrl);

const svgContent = generateQRCard(targetUrl);
const outputPath = path.join(__dirname, 'qr-tri-an-20-11.svg');
fs.writeFileSync(outputPath, svgContent, 'utf-8');
console.log('Saved QR SVG to:', outputPath);

// Also generate a preview HTML file to easily inspect & print
const htmlPreview = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Mã QR Thiệp Tri Ân 20/11</title>
  <style>
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: #1e1e24;
      font-family: 'Segoe UI', system-ui, sans-serif;
      color: #fff;
      padding: 20px;
    }
    .card-wrap {
      max-width: 500px;
      width: 100%;
      box-shadow: 0 25px 60px rgba(0,0,0,0.6);
      border-radius: 24px;
      overflow: hidden;
      background: #000;
    }
    .card-wrap svg {
      width: 100%;
      height: auto;
      display: block;
    }
    .actions {
      margin-top: 20px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      justify-content: center;
    }
    button, a.btn {
      padding: 12px 24px;
      border-radius: 99px;
      border: none;
      font-weight: 600;
      font-size: 15px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    .btn-download {
      background: linear-gradient(135deg, #d4af37, #aa771c);
      color: #2c1810;
    }
    .btn-download:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(212,175,55,0.4);
    }
    .btn-view {
      background: rgba(255,255,255,0.12);
      color: #fff;
    }
    .btn-view:hover {
      background: rgba(255,255,255,0.2);
    }
  </style>
</head>
<body>
  <div class="card-wrap">
    ${svgContent}
  </div>
  <div class="actions">
    <a href="qr-tri-an-20-11.svg" download="ma-qr-tri-an-thay-co-20-11.svg" class="btn btn-download">
      📥 Tải ảnh mã QR (Vector SVG)
    </a>
    <a href="index.html" class="btn btn-view">
      💌 Mở thiệp tương tác 20/11
    </a>
  </div>
</body>
</html>`;

const previewPath = path.join(__dirname, 'qr-preview.html');
fs.writeFileSync(previewPath, htmlPreview, 'utf-8');
console.log('Saved preview page to:', previewPath);

