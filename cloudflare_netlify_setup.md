# 🌐 GoDaddy → Cloudflare → Netlify 完整設置指南

## 1. 從 GoDaddy 轉移 DNS 到 Cloudflare

### 步驟 1: 註冊 Cloudflare 帳戶
1. 前往 [Cloudflare.com](https://cloudflare.com)
2. 點擊 "Sign Up" 註冊免費帳戶
3. 登入後點擊 "Add a Site"

### 步驟 2: 添加你的域名
```bash
# 在 Cloudflare 中添加域名
Domain: foodfate.xyz
Plan: Free (免費方案已足夠)
```

### 步驟 3: Cloudflare 掃描現有 DNS 記錄
- Cloudflare 會自動掃描你在 GoDaddy 的現有 DNS 設定
- 檢查掃描結果，確保重要記錄都被偵測到
- 如有遺漏，手動添加

### 步驟 4: 更改 Nameservers
Cloudflare 會提供兩個 nameserver，格式如下：
```
alice.ns.cloudflare.com
bob.ns.cloudflare.com
```

前往 GoDaddy 更改 nameserver：

1. **登入 GoDaddy 控制台**
2. **找到 "DNS Management" 或 "Nameservers"**
3. **選擇 "Custom"**
4. **輸入 Cloudflare 提供的兩個 nameserver**
5. **保存設定**

⚠️ **重要提醒**：DNS 傳播需要 24-48 小時，但通常 2-4 小時內就會生效。

### 步驟 5: 驗證 DNS 轉移
```bash
# 使用命令列檢查 DNS
dig foodfate.xyz NS

# 或使用線上工具
# https://www.whatsmydns.net/
```

## 2. 在 Cloudflare 設定 DNS 記錄

### 基本 DNS 設定
進入 Cloudflare Dashboard → 你的域名 → DNS

```
類型    名稱    內容                           TTL    Proxy
A       @       192.0.2.1 (暫時)              Auto   🟠 DNS only
CNAME   app     foodfate-app.netlify.app      Auto   🟠 DNS only
CNAME   api     your-api-server.herokuapp.com Auto   🟠 DNS only
CNAME   beta    foodfate-beta.netlify.app     Auto   🟠 DNS only
CNAME   www     foodfate.xyz                   Auto   ✅ Proxied
```

⚠️ **重要**：部署到 Netlify 時，子域名必須設為 "DNS only"（灰雲），不能開啟 Proxy（橘雲）。

## 3. 部署到 Netlify

### 方法 A: Git 部署（推薦）

#### 步驟 1: 準備 Git Repository
```bash
# 如果還沒有 Git repo，先建立
git init
git add .
git commit -m "Initial commit"

# 推送到 GitHub/GitLab
git remote add origin https://github.com/your-username/foodfate-website.git
git push -u origin main
```

#### 步驟 2: 連接 Netlify
1. **前往 [Netlify.com](https://netlify.com)** 註冊帳戶
2. **點擊 "Add new site" → "Import an existing project"**
3. **選擇 Git provider** (GitHub/GitLab/Bitbucket)
4. **選擇你的 repository**
5. **設定建置參數**：

```yaml
# 網站設定
Build command: (留空，因為是靜態 HTML)
Publish directory: . 
# 如果是 Flutter Web：
Build command: flutter build web
Publish directory: build/web
```

### 方法 B: 手動部署

#### 步驟 1: 準備部署檔案
確保你的網站檔案結構如下：
```
project-folder/
├── index.html          # 主要宣傳頁面
├── privacy.html         # 隱私政策頁面（可選）
├── terms.html          # 服務條款頁面（可選）
├── css/
│   └── style.css
├── js/
│   └── script.js
├── images/
│   └── (圖片檔案)
└── _redirects          # Netlify 重定向規則
```

#### 步驟 2: 創建 _redirects 檔案
```bash
# _redirects 檔案內容
/app    https://app.foodfate.xyz    301
/beta   https://beta.foodfate.xyz   301

# SPA 重定向（如果需要）
/*      /index.html                 200
```

#### 步驟 3: 拖拽部署
1. **將整個資料夾打包為 ZIP**
2. **拖拽到 Netlify Dashboard**
3. **等待部署完成**

## 4. 設定自定義域名

### 在 Netlify 設定域名
1. **進入 Site settings → Domain management**
2. **點擊 "Add custom domain"**
3. **輸入 `foodfate.xyz`**
4. **Netlify 會檢查 DNS 設定**

### 子域名設定
為不同的服務創建不同的 Netlify site：

```bash
# 主網站
Site name: foodfate-main
Custom domain: foodfate.xyz

# Web APP  
Site name: foodfate-app
Custom domain: app.foodfate.xyz

# Beta 頁面
Site name: foodfate-beta  
Custom domain: beta.foodfate.xyz
```

## 5. SSL 憑證設定

### Netlify 自動 SSL
1. **域名設定完成後，前往 "SSL/TLS certificate"**
2. **點擊 "Verify DNS configuration"**
3. **等待 SSL 憑證自動生成**（通常 1-24 小時）

### 強制 HTTPS
```bash
# 在 _redirects 檔案中添加
http://foodfate.xyz/*    https://foodfate.xyz/:splat  301!
http://www.foodfate.xyz/* https://foodfate.xyz/:splat  301!
```

## 6. Cloudflare 進階設定

### 效能優化
```bash
# Cloudflare Dashboard → Speed → Optimization

✅ Auto Minify: HTML, CSS, JavaScript
✅ Brotli
✅ Early Hints
✅ HTTP/3 (with QUIC)
✅ 0-RTT Connection Resumption
```

### 安全性設定
```bash
# Cloudflare Dashboard → Security

SSL/TLS mode: Full (strict)
Always Use HTTPS: On
HSTS: Enabled
```

### 快取規則
```bash
# Page Rules 範例
Pattern: *.foodfate.xyz/static/*
Settings: Cache Level = Cache Everything, TTL = 1 month

Pattern: foodfate.xyz/*
Settings: Cache Level = Standard
```

## 7. 環境變數設定（如果需要）

### Netlify 環境變數
```bash
# Site settings → Environment variables

REACT_APP_API_URL=https://api.foodfate.xyz
FLUTTER_WEB_BASE_URL=https://app.foodfate.xyz
GOOGLE_ANALYTICS_ID=GA_TRACKING_ID
```

## 8. 效能監控設定

### Netlify Analytics
```bash
# Site settings → Analytics
啟用 Server-side analytics
```

### Cloudflare Analytics
```bash
# Dashboard → Analytics & Logs
查看流量統計、威脅分析
```

## 9. 部署流程自動化

### Netlify 自動部署
```yaml
# netlify.toml 檔案
[build]
  command = "flutter build web"
  publish = "build/web"

[build.environment]
  FLUTTER_WEB_AUTO_DETECT = "true"

[[redirects]]
  from = "/app"
  to = "https://app.foodfate.xyz"
  status = 301

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Git Hook 部署
```bash
# 每次 push 到 main branch 自動部署
git add .
git commit -m "Update website"
git push origin main
# Netlify 會自動檢測並部署
```

## 10. 故障排除

### 常見問題與解決方案

#### DNS 設定問題
```bash
# 檢查 DNS 傳播
dig foodfate.xyz
nslookup foodfate.xyz

# 如果 DNS 沒有更新，等待更久或清除 DNS 快取
```

#### SSL 憑證問題
```bash
# 確保 DNS 記錄正確指向 Netlify
# 檢查 Cloudflare 是否設為 "DNS only"
# 等待 24 小時讓憑證生成
```

#### 部署失敗
```bash
# 檢查 build log
# 確認檔案路徑正確
# 檢查 netlify.toml 語法
```

## 11. 成本分析

### 免費方案額度
```bash
Cloudflare Free:
- 無限 DNS 查詢
- 基本 DDoS 防護
- SSL 憑證
- 100,000 requests/month

Netlify Free:
- 100GB 頻寬/月
- 300 build minutes/月
- 自動 SSL
- 表單處理 (100 submissions/月)
```

### 升級建議
```bash
# 當流量增長時考慮升級
Cloudflare Pro ($20/月):
- 更進階的快取規則
- 詳細分析報告
- 優先支援

Netlify Pro ($19/月):
- 500GB 頻寬/月
- 背景函數
- 分析報告
```

這個設定完成後，你將擁有一個高效能、安全、且易於管理的網站架構！