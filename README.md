# Foodfate 官方網站

歡迎來到 Foodfate 智能隨機餐廳推薦 APP 的官方網站！

## 🚀 快速部署

### Netlify 部署步驟

1. **準備工作**
   ```bash
   # 確保所有文件都在正確位置
   git add .
   git commit -m "Initial website setup"
   git push origin main
   ```

2. **Netlify 設定**
   - 登入 [Netlify](https://netlify.com)
   - 點擊 "Add new site" → "Import an existing project"
   - 連結你的 GitHub 倉庫
   - 部署設定：
     - Build command: `echo 'No build required'`
     - Publish directory: `.` (根目錄)
     - Node version: `18`

3. **自定義域名**（選擇性）
   - 在 Netlify 後台設定自定義域名
   - 更新 DNS 設定指向 Netlify

## 📁 項目結構

```
foodfate_web/
├── index.html                 # 主頁面
├── 404.html                  # 錯誤頁面
├── netlify.toml              # Netlify 配置
├── assets/
│   ├── css/
│   │   └── style.css         # 主要樣式文件
│   └── js/
│       └── main.js           # 主要 JavaScript 文件
├── legal/
│   ├── privacy-policy.html   # 隱私政策
│   ├── terms-of-service.html # 服務條款
│   └── cookie-policy.html    # Cookie 政策
├── downloads/
│   ├── README.md             # 下載說明
│   ├── foodfate_app_v0.0.39-beta.apk  # 最新內測版
│   └── foodfate-v0.9.5-beta.apk  # 穩定內測版
├── foodfate_logo.png         # 品牌 Logo
├── APP logo.png             # APP 圖標
└── README.md                # 此文件
```

## ✨ 功能特色

### 🎯 核心頁面
- **首頁**：產品介紹、功能展示、用戶見證
- **統計展示**：用戶數據、使用統計
- **內測下載**：Android APK 下載功能
- **法律文件**：完整的隱私政策、服務條款、Cookie 政策

### 🛡️ 法律合規
- ✅ GDPR 合規的隱私政策
- ✅ Cookie 同意機制
- ✅ 完整的服務條款
- ✅ 資料保護說明

### 📱 技術特性
- ✅ 響應式設計
- ✅ PWA 就緒
- ✅ SEO 優化
- ✅ Google Analytics 整合
- ✅ 安全標頭配置

## 🔧 自定義設定

### Analytics 設定
1. 在 `index.html` 中替換 `GA_MEASUREMENT_ID` 為你的 Google Analytics ID
2. 在 `assets/js/main.js` 中更新相關配置

### APK 文件上傳
1. 將實際的 APK 文件放入 `downloads/` 目錄
2. 更新 `downloads/README.md` 中的文件說明
3. 確保文件大小不超過 Netlify 限制（100MB）

### 品牌資產更新
- 替換 `foodfate_logo.png` 為你的品牌 Logo
- 更新 `APP logo.png` 為實際的 APP 圖標
- 調整 CSS 中的品牌色彩（#FF6B35）

## 🎨 設計系統

### 色彩配置
```css
:root {
  --primary-color: #FF6B35;    /* 主品牌色 */
  --secondary-color: #FFB800;  /* 次要色 */
  --accent-color: #FF8A5B;     /* 強調色 */
  --text-color: #2e2e2e;       /* 主文字色 */
  --text-muted: #666;          /* 次要文字色 */
}
```

### 字體系統
- 主要字體：Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'
- 中文字體自動回退到系統字體

## 📊 監控與分析

### Google Analytics 事件
- `page_view`: 頁面瀏覽
- `cta_click`: CTA 按鈕點擊
- `apk_download`: APK 下載
- `conversion_funnel`: 轉換漏斗追蹤

### 效能監控
- Core Web Vitals 監控
- 錯誤事件追蹤
- 用戶行為分析

## 🔒 安全性

### 安全標頭
- Content Security Policy (CSP)
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security

### 資料保護
- Cookie 同意管理
- 資料最小化原則
- 用戶權利機制

## 🚀 部署檢查清單

部署前請確認以下項目：

- [ ] 所有連結都正常運作
- [ ] 圖片和資源正確載入
- [ ] 法律文件內容正確
- [ ] Google Analytics ID 已設定
- [ ] APK 下載功能正常
- [ ] 響應式設計在各裝置正常
- [ ] SEO meta tags 正確設定
- [ ] Cookie 橫幅正常顯示
- [ ] 404 頁面正常運作

## 📞 支援與聯絡

如需技術支援或有任何問題：

- 📧 技術支援：foodfate2025@gmail.com
- 🐛 Bug 回報：通過 GitHub Issues
- 💬 功能建議：foodfate2025@gmail.com

## 📄 授權

本項目採用 MIT 授權條款。詳見 LICENSE 文件。

---

**Made with ❤️ for Foodfate Team**