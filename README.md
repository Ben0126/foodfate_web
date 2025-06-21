# 🍜 Foodfate 官方網站

> 告別選擇困難，讓美食探索成為生活中的小確幸

歡迎來到 Foodfate 的世界！這裡不只是一個網站，更是一個關於美食、驚喜和生活故事的溫暖空間。我們相信，每一次用餐都應該是一場愉悅的冒險，而不是令人頭疼的選擇題。

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
├── index_en.html             # 英文主頁面
├── faq.html                  # 中文常見問題頁面（LLM 優化）
├── faq_en.html               # 英文常見問題頁面（LLM 優化）
├── sitemap.xml               # 網站地圖（LLM 爬蟲優化）
├── robots.txt                # 爬蟲指令（支援 LLM 機器人）
├── 404.html                  # 錯誤頁面
├── netlify.toml              # Netlify 配置（含 API 重定向）
├── api/
│   └── foodfate-info.json    # 結構化數據 API 端點（LLM 優化）
├── assets/
│   ├── css/
│   │   └── style.css         # 主要樣式文件
│   ├── js/
│   │   ├── main.js           # 主要 JavaScript 文件
│   │   └── i18n.js           # 國際化支援
│   └── i18n/
│       ├── zh-TW.json        # 繁體中文語言包
│       ├── en.json           # 英文語言包
│       ├── ja.json           # 日文語言包
│       └── es.json           # 西班牙文語言包
├── legal/
│   ├── privacy-policy.html   # 中文隱私政策
│   ├── privacy-policy_en.html # 英文隱私政策
│   ├── terms-of-service.html # 中文服務條款
│   ├── terms-of-service_en.html # 英文服務條款
│   ├── cookie-policy.html    # 中文 Cookie 政策
│   └── cookie-policy_en.html # 英文 Cookie 政策
├── downloads/
│   ├── README.md             # 下載說明
│   └── foodfate_app_v0.0.38-beta.apk  # 最新內測版
├── foodfate_logo.png         # 品牌 Logo
├── favicon.png               # 網站圖標
├── APP logo.png             # APP 圖標
├── LLM-OPTIMIZATION-SUMMARY.md # LLM 優化總結文檔
├── I18N_GUIDE.md            # 國際化指南
└── README.md                # 此文件
```

## ✨ 網站特色

### 🤖 LLM 搜索優化
- **AI 爬蟲友好**：專門配置支援 GPTBot、ClaudeBot、CCBot 等主要 LLM 爬蟲
- **結構化數據豐富**：完整的 Schema markup 讓 AI 能準確理解網站內容
- **自然語言 FAQ**：15+ 個以對話方式撰寫的問答，適合 LLM 引用和回答
- **API 端點**：提供 `/api/foodfate-info.json` 結構化數據供 AI 系統存取
- **多語言優化**：中英雙語完整支援，提升國際化 LLM 發現性

### 🎯 故事化體驗
- **首頁故事**：從用戶真實生活場景出發，訴說選擇困難的共同經歷
- **情感連結**：用溫暖的語言描述功能，而非冰冷的技術規格
- **場景化功能**：每個功能都對應具體的生活情境和用戶需求
- **未來願景**：用人性化語言描述產品發展方向

### 🎨 用戶體驗設計
- **訊息公布系統**：醒目的橘色漸層橫幅，清楚傳達重要訊息
- **響應式設計**：在各種裝置上都能完美呈現故事內容
- **視覺層次**：故事文本特殊樣式，重點內容高亮顯示
- **雙語支援**：中英文版本都採用故事化敘述方式

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
  --primary-color: #FF6B35;    /* 主品牌色 - 溫暖橘色，象徵美食的熱情 */
  --secondary-color: #FFB800;  /* 次要色 - 金黃色，代表美好的用餐時光 */
  --accent-color: #FF8A5B;     /* 強調色 - 柔和橘粉，營造溫馨氛圍 */
  --text-color: #2e2e2e;       /* 主文字色 - 深灰色，確保閱讀舒適 */
  --text-muted: #666;          /* 次要文字色 - 中灰色，層次分明 */
}
```

### 故事化內容樣式
```css
.story-text {
  background: rgba(255, 107, 53, 0.05);  /* 淡橘色背景 */
  border-left: 4px solid #FF6B35;        /* 左側橘色邊框 */
  padding: 1rem;                          /* 舒適的內邊距 */
  border-radius: 12px;                    /* 圓角設計 */
}

.story-highlight {
  background: linear-gradient(135deg, 
    rgba(255, 107, 53, 0.1), 
    rgba(255, 184, 0, 0.1));             /* 漸層背景 */
  border: 2px solid rgba(255, 107, 53, 0.2);
}
```

### 字體系統
- 主要字體：Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI'
- 中文字體自動回退到系統字體
- 故事文本採用較大行高（1.8）提升閱讀體驗

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

### ✨ 用戶體驗檢查
- [ ] 故事化內容在各裝置上正常顯示
- [ ] 公告橫幅醒目且資訊正確
- [ ] 中英文版本的故事敘述完整一致
- [ ] 故事文本樣式（背景、邊框）正常顯示
- [ ] 重點內容高亮效果正常

### 🔧 技術功能檢查
- [ ] 所有連結都正常運作
- [ ] 圖片和資源正確載入
- [ ] 法律文件內容正確
- [ ] Google Analytics ID 已設定
- [ ] APK 下載功能正常
- [ ] 響應式設計在各裝置正常
- [ ] SEO meta tags 正確設定
- [ ] Cookie 橫幅正常顯示
- [ ] 404 頁面正常運作

### 📱 多裝置測試
- [ ] 桌面版：故事排版清晰，公告橫幅適當高度
- [ ] 平板版：內容布局合理，文字大小適中
- [ ] 手機版：公告橫幅縱向排列，故事文本易讀

## 📞 支援與聯絡

我們深信每個用戶的聲音都很重要，您的回饋將幫助我們創造更好的美食探索體驗：

- 📧 **產品建議**：foodfate2025@gmail.com - 分享您的使用體驗和建議
- 🐛 **問題回報**：通過 GitHub Issues - 幫助我們修復問題
- 💬 **故事分享**：foodfate2025@gmail.com - 告訴我們 Foodfate 如何改變了您的用餐體驗
- 🎨 **設計回饋**：對網站的故事化呈現有任何想法，歡迎與我們分享

## 📝 更新紀錄

### v2.1.0 - LLM 優化版 (2025-01-19)
- 🤖 **完整 LLM 搜索優化**：全面實施 LLM-OPTIMIZATION-SUMMARY.md 所有需求
- 🔍 **技術優化**：
  - ✅ 新增 `sitemap.xml` 包含多語言支援和適當優先級
  - ✅ 優化 `robots.txt` 特別支援 LLM 爬蟲（GPTBot、ClaudeBot、CCBot 等）
  - ✅ 建立 `/api/foodfate-info.json` 結構化數據端點（219 行詳細資料）
  - ✅ 配置 `netlify.toml` API 重定向和安全標頭
- 📊 **結構化數據標記**：實施多層次 Schema markup
  - ✅ MobileApplication schema 完整應用資訊
  - ✅ Organization schema 詳細組織資料
  - ✅ Product schema 包含評分和評論
  - ✅ HowTo schema 使用步驟指南
  - ✅ WebSite schema 搜索功能支援
  - ✅ FAQPage schema 自然語言問答
- ❓ **內容優化**：
  - ✅ 建立中文 FAQ 頁面（35KB，640行，15+ 詳細問答）
  - ✅ 建立英文 FAQ 頁面（28KB，520行，完整翻譯）
  - ✅ 自然語言查詢優化，問題以用戶詢問 LLM 的方式撰寫
  - ✅ 互動式搜索和分類功能
- 🌐 **LLM 特定功能**：
  - ✅ 爬蟲友好結構，明確支援 AI 爬蟲
  - ✅ 豐富元數據和結構化回答
  - ✅ 完整雙語言支援（中文/英文）
  - ✅ API 易訪問性（`/api/info` 重定向）
- 🎯 **用戶體驗改進**：
  - ✅ FAQ 整合到主導航
  - ✅ 一致的多語言切換體驗
  - ✅ FAQ 頁面內搜索和類別篩選
- 📈 **預期效益**：提升在 LLM 搜索結果中的可發現性和引用準確性

### v2.0.0 - 故事化改版 (2025-06-18)
- ✨ 全面重新設計網站內容，從技術導向改為故事化敘述
- 🎯 新增用戶生活場景描述，提升情感連結
- 🎨 更新視覺設計，添加故事文本專屬樣式
- 📢 新增訊息公布系統，支援中英文雙語
- 📱 優化響應式設計，確保故事內容在各裝置完美呈現

---

**Made with ❤️ and 🍜 for every food lover**

*每一次選擇都是一個故事，每一餐都是一場冒險*