# Foodfate 國際化 (i18n) 系統使用指南

## 📋 概述

這個國際化系統專為 Foodfate 網站設計，支援動態語言切換，讓添加新語言變得簡單。目前支援的語言包括：

- 🇹🇼 中文 (繁體) - `zh-TW`
- 🇺🇸 英文 - `en`  
- 🇪🇸 西班牙文 - `es`
- 🇯🇵 日文 - `ja`

## 🏗️ 系統架構

```
/assets/
├── js/
│   └── i18n.js           # 國際化核心模組
└── i18n/
    ├── zh-TW.json        # 繁體中文翻譯
    ├── en.json           # 英文翻譯
    ├── es.json           # 西班牙文翻譯
    └── ja.json           # 日文翻譯
```

## 🚀 快速開始

### 1. 在 HTML 中引入系統

```html
<!-- 在 head 中引入 i18n 系統 -->
<script src="./assets/js/i18n.js?v=1.0.0"></script>
```

### 2. 標記需要翻譯的元素

使用 `data-i18n` 屬性標記文本內容：

```html
<!-- 基本文本翻譯 -->
<h1 data-i18n="hero.title">告別選擇困難</h1>

<!-- 包含 HTML 的翻譯 -->
<p data-i18n-html="maintenance.description">包含 <strong>HTML</strong> 的內容</p>

<!-- title 屬性翻譯 -->
<button data-i18n-title="button.tooltip" data-i18n="button.text">按鈕</button>
```

### 3. 設置語言切換器

```html
<!-- 簡單的語言切換按鈕 -->
<button class="language-switch-nav" data-lang="en">🇺🇸 English</button>
<button class="language-switch-nav" data-lang="es">🇪🇸 Español</button>
<button class="language-switch-nav" data-lang="ja">🇯🇵 日本語</button>
```

## 📝 語言文件結構

語言文件使用 JSON 格式，支援巢狀結構：

```json
{
  "meta": {
    "title": "網站標題",
    "description": "網站描述",
    "og": {
      "title": "Open Graph 標題",
      "description": "Open Graph 描述"
    }
  },
  "navigation": {
    "about": "關於我們",
    "features": "功能特色",
    "download": "下載應用"
  },
  "hero": {
    "title": "主標題",
    "subtitle": "副標題"
  }
}
```

## 🎯 使用方法

### 基本翻譯

```javascript
// 在 JavaScript 中使用翻譯
const title = window.i18n.t('hero.title');
const description = window.i18n.t('meta.description');
```

### 帶參數的翻譯

```javascript
// 在翻譯文件中使用參數
{
  "welcome": "歡迎 {{name}}，今天是 {{date}}"
}

// 在代碼中使用
const message = window.i18n.t('welcome', {
  name: '用戶',
  date: '2025年1月'
});
```

### 動態語言切換

```javascript
// 切換到特定語言
await window.i18n.changeLanguage('en');

// 監聽語言變更事件
window.addEventListener('languageChanged', function(event) {
  console.log('語言已切換到:', event.detail.language);
  // 執行語言變更後的處理
});
```

## 🔧 高級功能

### 自動語言檢測

系統會按照以下順序自動檢測語言：

1. **localStorage** - 用戶之前選擇的語言
2. **URL 參數** - `?lang=en`
3. **瀏覽器語言** - `navigator.language`
4. **默認語言** - 英文 (en)

### Meta 標籤自動更新

系統會自動更新以下 meta 標籤：

- `<title>`
- `<meta name="description">`
- `<meta name="keywords">`
- `<meta property="og:title">`
- `<meta property="og:description">`
- `<meta property="twitter:title">`
- `<meta property="twitter:description">`

### 回退機制

如果某個翻譯鍵在當前語言中不存在，系統會：

1. 嘗試使用備用語言 (英文)
2. 如果備用語言也沒有，返回翻譯鍵本身
3. 在控制台輸出警告信息

## ➕ 如何添加新語言

### 步驟 1: 創建語言文件

在 `assets/i18n/` 目錄下創建新的語言文件，例如 `fr.json` (法文)：

```json
{
  "meta": {
    "title": "Foodfate - Dites Au Revoir à la Fatigue de Décision Alimentaire",
    "description": "Application intelligente de recommandation de restaurants..."
  },
  "navigation": {
    "about": "À Propos",
    "features": "Fonctionnalités",
    "download": "Télécharger"
  }
}
```

### 步驟 2: 在 i18n.js 中註冊語言

在 `assets/js/i18n.js` 中的 `supportedLanguages` 對象中添加：

```javascript
this.supportedLanguages = {
  'zh-TW': { name: '中文', flag: '🇹🇼', dir: 'ltr' },
  'en': { name: 'English', flag: '🇺🇸', dir: 'ltr' },
  'es': { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
  'ja': { name: '日本語', flag: '🇯🇵', dir: 'ltr' },
  'fr': { name: 'Français', flag: '🇫🇷', dir: 'ltr' }  // 新增法文
};
```

### 步驟 3: 添加語言切換器

在 HTML 中添加新的語言切換按鈕：

```html
<button class="language-switch-nav" data-lang="fr">🇫🇷 Français</button>
```

## 🎨 樣式指南

### 語言切換器樣式

```css
.language-switch-nav {
  background: rgba(255, 107, 53, 0.1);
  color: #FF6B35;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
}

.language-switch-nav:hover {
  background: rgba(255, 107, 53, 0.2);
  transform: scale(1.05);
}
```

### 語言下拉選單

```css
.language-dropdown {
  position: absolute;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 1000;
}

.lang-option {
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.lang-option:hover {
  background: rgba(255, 107, 53, 0.1);
}
```

## 🐛 常見問題與解決方案

### Q: 翻譯沒有立即更新？

**A:** 確保：
1. 語言文件的 JSON 格式正確
2. 翻譯鍵的路徑正確
3. 瀏覽器網路連接正常（語言文件需要通過 HTTP 載入）

### Q: 如何處理複數形式？

**A:** 在翻譯文件中使用不同的鍵：

```json
{
  "items": {
    "zero": "沒有項目",
    "one": "1 個項目",
    "other": "{{count}} 個項目"
  }
}
```

### Q: 如何支援 RTL (右到左) 語言？

**A:** 在 `supportedLanguages` 中設置 `dir: 'rtl'`：

```javascript
'ar': { name: 'العربية', flag: '🇸🇦', dir: 'rtl' }
```

## 📚 API 參考

### I18nManager 類別

#### 方法

- `changeLanguage(lang)` - 切換語言
- `t(key, params)` - 獲取翻譯文本
- `getCurrentLanguageInfo()` - 獲取當前語言信息
- `getSupportedLanguages()` - 獲取支援的語言列表

#### 事件

- `languageChanged` - 語言變更時觸發

```javascript
window.addEventListener('languageChanged', function(event) {
  console.log('新語言:', event.detail.language);
});
```

## 🔄 遷移指南

### 從舊系統遷移

如果您目前使用多個 HTML 文件（如 `index.html`, `index_en.html`），請：

1. 將內容合併到 `index-i18n.html`
2. 添加適當的 `data-i18n` 屬性
3. 創建對應的語言文件
4. 測試所有語言的顯示效果
5. 更新部署配置

## 📊 最佳實踐

### 1. 翻譯鍵命名

- 使用描述性的鍵名：`hero.title` 而不是 `h1`
- 保持階層結構：`features.cards.lunch.title`
- 使用小寫和點號分隔

### 2. 翻譯內容

- 保持翻譯的一致性
- 考慮文化差異，不僅僅是語言翻譯
- 測試長文本在 UI 中的顯示效果

### 3. 性能優化

- 僅載入當前需要的語言文件
- 使用適當的快取策略
- 考慮關鍵翻譯的預載入

## 🚀 部署建議

### 生產環境設置

1. **CDN 優化**: 將語言文件放到 CDN
2. **壓縮**: 壓縮 JSON 語言文件
3. **快取**: 設置適當的快取頭
4. **監控**: 監控翻譯載入失敗的情況

### 測試檢查清單

- [ ] 所有支援的語言都能正確載入
- [ ] 語言切換功能正常
- [ ] Meta 標籤正確更新
- [ ] 長文本不會破壞布局
- [ ] 行動裝置上的語言切換器正常工作
- [ ] 所有動態內容都能正確翻譯

---

這個國際化系統為 Foodfate 提供了強大且靈活的多語言支援，讓您能夠輕鬆地為全球用戶提供在地化的體驗！ 🌍