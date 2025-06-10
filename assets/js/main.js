// Foodfate 官方網站主要 JavaScript

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initCookieBanner();
    initAnalytics();
    initScrollAnimations();
    initMobileMenu();
});

// 導航欄功能
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(255, 107, 53, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// 手機選單功能
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
        
        // 點擊連結時關閉選單
        navLinks.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '☰';
            }
        });
    }
}

// Cookie 橫幅功能
function initCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    const cookieConsent = localStorage.getItem('cookieConsent');
    
    if (!cookieConsent && cookieBanner) {
        setTimeout(() => {
            cookieBanner.style.display = 'block';
        }, 2000);
    }
}

function acceptCookies() {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieTimestamp', Date.now());
    hideCookieBanner();
    enableAnalytics();
    
    // 記錄同意事件
    gtag('event', 'cookie_consent', {
        'event_category': 'privacy',
        'event_label': 'accepted',
        'value': 1
    });
}

function declineCookies() {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieTimestamp', Date.now());
    hideCookieBanner();
    disableAnalytics();
    
    // 記錄拒絕事件
    gtag('event', 'cookie_consent', {
        'event_category': 'privacy',
        'event_label': 'declined',
        'value': 0
    });
}

function showCookieSettings() {
    openModal('cookieSettings');
}

function hideCookieBanner() {
    const cookieBanner = document.getElementById('cookieBanner');
    if (cookieBanner) {
        cookieBanner.style.display = 'none';
    }
}

// 分析功能管理
function initAnalytics() {
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (cookieConsent === 'accepted') {
        enableAnalytics();
    }
}

function enableAnalytics() {
    // 啟用 Google Analytics
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID', {
        anonymize_ip: true,
        allow_google_signals: false
    });
    
    console.log('Analytics enabled');
}

function disableAnalytics() {
    // 停用分析功能
    window['ga-disable-GA_MEASUREMENT_ID'] = true;
    console.log('Analytics disabled');
}

// 滾動動畫
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // 觀察需要動畫的元素
    const animateElements = document.querySelectorAll('.feature-card, .testimonial-card, .stat-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Modal 功能
function openModal(type) {
    const modal = document.getElementById('documentModal');
    const content = document.getElementById('modalContent');
    
    let title = '';
    let body = '';
    
    switch(type) {
        case 'privacy':
            title = '隱私政策';
            body = getPrivacyPolicy();
            break;
            
        case 'terms':
            title = '服務條款';
            body = getTermsOfService();
            break;
            
        case 'cookies':
            title = 'Cookie 政策';
            body = getCookiePolicy();
            break;
            
        case 'data':
            title = '數據處理說明';
            body = getDataProcessingInfo();
            break;
            
        case 'cookieSettings':
            title = 'Cookie 設定';
            body = getCookieSettings();
            break;
    }
    
    content.innerHTML = body;
    modal.style.display = 'block';
    
    // 記錄文件查看事件
    gtag('event', 'document_view', {
        'event_category': 'legal',
        'event_label': type,
        'value': 1
    });
}

function closeModal() {
    document.getElementById('documentModal').style.display = 'none';
}

// 內測資訊顯示
function showBetaInfo(platform) {
    const modal = document.getElementById('documentModal');
    const content = document.getElementById('modalContent');
    
    let body = '';
    
    if (platform === 'android') {
        body = `
            <h2>📱 Android 內測版</h2>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h3 style="color: #FF6B35;">🚀 搶先體驗</h3>
                <p>感謝您對 Foodfate 的興趣！目前我們正在進行內測，歡迎加入我們的測試行列。</p>
            </div>
            
            <div id="apkDownloadSection">
                <h3>📦 APK 下載</h3>
                <div class="download-options">
                    <button onclick="downloadAPK('latest')" class="btn btn-primary">
                        <span>📱</span> 下載最新版本 (v1.0.0-beta)
                    </button>
                    <button onclick="downloadAPK('stable')" class="btn btn-secondary">
                        <span>🔒</span> 下載穩定版本 (v0.9.5-beta)
                    </button>
                </div>
                
                <div class="apk-info" style="margin-top: 1rem; padding: 1rem; background: rgba(255, 107, 53, 0.1); border-radius: 8px;">
                    <h4 style="color: #FF6B35;">⚠️ 安裝須知</h4>
                    <ul style="color: #666; font-size: 0.9rem;">
                        <li>需要 Android 7.0 (API level 24) 或更高版本</li>
                        <li>首次安裝需要允許「未知來源」應用安裝</li>
                        <li>建議先卸載舊版本再安裝新版本</li>
                        <li>內測版本可能存在不穩定情況，請多包涵</li>
                    </ul>
                </div>
            </div>
            
            <h3>📋 簡易內測申請</h3>
            <div style="background: rgba(255, 107, 53, 0.1); padding: 1.5rem; border-radius: 10px; text-align: center;">
                <h4 style="color: #FF6B35; margin-bottom: 1rem;">🚀 一鍵申請內測</h4>
                <p style="margin-bottom: 1rem; color: #666;">點擊下方按鈕，自動生成申請郵件</p>
                <button onclick="sendBetaRequest()" class="btn btn-primary" style="font-size: 1.1rem; padding: 0.8rem 2rem;">
                    📧 立即申請內測
                </button>
                <p style="margin-top: 0.5rem; font-size: 0.9rem; color: #888;">
                    將自動打開您的郵件應用程式
                </p>
            </div>
            
            <h3>🎯 內測期間享有</h3>
            <ul>
                <li>✅ 搶先體驗最新功能</li>
                <li>✅ 直接與開發團隊交流</li>
                <li>✅ 影響產品發展方向</li>
                <li>✅ 正式版推出時的早鳥優惠</li>
            </ul>
            
            <div style="background: rgba(255, 107, 53, 0.1); padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                <h4 style="color: #FF6B35;">💡 暫時無法下載？</h4>
                <p style="margin: 0;">建議您先<a href="https://app.foodfate.xyz" target="_blank" style="color: #FF6B35; font-weight: bold;">體驗 Web 版本</a>，享受完整的 Foodfate 功能！</p>
            </div>
        `;
    }
    
    content.innerHTML = body;
    modal.style.display = 'block';
    
    // 記錄內測資訊查看
    gtag('event', 'beta_info_view', {
        'event_category': 'download',
        'event_label': platform,
        'value': 1
    });
}

// APK 下載功能
function downloadAPK(version) {
    // 記錄下載事件
    gtag('event', 'apk_download', {
        'event_category': 'download',
        'event_label': version,
        'value': 1
    });
    
    // 模擬 APK 下載
    const apkUrls = {
        'latest': '/downloads/foodfate_app_v0.0.38-beta.apk',
        'stable': '/downloads/foodfate-v0.9.5-beta.apk'
    };
    
    const downloadUrl = apkUrls[version];
    
    if (downloadUrl) {
        // 創建隱藏的下載連結
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `foodfate-${version}.apk`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 顯示下載提示
        showNotification(`開始下載 Foodfate ${version === 'latest' ? '最新' : '穩定'}版本...`, 'success');
    } else {
        showNotification('下載連結暫時無法使用，請稍後再試', 'error');
    }
}

// 一鍵內測申請
function sendBetaRequest() {
    const subject = encodeURIComponent('[Foodfate 內測申請] 我想加入內測計劃');
    const body = encodeURIComponent(`親愛的 Foodfate 團隊，

我對 Foodfate 應用程式很感興趣，希望能加入內測計劃。

我的基本資訊：
- 姓名：[請填寫您的姓名]
- 使用設備：[例如：iPhone 12 / Samsung Galaxy S21]
- 期待使用場景：[例如：日常用餐選擇 / 和朋友聚餐時使用]

謝謝！

此郵件由 Foodfate 官網自動生成
`);
    
    const mailtoLink = `mailto:foodfate2025@gmail.com?subject=${subject}&body=${body}`;
    
    // 記錄申請事件
    if (typeof gtag !== 'undefined') {
        gtag('event', 'beta_request', {
            'event_category': 'engagement',
            'event_label': 'email_click',
            'value': 1
        });
    }
    
    try {
        // 嘗試打開郵件應用程式
        if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            // iOS 設備
            window.open(mailtoLink, '_blank');
        } else if (navigator.userAgent.match(/Android/i)) {
            // Android 設備
            window.location.href = mailtoLink;
        } else {
            // 桌面設備
            const link = document.createElement('a');
            link.href = mailtoLink;
            link.target = '_blank';
            link.click();
        }
        
        // 顯示成功提示
        showNotification('📧 已自動生成申請郵件，請完善資訊後發送！', 'success');
        
        // 如果郵件應用無法打開，提供備選方案
        setTimeout(() => {
            if (confirm('郵件應用無法自動打開？\n點擊確定複製郵件地址到剪貼板')) {
                copyToClipboard('foodfate2025@gmail.com');
                showNotification('📋 郵件地址已複製到剪貼板', 'info');
            }
        }, 3000);
        
    } catch (error) {
        console.error('郵件打開失敗:', error);
        // 備選方案：複製郵件地址
        copyToClipboard('foodfate2025@gmail.com');
        showNotification('📋 郵件地址已複製：foodfate2025@gmail.com', 'info');
    }
}

// 複製到剪貼板功能
function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            console.log('已複製到剪貼板');
        }).catch(err => {
            console.error('複製失敗:', err);
            fallbackCopy(text);
        });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        console.log('使用 fallback 方法複製成功');
    } catch (err) {
        console.error('Fallback 複製也失敗:', err);
    }
    
    document.body.removeChild(textArea);
}

// 通知功能
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">✕</button>
        </div>
    `;
    
    // 添加通知樣式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 3000;
        max-width: 300px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 自動移除通知
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// 點擊外部關閉 modal
window.onclick = function(event) {
    const modal = document.getElementById('documentModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// 統計數字動畫
function animateStats() {
    const stats = document.querySelectorAll('.stat-item h3');
    
    stats.forEach(stat => {
        const target = parseInt(stat.innerText.replace(/,/g, ''));
        let current = 0;
        const increment = target / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.innerText = Math.floor(current).toLocaleString();
        }, 20);
    });
}

// 平滑滾動
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 80; // 考慮固定導航欄高度
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// 事件追蹤函數
function trackEvent(action, category = 'engagement', label = '', value = 1) {
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            'event_category': category,
            'event_label': label,
            'value': value
        });
    }
}

// CTA 按鈕事件追蹤
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-primary')) {
        trackEvent('cta_click', 'conversion', e.target.innerText, 1);
    }
    
    if (e.target.classList.contains('download-btn')) {
        trackEvent('download_click', 'conversion', 'download_button', 1);
    }
});

// 轉換漏斗追蹤
function trackConversionFunnel(step) {
    const funnelSteps = {
        'landing': '訪問首頁',
        'feature_view': '查看功能',
        'try_click': '點擊試用',
        'app_open': '開啟 Web APP',
        'register': '完成註冊'
    };
    
    gtag('event', 'funnel_step', {
        'event_category': 'conversion_funnel',
        'event_label': step,
        'custom_parameter_1': funnelSteps[step]
    });
}

// 頁面可見性 API
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        trackEvent('page_focus', 'engagement', 'page_visible');
    } else {
        trackEvent('page_blur', 'engagement', 'page_hidden');
    }
});

// 法律文件內容獲取函數
function getPrivacyPolicy() {
    return `
        <h2>Foodfate 隱私政策</h2>
        <p><strong>生效日期：2025年1月</strong></p>
        
        <h3>1. 資料收集</h3>
        <p>我們收集以下類型的個人資料：</p>
        <ul>
            <li><strong>位置資訊</strong>：用於提供附近餐廳推薦</li>
            <li><strong>使用偏好</strong>：記錄您的用餐偏好以改善推薦品質</li>
            <li><strong>設備資訊</strong>：包括設備型號、作業系統等技術資訊</li>
            <li><strong>使用記錄</strong>：應用程式使用統計，用於改善服務品質</li>
        </ul>
        
        <h3>2. 資料使用目的</h3>
        <ul>
            <li>提供個人化餐廳推薦服務</li>
            <li>改善應用程式功能和使用體驗</li>
            <li>進行服務統計分析</li>
            <li>客戶服務和技術支援</li>
        </ul>
        
        <h3>3. 資料分享</h3>
        <p>我們不會販售您的個人資料。僅在以下情況分享：</p>
        <ul>
            <li>獲得您的明確同意</li>
            <li>法律要求或法院命令</li>
            <li>保護我們的權利和安全</li>
        </ul>
        
        <h3>4. 您的權利</h3>
        <p>根據個人資料保護法，您有以下權利：</p>
        <ul>
            <li><strong>查詢權</strong>：查詢我們持有的您的個人資料</li>
            <li><strong>更正權</strong>：要求更正錯誤或不完整的資料</li>
            <li><strong>刪除權</strong>：要求刪除您的個人資料</li>
            <li><strong>停止處理權</strong>：要求停止特定資料處理</li>
        </ul>
        
        <h3>5. 資料安全</h3>
        <p>我們採用業界標準的安全措施：</p>
        <ul>
            <li>資料加密傳輸和儲存</li>
            <li>定期安全檢測和更新</li>
            <li>限制員工資料存取權限</li>
            <li>安全事件監控和回應機制</li>
        </ul>
        
        <h3>6. 聯絡我們</h3>
        <p>如有隱私相關問題，請聯絡：</p>
        <ul>
                                <li>電子郵件：foodfate2025@gmail.com</li>
                    <li>客服信箱：foodfate2025@gmail.com</li>
        </ul>
    `;
}

function getTermsOfService() {
    return `
        <h2>Foodfate 服務條款</h2>
        <p><strong>生效日期：2025年1月</strong></p>
        
        <h3>1. 服務說明</h3>
        <p>Foodfate 是一款餐廳推薦應用，提供基於位置的個人化餐廳建議。我們的服務包括：</p>
        <ul>
            <li>智能餐廳推薦</li>
            <li>美食輪盤功能</li>
            <li>地圖導航整合</li>
            <li>收藏和評價功能</li>
        </ul>
        
        <h3>2. 使用規則</h3>
        <ul>
            <li>用戶必須年滿 13 歲方可使用本服務</li>
            <li>禁止濫用或破壞服務</li>
            <li>不得上傳違法或不當內容</li>
            <li>不得進行商業用途的資料收集</li>
        </ul>
        
        <h3>3. 用戶責任</h3>
        <ul>
            <li>提供真實準確的資訊</li>
            <li>妥善保管帳戶資訊</li>
            <li>遵守相關法律法規</li>
            <li>尊重其他用戶權益</li>
        </ul>
        
        <h3>4. 免責聲明</h3>
        <p>我們努力提供準確的餐廳資訊，但不保證：</p>
        <ul>
            <li>所有資訊的完全準確性</li>
            <li>服務的不中斷性</li>
            <li>推薦結果的滿意度</li>
        </ul>
        
        <h3>5. 服務變更</h3>
        <p>我們保留隨時修改或終止服務的權利，但會：</p>
        <ul>
            <li>提前通知用戶重大變更</li>
            <li>確保用戶資料的安全轉移</li>
            <li>提供合理的過渡期</li>
        </ul>
        
        <h3>6. 爭議解決</h3>
        <p>因使用本服務產生的爭議，適用中華民國法律，並以台灣台北地方法院為第一審管轄法院。</p>
    `;
}

function getCookiePolicy() {
    return `
        <h2>Cookie 政策</h2>
        <p><strong>最後更新：2025年1月</strong></p>
        
        <h3>什麼是 Cookies？</h3>
        <p>Cookies 是小型文字檔案，當您造訪我們的網站時會儲存在您的裝置上。它們幫助我們提供更好的使用體驗。</p>
        
        <h3>我們如何使用 Cookies？</h3>
        <h4>必要 Cookies</h4>
        <ul>
            <li>確保網站正常運作</li>
            <li>記住您的登入狀態</li>
            <li>保存安全設定</li>
        </ul>
        
        <h4>功能 Cookies</h4>
        <ul>
            <li>記住您的偏好設定</li>
            <li>語言選擇</li>
            <li>地區設定</li>
        </ul>
        
        <h4>分析 Cookies</h4>
        <ul>
            <li>了解網站使用情況</li>
            <li>改善網站功能</li>
            <li>分析用戶行為模式</li>
        </ul>
        
        <h3>第三方 Cookies</h3>
        <p>我們可能使用以下第三方服務：</p>
        <ul>
            <li><strong>Google Analytics</strong>：網站分析</li>
            <li><strong>Google Maps</strong>：地圖服務</li>
            <li><strong>Facebook Pixel</strong>：廣告追蹤（需用戶同意）</li>
        </ul>
        
        <h3>管理 Cookies</h3>
        <p>您可以透過以下方式控制 Cookies：</p>
        <ul>
            <li>瀏覽器設定：調整 Cookie 接受設定</li>
            <li>我們的 Cookie 設定面板</li>
            <li>個別第三方服務的退出選項</li>
        </ul>
        
        <p><strong>注意</strong>：停用某些 Cookies 可能影響網站功能。</p>
    `;
}

function getDataProcessingInfo() {
    return `
        <h2>數據處理說明</h2>
        <p><strong>最後更新：2025年1月</strong></p>
        
        <h3>資料處理目的</h3>
        <p>我們處理您的個人資料是為了：</p>
        <ul>
            <li>提供個人化餐廳推薦</li>
            <li>改善服務品質</li>
            <li>確保應用安全性</li>
            <li>履行法律義務</li>
        </ul>
        
        <h3>法律依據</h3>
        <p>我們處理您資料的法律依據包括：</p>
        <ul>
            <li><strong>同意</strong>：您明確同意我們處理特定資料</li>
            <li><strong>合約履行</strong>：為提供服務所必需</li>
            <li><strong>合法利益</strong>：改善服務和確保安全</li>
            <li><strong>法律義務</strong>：遵守相關法規要求</li>
        </ul>
        
        <h3>資料類別</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
            <tr style="background: #f8f9fa;">
                <th style="padding: 0.5rem; border: 1px solid #ddd;">資料類型</th>
                <th style="padding: 0.5rem; border: 1px solid #ddd;">用途</th>
                <th style="padding: 0.5rem; border: 1px solid #ddd;">保存期限</th>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">帳戶資料</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">身份識別和服務提供</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">直到您刪除帳戶</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">位置資料</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">餐廳推薦</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">使用期間</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">使用記錄</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">服務改善</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">最多 24 個月</td>
            </tr>
            <tr>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">偏好設定</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">個人化服務</td>
                <td style="padding: 0.5rem; border: 1px solid #ddd;">直到您修改或刪除</td>
            </tr>
        </table>
        
        <h3>資料跨境傳輸</h3>
        <p>在某些情況下，您的資料可能傳輸至其他國家：</p>
        <ul>
            <li>雲端服務提供商的伺服器</li>
            <li>分析服務提供商</li>
            <li>我們會確保適當的保護措施</li>
        </ul>
        
        <h3>自動化決策</h3>
        <p>我們可能使用自動化系統進行：</p>
        <ul>
            <li>餐廳推薦算法</li>
            <li>內容個人化</li>
            <li>您有權要求人工介入檢視</li>
        </ul>
    `;
}

function getCookieSettings() {
    return `
        <h2>Cookie 設定</h2>
        <p>管理您的 Cookie 偏好設定</p>
        
        <div class="cookie-settings">
            <div class="cookie-category">
                <h3>必要 Cookies</h3>
                <p>這些 Cookies 對網站運作是必需的，無法關閉。</p>
                <label class="cookie-toggle">
                    <input type="checkbox" checked disabled>
                    <span class="slider"></span>
                    必要功能（無法關閉）
                </label>
            </div>
            
            <div class="cookie-category">
                <h3>功能 Cookies</h3>
                <p>這些 Cookies 幫助我們記住您的偏好設定。</p>
                <label class="cookie-toggle">
                    <input type="checkbox" id="functionalCookies" onchange="updateCookieSettings()">
                    <span class="slider"></span>
                    功能增強
                </label>
            </div>
            
            <div class="cookie-category">
                <h3>分析 Cookies</h3>
                <p>這些 Cookies 幫助我們了解網站使用情況。</p>
                <label class="cookie-toggle">
                    <input type="checkbox" id="analyticsCookies" onchange="updateCookieSettings()">
                    <span class="slider"></span>
                    使用分析
                </label>
            </div>
            
            <div class="cookie-category">
                <h3>行銷 Cookies</h3>
                <p>這些 Cookies 用於提供個人化廣告。</p>
                <label class="cookie-toggle">
                    <input type="checkbox" id="marketingCookies" onchange="updateCookieSettings()">
                    <span class="slider"></span>
                    個人化廣告
                </label>
            </div>
        </div>
        
        <div class="cookie-actions" style="margin-top: 2rem;">
            <button onclick="saveAllCookieSettings()" class="btn btn-primary">儲存設定</button>
            <button onclick="acceptAllCookies()" class="btn btn-secondary">全部接受</button>
            <button onclick="rejectAllCookies()" class="btn btn-secondary">全部拒絕</button>
        </div>
        
        <style>
        .cookie-category { margin: 1rem 0; padding: 1rem; border: 1px solid #eee; border-radius: 8px; }
        .cookie-toggle { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .cookie-toggle input[type="checkbox"] { display: none; }
        .slider { width: 50px; height: 25px; background: #ccc; border-radius: 25px; position: relative; transition: 0.3s; }
        .slider:before { content: ''; position: absolute; width: 21px; height: 21px; background: white; border-radius: 50%; top: 2px; left: 2px; transition: 0.3s; }
        .cookie-toggle input:checked + .slider { background: #FF6B35; }
        .cookie-toggle input:checked + .slider:before { transform: translateX(25px); }
        .cookie-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
        </style>
    `;
}

function updateCookieSettings() {
    // 即時更新 Cookie 設定
    console.log('Cookie settings updated');
}

function saveAllCookieSettings() {
    const settings = {
        functional: document.getElementById('functionalCookies').checked,
        analytics: document.getElementById('analyticsCookies').checked,
        marketing: document.getElementById('marketingCookies').checked,
        timestamp: Date.now()
    };
    
    localStorage.setItem('cookieSettings', JSON.stringify(settings));
    localStorage.setItem('cookieConsent', 'customized');
    
    closeModal();
    hideCookieBanner();
    
    // 根據設定啟用/停用功能
    if (settings.analytics) enableAnalytics();
    else disableAnalytics();
    
    showNotification('Cookie 設定已儲存', 'success');
}

function acceptAllCookies() {
    document.getElementById('functionalCookies').checked = true;
    document.getElementById('analyticsCookies').checked = true;
    document.getElementById('marketingCookies').checked = true;
    saveAllCookieSettings();
}

function rejectAllCookies() {
    document.getElementById('functionalCookies').checked = false;
    document.getElementById('analyticsCookies').checked = false;
    document.getElementById('marketingCookies').checked = false;
    saveAllCookieSettings();
}

