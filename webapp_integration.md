# 🌐 Foodfate Web APP 整合指南

## 1. Web APP 架構建議

### Flutter Web 部署
基於你現有的 Flutter 專案，可以直接編譯為 Web 版本：

```bash
# 啟用 Web 支援
flutter config --enable-web

# 建置 Web 版本
flutter build web

# 產生的檔案在 build/web/ 資料夾
```

### 子域名架構建議
```
https://foodfate.app         - 主要宣傳網站
https://app.foodfate.app     - Web APP 入口
https://api.foodfate.app     - 後端 API
```

## 2. 主網站與 Web APP 的連接

### 更新宣傳網站的連結
```html
<!-- 主要 CTA 按鈕 -->
<a href="https://app.foodfate.app" class="btn btn-primary" target="_blank">
    🚀 立即體驗 Web 版
</a>

<!-- 次要連結 -->
<a href="https://app.foodfate.app" class="btn btn-secondary" target="_blank">
    🌐 或使用 Web 版本
</a>
```

### 智能重定向邏輯
```javascript
// 在主網站加入設備檢測
function redirectToApp() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        // 手機用戶優先導向 APP 下載
        return 'https://app.foodfate.app?source=mobile';
    } else {
        // 桌面用戶直接使用 Web 版
        return 'https://app.foodfate.app?source=desktop';
    }
}
```

## 3. Web APP 最佳化

### PWA (Progressive Web App) 設定
```json
// manifest.json
{
  "name": "Foodfate - 美食推薦",
  "short_name": "Foodfate",
  "description": "智能隨機餐廳推薦 APP",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#fef3f0",
  "theme_color": "#FF6B35",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### Service Worker 快取策略
```javascript
// sw.js
const CACHE_NAME = 'foodfate-v1';
const urlsToCache = [
  '/',
  '/main.dart.js',
  '/assets/fonts/',
  '/assets/images/'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## 4. 跨平台功能適配

### Web 專屬功能
```dart
// Flutter Web 特殊處理
import 'dart:html' as html;

class WebSpecificFeatures {
  // Web 分享功能
  static void shareWebUrl(String restaurantId) {
    if (kIsWeb) {
      html.window.navigator.share({
        'title': 'Foodfate 推薦餐廳',
        'text': '我在 Foodfate 發現了這家很棒的餐廳！',
        'url': 'https://app.foodfate.app/restaurant/$restaurantId'
      });
    }
  }
  
  // Web 通知
  static void showWebNotification(String message) {
    if (kIsWeb) {
      html.Notification.requestPermission().then((permission) => {
        if (permission == 'granted') {
          new html.Notification('Foodfate', {
            'body': message,
            'icon': '/icons/icon-192.png'
          });
        }
      });
    }
  }
}
```

### 響應式布局調整
```dart
class ResponsiveLayout extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth > 1200) {
          // 桌面版布局 - 雙欄式
          return DesktopLayout();
        } else if (constraints.maxWidth > 800) {
          // 平板版布局
          return TabletLayout();
        } else {
          // 手機版布局
          return MobileLayout();
        }
      },
    );
  }
}
```

## 5. 分析和追蹤

### Web 專屬分析
```javascript
// Google Analytics 事件追蹤
function trackWebAppUsage() {
    gtag('event', 'web_app_usage', {
        'event_category': 'engagement',
        'event_label': 'try_web_version',
        'value': 1
    });
}

// 轉換追蹤
function trackConversion(action) {
    gtag('event', 'conversion', {
        'event_category': 'action',
        'event_label': action,
        'value': 1
    });
}
```

### 使用者流程分析
```dart
class WebAnalytics {
  static void trackPageView(String pageName) {
    if (kIsWeb) {
      // 發送頁面瀏覽事件到你的後端
      http.post('/api/analytics/pageview', body: {
        'page': pageName,
        'timestamp': DateTime.now().toIso8601String(),
        'user_agent': html.window.navigator.userAgent,
      });
    }
  }
  
  static void trackRestaurantRecommendation(String source) {
    // 追蹤推薦來源（web vs mobile）
    trackEvent('recommendation', {'source': source});
  }
}
```

## 6. 效能優化

### Flutter Web 特定優化
```yaml
# pubspec.yaml
flutter:
  web:
    # 啟用 Skia 渲染器以獲得更好的效能
    renderer: skia
    
dependencies:
  # Web 特定套件
  url_launcher_web: ^2.0.0
  shared_preferences_web: ^2.0.0
```

### 載入優化
```dart
// 預載入關鍵資源
class WebPreloader {
  static Future<void> preloadAssets() async {
    if (kIsWeb) {
      await Future.wait([
        precacheImage(AssetImage('assets/images/logo.png'), context),
        precacheImage(AssetImage('assets/images/food_bg.jpg'), context),
      ]);
    }
  }
}
```

## 7. SEO 優化（Web APP）

### Meta 標籤動態生成
```dart
// 使用 flutter_web_plugins
import 'dart:html' as html;

class SEOHelper {
  static void updatePageMeta({
    required String title,
    required String description,
    String? image,
  }) {
    if (kIsWeb) {
      html.document.title = title;
      
      // 更新 meta description
      var metaDesc = html.document.querySelector('meta[name="description"]');
      metaDesc?.setAttribute('content', description);
      
      // 更新 Open Graph
      var ogTitle = html.document.querySelector('meta[property="og:title"]');
      ogTitle?.setAttribute('content', title);
    }
  }
}
```

### 結構化資料
```html
<!-- 加入到 Web APP 的 index.html -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Foodfate",
  "description": "智能隨機餐廳推薦 APP",
  "url": "https://app.foodfate.app",
  "applicationCategory": "Lifestyle",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "TWD"
  }
}
</script>
```

## 8. 測試和品質保證

### 跨瀏覽器測試
```bash
# 使用 BrowserStack 或類似服務測試：
- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- 行動版瀏覽器
```

### 效能測試工具
- **Lighthouse**: Google 的網站效能分析
- **WebPageTest**: 詳細的載入時間分析
- **GTmetrix**: 綜合效能評估

### 使用者體驗測試
- **Hotjar**: 使用者行為錄影
- **FullStory**: 完整的使用者互動追蹤
- **UsabilityHub**: 可用性測試平台