# 🌐 Foodfate 網站託管設置指南

## 1. 域名註冊建議

### 推薦域名選項
- `foodfate.app` - 最理想，直接對應你的 APP 名稱
- `foodfate.com` - 經典選擇，商業感強
- `foodfate.io` - 科技感，適合新創公司
- `try-foodfate.com` - 如果主域名被占用

### 域名註冊商推薦
1. **Namecheap** - 價格實惠，介面友善
2. **GoDaddy** - 知名度高，服務完整
3. **Cloudflare** - 整合 CDN，性能優秀
4. **Google Domains** - 與 Google 服務整合佳

## 2. 託管服務選擇

### 靜態網站託管（推薦）
```bash
# 1. Vercel（免費，效能佳）
npm i -g vercel
vercel --prod

# 2. Netlify（免費，CI/CD 友善）
npm install netlify-cli -g
netlify deploy --prod

# 3. GitHub Pages（免費，適合開源）
# 直接推送到 gh-pages 分支

# 4. Firebase Hosting（Google 生態系）
npm install -g firebase-tools
firebase deploy
```

### 雲端平台選擇對比

| 平台 | 免費額度 | 優勢 | 適用場景 |
|------|---------|------|----------|
| **Vercel** | 100GB 頻寬/月 | 自動 CDN、極速部署 | 推薦首選 |
| **Netlify** | 100GB 頻寬/月 | 表單處理、A/B 測試 | 功能豐富 |
| **GitHub Pages** | 1GB 儲存 | 免費、與 GitHub 整合 | 開源專案 |
| **Firebase** | 10GB 儲存 | Google 生態系整合 | 已用 Google 服務 |

## 3. 快速部署步驟

### 使用 Vercel 部署（推薦）

```bash
# 1. 安裝 Vercel CLI
npm i -g vercel

# 2. 登入 Vercel
vercel login

# 3. 在專案資料夾中初始化
vercel

# 4. 部署到生產環境
vercel --prod
```

### 使用 Netlify 部署

```bash
# 1. 安裝 Netlify CLI
npm install netlify-cli -g

# 2. 登入 Netlify
netlify login

# 3. 初始化專案
netlify init

# 4. 部署
netlify deploy --prod --dir=./
```

## 4. 域名設定

### DNS 設定範例（Cloudflare）
```
類型    名稱    內容
A       @       192.0.2.1
CNAME   www     foodfate.app
CNAME   app     your-webapp-url.vercel.app
```

### SSL 憑證
- Vercel/Netlify 自動提供免費 SSL
- Cloudflare 提供免費 SSL + CDN
- Let's Encrypt 免費憑證

## 5. 性能優化設定

### Vercel 設定檔 (vercel.json)
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/app",
      "destination": "https://your-webapp-url.com",
      "permanent": true
    }
  ]
}
```

### Netlify 設定檔 (_redirects)
```
/app    https://your-webapp-url.com    301
/*      /index.html                     200
```

## 6. 分析和監控設定

### Google Analytics 4
```html
<!-- 加入到 <head> 中 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Hotjar 使用者行為分析
```html
<script>
    (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:YOUR_HOTJAR_ID,hjsv:6};
        a=o.getElementsByTagName('head')[0];
        r=o.createElement('script');r.async=1;
        r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
        a.appendChild(r);
    })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
</script>
```

## 7. SEO 優化

### Meta 標籤優化
```html
<head>
    <title>Foodfate - 智能隨機餐廳推薦 APP | 告別選擇困難</title>
    <meta name="description" content="一鍵解鎖美食驚喜！Foodfate 智能餐廳推薦 APP，支援 iOS/Android，立即體驗 Web 版本。">
    <meta name="keywords" content="餐廳推薦,美食APP,隨機推薦,選擇困難,台灣美食">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Foodfate - 智能隨機餐廳推薦 APP">
    <meta property="og:description" content="告別選擇困難，一鍵解鎖美食驚喜！">
    <meta property="og:image" content="https://foodfate.app/og-image.jpg">
    <meta property="og:url" content="https://foodfate.app">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Foodfate - 智能隨機餐廳推薦 APP">
    <meta name="twitter:description" content="告別選擇困難，一鍵解鎖美食驚喜！">
    <meta name="twitter:image" content="https://foodfate.app/twitter-image.jpg">
</head>
```

### sitemap.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://foodfate.app/</loc>
    <lastmod>2025-01-01</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://foodfate.app/privacy</loc>
    <lastmod>2025-01-01</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>
```

## 8. 成本估算

### 年度成本預估
- **域名**：$10-15/年
- **託管**：$0（免費方案）或 $20-100/年（進階方案）
- **SSL 憑證**：$0（免費）
- **CDN**：$0-50/年（視流量而定）
- **分析工具**：$0-100/年

**總計**：約 $10-300/年，看需求而定