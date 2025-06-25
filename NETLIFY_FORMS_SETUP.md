# Netlify Forms 設置指南

## 概述

此專案已配置為使用 Netlify Forms 來處理等候名單表單提交。Netlify Forms 是一個免費服務，每月提供 100 次表單提交額度。

## 已實現的功能

### 1. 表單設置
- ✅ HTML 表單已配置 `data-netlify="true"`
- ✅ 包含防垃圾郵件的蜜罐欄位 (`bot-field`)
- ✅ 隱藏欄位記錄提交時間和來源
- ✅ 成功提交後重定向至感謝頁面

### 2. 資料收集
表單會收集以下資訊：
- `email`: 用戶電子郵件（必填）
- `name`: 用戶姓名（選填）
- `submitted_at`: 提交時間戳
- `source`: 來源標識 ("website_waitlist")
- `user_agent`: 瀏覽器資訊

### 3. 用戶體驗
- 即時表單驗證
- 載入狀態指示
- 成功/錯誤訊息顯示
- 自動重定向至感謝頁面
- 防止重複提交（localStorage 檢查）

## 在 Netlify 後台管理表單

### 查看表單提交
1. 登入 Netlify 控制台
2. 選擇您的網站
3. 點擊左側選單的 "Forms"
4. 您將看到所有表單提交記錄

### 設置通知
1. 在 Forms 頁面中，點擊表單名稱 "waitlist"
2. 點擊 "Settings & Usage"
3. 在 "Form notifications" 區域設置：
   - **Email notifications**: 添加您的郵箱地址
   - **Slack notifications**: 連接 Slack 頻道（可選）
   - **Webhook notifications**: 設置第三方服務整合（可選）

### 匯出資料
1. 在表單詳情頁面
2. 點擊 "Export submissions"
3. 選擇匯出格式（CSV, JSON）

## 監控和分析

### Google Analytics 整合
- ✅ 表單提交事件追蹤
- ✅ 轉換率分析
- ✅ 用戶行為追蹤

### 重要指標
- 表單提交率
- 錯誤率
- 用戶來源分析
- 裝置使用情況

## 擴展選項

### 增加表單額度
如果超過免費額度（100次/月），可以：
1. 升級 Netlify 付費方案
2. 使用第三方服務（如 Formspree）
3. 實作自定義後端 API

### 進階功能
- **自動回覆郵件**: 透過 Netlify Functions 實現
- **資料庫整合**: 使用 Netlify Functions + 外部資料庫
- **A/B 測試**: 測試不同表單設計
- **進階分析**: 整合更詳細的追蹤

## 疑難排解

### 常見問題

**Q: 表單提交後沒有收到通知？**
A: 檢查 Netlify 後台 Forms 設置中的通知設定。

**Q: 表單提交失敗？**
A: 確認：
- 表單包含 `data-netlify="true"`
- 隱藏的 `form-name` 欄位存在
- 網站已部署到 Netlify

**Q: 如何防止垃圾郵件？**
A: 
- ✅ 已實現蜜罐欄位 (`bot-field`)
- 可在 Netlify 後台啟用額外的垃圾郵件過濾

### 測試表單
1. 在本地開發時，表單不會工作（需要 Netlify 環境）
2. 部署後，使用測試郵箱提交表單
3. 在 Netlify 後台確認提交記錄

## 安全性

### 已實現的安全措施
- ✅ 蜜罐欄位防垃圾郵件
- ✅ HTTPS 加密傳輸
- ✅ Netlify 內建安全防護

### 建議的額外措施
- 定期檢查提交記錄
- 設置提交頻率限制
- 監控異常活動

## 技術詳情

### HTML 結構
```html
<form name="waitlist" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="waitlist" />
    <div style="display: none;">
        <label>Don't fill this out: <input name="bot-field" /></label>
    </div>
    <!-- 表單欄位 -->
</form>
```

### JavaScript 處理
- 使用 Fetch API 提交表單
- 錯誤處理和用戶反饋
- Google Analytics 事件追蹤

## 維護建議

### 定期檢查
- 每月檢查表單提交統計
- 監控錯誤率
- 更新安全措施

### 備份資料
- 定期匯出表單提交資料
- 備份至外部儲存

---

## 聯絡資訊
如有技術問題，請聯繫：foodfate2025@gmail.com 