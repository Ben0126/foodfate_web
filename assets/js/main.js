// Foodfate 官方網站主要 JavaScript

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    initNavbar();
    initCookieBanner();
    initAnalytics();
    initScrollAnimations();
    initMobileMenu();
    initAnnouncementBanner();
    initWaitlistForm(); // 初始化等候清單表單
    adjustBodyPadding(); // 新增呼叫
    if (document.getElementById('waitlist-form')) {
        new FormValidator();
    }
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

// 公告橫幅功能
function initAnnouncementBanner() {
    const announcementBanner = document.getElementById('announcementBanner');
    const announcementClosed = localStorage.getItem('announcementClosed');
    
    // 如果用戶已關閉公告，則隱藏橫幅
    if (announcementClosed === 'true' && announcementBanner) {
        announcementBanner.style.display = 'none';
    }
    // 監聽視窗大小變化，以調整 padding
    window.addEventListener('resize', adjustBodyPadding);
}

// 新增函數：調整 body 的 padding-top
function adjustBodyPadding() {
    const announcementBanner = document.getElementById('announcementBanner');
    if (announcementBanner && window.getComputedStyle(announcementBanner).display !== 'none') {
        const bannerHeight = announcementBanner.offsetHeight;
        document.body.style.paddingTop = `${bannerHeight}px`;
    } else {
        document.body.style.paddingTop = '0px';
    }
}

// 關閉公告功能
function closeAnnouncement() {
    const announcementBanner = document.getElementById('announcementBanner');
    
    if (announcementBanner) {
        // 添加淡出動畫
        announcementBanner.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        announcementBanner.style.opacity = '0';
        announcementBanner.style.transform = 'translateY(-100%)';
        
        // 動畫完成後隱藏元素
        setTimeout(() => {
            announcementBanner.style.display = 'none';
            adjustBodyPadding(); // 在關閉後重新調整
        }, 300);
        
        // 記住用戶的選擇
        localStorage.setItem('announcementClosed', 'true');
        localStorage.setItem('announcementClosedTime', Date.now());
        
        // 記錄關閉事件
        if (typeof gtag !== 'undefined') {
            gtag('event', 'announcement_closed', {
                'event_category': 'engagement',
                'event_label': 'user_action',
                'value': 1
            });
        }
    }
}

// 顯示等候清單表單
function showWaitlistForm() {
    const formContainer = document.getElementById('waitlist-form-container');
    const joinButton = document.querySelector('.btn-join-waitlist');
    
    if (formContainer && joinButton) {
        if (formContainer.style.display === 'none' || !formContainer.style.display) {
            formContainer.style.display = 'block';
            joinButton.textContent = '隱藏表單';
            
            // 記錄顯示等候清單事件
            if (typeof gtag !== 'undefined') {
                gtag('event', 'waitlist_form_shown', {
                    'event_category': 'engagement',
                    'event_label': 'announcement_banner',
                    'value': 1
                });
            }
        } else {
            formContainer.style.display = 'none';
            joinButton.textContent = '加入等候清單';
        }
        
        adjustBodyPadding(); // 調整頁面間距
    }
}

// 處理等候清單表單提交
function handleWaitlistFormSubmit(event) {
    event.preventDefault();
    
    const form = document.getElementById('waitlist-form');
    const formData = new FormData(form);
    const submitButton = form.querySelector('button[type="submit"]');
    const feedbackDiv = document.getElementById('form-feedback');
    
    // 基本驗證
    const email = formData.get('email');
    const name = formData.get('name');
    
    if (!email || !name) {
        showFormFeedback('請填寫電子郵件和姓名！', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showFormFeedback('請輸入有效的電子郵件地址！', 'error');
        return;
    }
    
    // 顯示載入狀態
    submitButton.disabled = true;
    submitButton.textContent = '傳送中...';
    
    // 提交到 Netlify Forms
    fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString(),
    })
    .then(() => {
        showFormFeedback('感謝您！您已成功加入我們的等候清單。', 'success');
        form.reset();
        
        // 記錄成功事件
        if (typeof gtag !== 'undefined') {
            gtag('event', 'waitlist_signup_success', {
                'event_category': 'conversion',
                'event_label': 'announcement_banner',
                'value': 1
            });
        }
        
        // 3秒後隱藏表單
        setTimeout(() => {
            const formContainer = document.getElementById('waitlist-form-container');
            const joinButton = document.querySelector('.btn-join-waitlist');
            if (formContainer && joinButton) {
                formContainer.style.display = 'none';
                joinButton.textContent = '加入等候清單';
                adjustBodyPadding();
            }
        }, 3000);
    })
    .catch((error) => {
        console.error('Form submission error:', error);
        showFormFeedback('抱歉，發生錯誤，請稍後再試。', 'error');
        
        // 記錄錯誤事件
        if (typeof gtag !== 'undefined') {
            gtag('event', 'waitlist_signup_error', {
                'event_category': 'error',
                'event_label': 'form_submission',
                'value': 1
            });
        }
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = '立即加入';
    });
}

// 顯示表單回饋訊息
function showFormFeedback(message, type) {
    const feedbackDiv = document.getElementById('form-feedback');
    if (feedbackDiv) {
        feedbackDiv.textContent = message;
        feedbackDiv.className = `form-feedback ${type}`;
        feedbackDiv.style.display = 'block';
        
        // 如果是錯誤訊息，5秒後自動隱藏
        if (type === 'error') {
            setTimeout(() => {
                feedbackDiv.style.display = 'none';
            }, 5000);
        }
    }
}

// 驗證電子郵件格式
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 初始化等候清單表單
function initWaitlistForm() {
    const waitlistForm = document.getElementById('waitlist-form');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleWaitlistFormSubmit);
    }
}

// 調整導航欄位置
function adjustNavbarPosition(hasAnnouncement) {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (hasAnnouncement) {
            // 有公告時的位置（原位置）
            navbar.style.top = '80px';
        } else {
            // 沒有公告時的位置
            navbar.style.top = '0px';
            navbar.style.transition = 'top 0.3s ease';
        }
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
                        <span>📱</span> 下載最新版本 (v0.0.38-beta)
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
        // 'stable': '/downloads/foodfate-v0.9.5-beta.apk'
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

// 等候清單功能
function initWaitlist() {
    const waitlistShown = localStorage.getItem('waitlistShown');
    const waitlistClosed = localStorage.getItem('waitlistClosed');
    
    // 如果從未顯示過且未被關閉，則在3秒後顯示
    if (!waitlistShown && !waitlistClosed) {
        setTimeout(() => {
            showWaitlist();
        }, 3000);
    }
    
    // 綁定表單提交事件
    const waitlistForm = document.getElementById('waitlistForm');
    if (waitlistForm) {
        waitlistForm.addEventListener('submit', handleWaitlistSubmit);
    }
}

function showWaitlist() {
    const overlay = document.getElementById('waitlistOverlay');
    if (overlay) {
        overlay.classList.add('active');
        localStorage.setItem('waitlistShown', 'true');
        
        // 記錄顯示事件
        if (typeof gtag !== 'undefined') {
            gtag('event', 'waitlist_shown', {
                'event_category': 'engagement',
                'event_label': 'modal_display',
                'value': 1
            });
        }
    }
}

function closeWaitlist() {
    const overlay = document.getElementById('waitlistOverlay');
    if (overlay) {
        overlay.classList.remove('active');
        localStorage.setItem('waitlistClosed', 'true');
        localStorage.setItem('waitlistClosedTime', Date.now());
        
        // 記錄關閉事件
        if (typeof gtag !== 'undefined') {
            gtag('event', 'waitlist_closed', {
                'event_category': 'engagement',
                'event_label': 'modal_close',
                'value': 1
            });
        }
    }
}

function handleWaitlistSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('waitlistName').value.trim();
    const email = document.getElementById('waitlistEmail').value.trim();
    const submitBtn = document.getElementById('waitlistSubmit');
    const submitText = document.getElementById('submitText');
    const messageDiv = document.getElementById('waitlistMessage');
    
    // 基本驗證
    if (!name || !email) {
        showWaitlistMessage('請填寫所有必填欄位', 'error');
        return;
    }
    
    // Email 格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showWaitlistMessage('請輸入有效的電子郵件地址', 'error');
        return;
    }
    
    // 檢查是否已經註冊
    const existingEmail = localStorage.getItem('waitlistEmail');
    if (existingEmail === email) {
        showWaitlistMessage('此電子郵件已經在等候清單中', 'error');
        return;
    }
    
    // 設置載入狀態
    submitBtn.disabled = true;
    submitText.innerHTML = '<span class="waitlist-loading"></span>送出中...';
    
    // 模擬 API 請求
    setTimeout(() => {
        // 90% 成功率的模擬
        const success = Math.random() > 0.1;
        
        if (success) {
            // 成功處理
            localStorage.setItem('waitlistEmail', email);
            localStorage.setItem('waitlistName', name);
            localStorage.setItem('waitlistSignupTime', Date.now());
            
            showWaitlistMessage('🎉 恭喜！您已成功加入等候清單！我們會在新版本上線時第一時間通知您。', 'success');
            
            // 記錄成功事件
            if (typeof gtag !== 'undefined') {
                gtag('event', 'waitlist_signup', {
                    'event_category': 'conversion',
                    'event_label': 'email_signup',
                    'value': 1
                });
            }
            
            // 隱藏表單，顯示成功狀態
            const form = document.getElementById('waitlistForm');
            form.style.display = 'none';
            
            // 3秒後自動關閉
            setTimeout(() => {
                closeWaitlist();
            }, 3000);
            
        } else {
            // 失敗處理
            showWaitlistMessage('送出失敗，請稍後再試', 'error');
            
            // 記錄失敗事件
            if (typeof gtag !== 'undefined') {
                gtag('event', 'waitlist_error', {
                    'event_category': 'error',
                    'event_label': 'submission_failed',
                    'value': 1
                });
            }
        }
        
        // 重置按鈕狀態
        submitBtn.disabled = false;
        submitText.textContent = '加入等候清單';
        
    }, 2000); // 模擬 2 秒的網路請求時間
}

function showWaitlistMessage(message, type) {
    const messageDiv = document.getElementById('waitlistMessage');
    if (messageDiv) {
        messageDiv.textContent = message;
        messageDiv.className = `waitlist-message ${type}`;
        messageDiv.classList.add('show');
        
        // 3秒後隱藏錯誤訊息
        if (type === 'error') {
            setTimeout(() => {
                messageDiv.classList.remove('show');
            }, 3000);
        }
    }
}

// 重新開啟等候清單（供測試用）
function reopenWaitlist() {
    localStorage.removeItem('waitlistShown');
    localStorage.removeItem('waitlistClosed');
    showWaitlist();
}

// 增強表單驗證系統
class FormValidator {
    constructor() {
        this.validationRules = {
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                minLength: 5,
                maxLength: 254
            },
            name: {
                required: false,
                minLength: 1,
                maxLength: 50,
                pattern: /^[a-zA-Z\u4e00-\u9fa5\s]*$/ // 允許英文、中文、空格
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupRealTimeValidation();
        this.setupFormSubmission();
    }
    
    setupRealTimeValidation() {
        const emailInput = document.getElementById('email');
        const nameInput = document.getElementById('name');
        
        if (emailInput) {
            emailInput.addEventListener('input', () => this.validateField('email'));
            emailInput.addEventListener('blur', () => this.validateField('email'));
        }
        
        if (nameInput) {
            nameInput.addEventListener('input', () => this.validateField('name'));
            nameInput.addEventListener('blur', () => this.validateField('name'));
        }
    }
    
    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        const errors = [];
        
        // 清除之前的錯誤狀態
        this.clearFieldError(field);
        
        // 必填驗證
        if (rules.required && !value) {
            errors.push(fieldName === 'email' ? 'Email 為必填欄位' : '姓名為必填欄位');
        }
        
        // 只在有值時進行其他驗證
        if (value) {
            // 長度驗證
            if (rules.minLength && value.length < rules.minLength) {
                errors.push(`最少需要 ${rules.minLength} 個字符`);
            }
            if (rules.maxLength && value.length > rules.maxLength) {
                errors.push(`最多只能 ${rules.maxLength} 個字符`);
            }
            
            // 格式驗證
            if (rules.pattern && !rules.pattern.test(value)) {
                if (fieldName === 'email') {
                    errors.push('請輸入有效的 Email 格式');
                } else if (fieldName === 'name') {
                    errors.push('姓名只能包含中文、英文字母和空格');
                }
            }
            
            // Email 特殊驗證
            if (fieldName === 'email') {
                const emailErrors = this.validateEmailSpecial(value);
                errors.push(...emailErrors);
            }
        }
        
        // 顯示錯誤或成功狀態
        if (errors.length > 0) {
            this.showFieldError(field, errors[0]);
            return false;
        } else if (value) {
            this.showFieldSuccess(field);
            return true;
        }
        
        return !rules.required || value.length > 0;
    }
    
    validateEmailSpecial(email) {
        const errors = [];
        
        // 檢查是否為臨時信箱域名
        const tempEmailDomains = [
            '10minutemail.com', 'tempmail.org', 'guerrillamail.com',
            'temp-mail.org', 'throwaway.email', 'mailinator.com'
        ];
        
        const domain = email.split('@')[1];
        if (tempEmailDomains.includes(domain)) {
            errors.push('請使用常用的 Email 地址');
        }
        
        // 檢查連續點或特殊字符
        if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
            errors.push('Email 格式不正確');
        }
        
        return errors;
    }
    
    validateForm() {
        const emailValid = this.validateField('email');
        const nameValid = this.validateField('name');
        
        return emailValid && nameValid;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        // 移除舊的錯誤訊息
        this.removeErrorMessage(field);
        
        // 新增錯誤訊息
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error-message';
        errorDiv.textContent = message;
        field.parentNode.appendChild(errorDiv);
        
        // 震動效果（在支援的裝置上）
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
    }
    
    showFieldSuccess(field) {
        field.classList.add('success');
        field.classList.remove('error');
        this.removeErrorMessage(field);
    }
    
    clearFieldError(field) {
        field.classList.remove('error', 'success');
        this.removeErrorMessage(field);
    }
    
    removeErrorMessage(field) {
        const existingError = field.parentNode.querySelector('.field-error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    setupFormSubmission() {
        const form = document.getElementById('waitlistForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                if (this.validateForm()) {
                    this.submitForm();
                } else {
                    this.showFormError('請檢查並修正表單中的錯誤');
                }
            });
        }
    }
    
    async submitForm() {
        const submitBtn = document.getElementById('submitBtn');
        const email = document.getElementById('email').value.trim();
        const name = document.getElementById('name').value.trim();
        
        // 防止重複提交
        if (submitBtn.disabled) return;
        
        // 更新按鈕狀態
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ 提交中...';
        
        try {
            // 檢查是否已經註冊
            const existingUser = localStorage.getItem('waitlistUser');
            if (existingUser) {
                const userData = JSON.parse(existingUser);
                if (userData.email === email) {
                    this.showSuccessMessage('您已經在等候名單中了！');
                    return;
                }
            }
            
            // 模擬 API 提交（95% 成功率）
            await this.simulateAPISubmission({ email, name });
            
            // 儲存用戶資料
            const userData = {
                email,
                name,
                timestamp: Date.now(),
                source: 'waitlist_form'
            };
            localStorage.setItem('waitlistUser', JSON.stringify(userData));
            
            // 追蹤轉換事件
            this.trackWaitlistSignup(email, name);
            
            // 顯示成功訊息
            this.showSuccessMessage();
            
            // 清空表單
            document.getElementById('waitlistForm').reset();
            this.clearAllFieldStates();
            
        } catch (error) {
            console.error('Waitlist submission error:', error);
            this.showErrorMessage(error.message || '提交失敗，請稍後再試');
        } finally {
            // 恢復按鈕狀態
            submitBtn.disabled = false;
            submitBtn.innerHTML = '✨ 加入等候名單';
        }
    }
    
    async simulateAPISubmission(userData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // 95% 成功率
                if (Math.random() > 0.05) {
                    resolve({ success: true, id: Math.random().toString(36).substr(2, 9) });
                } else {
                    reject(new Error('網路連線不穩定，請稍後再試'));
                }
            }, 1500 + Math.random() * 1000); // 1.5-2.5秒延遲
        });
    }
    
    trackWaitlistSignup(email, name) {
        // Google Analytics 事件追蹤
        if (typeof gtag !== 'undefined') {
            gtag('event', 'waitlist_signup', {
                event_category: 'engagement',
                event_label: 'form_submission',
                value: 1,
                custom_parameters: {
                    has_name: name ? 'yes' : 'no',
                    email_domain: email.split('@')[1]
                }
            });
        }
        
        // 追蹤轉換漏斗
        trackConversionFunnel('waitlist_completed');
        
        console.log('Waitlist signup tracked:', { email, name });
    }
    
    showSuccessMessage(customMessage = null) {
        const successDiv = document.getElementById('successMessage');
        const errorDiv = document.getElementById('errorMessage');
        
        if (customMessage) {
            successDiv.innerHTML = `🎉 ${customMessage}`;
        }
        
        successDiv.style.display = 'block';
        errorDiv.style.display = 'none';
        
        // 自動隱藏成功訊息
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 8000);
        
        // 滾動到訊息位置
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showErrorMessage(message) {
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        
        errorDiv.innerHTML = `❌ ${message}<br>如有問題請聯繫：foodfate2025@gmail.com`;
        errorDiv.style.display = 'block';
        successDiv.style.display = 'none';
        
        // 自動隱藏錯誤訊息
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 10000);
        
        // 滾動到訊息位置
        errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showFormError(message) {
        // 在表單上方顯示錯誤
        const form = document.getElementById('waitlistForm');
        let errorDiv = form.querySelector('.form-error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'form-error-message';
            form.insertBefore(errorDiv, form.firstChild);
        }
        
        errorDiv.innerHTML = `⚠️ ${message}`;
        errorDiv.style.display = 'block';
        
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
    
    clearAllFieldStates() {
        ['email', 'name'].forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                this.clearFieldError(field);
            }
        });
    }
}

// 密碼強度檢查器（未來功能）
class PasswordStrengthChecker {
    static checkStrength(password) {
        let score = 0;
        const feedback = [];
        
        if (password.length >= 8) score += 1;
        else feedback.push('至少需要 8 個字符');
        
        if (/[a-z]/.test(password)) score += 1;
        else feedback.push('需要包含小寫字母');
        
        if (/[A-Z]/.test(password)) score += 1;
        else feedback.push('需要包含大寫字母');
        
        if (/[0-9]/.test(password)) score += 1;
        else feedback.push('需要包含數字');
        
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback.push('需要包含特殊字符');
        
        const strength = score < 2 ? 'weak' : score < 4 ? 'medium' : 'strong';
        
        return { score, strength, feedback };
    }
}

// 社群媒體分享功能
class SocialMediaSharer {
    constructor() {
        this.shareData = {
            title: 'Foodfate - 智慧餐廳推薦 APP 即將推出！',
            text: '告別選擇困難！Foodfate 正在升級改版中，加入等候名單搶先體驗全新的智慧美食推薦功能 🍜✨',
            url: window.location.href,
            hashtags: ['Foodfate', '美食APP', '餐廳推薦', '台灣美食', '智慧推薦']
        };
    }
    
    shareToFacebook() {
        const url = `https://www.facebook.com/sharer/sharer.php?` +
            `u=${encodeURIComponent(this.shareData.url)}&` +
            `quote=${encodeURIComponent(this.shareData.text)}`;
        
        this.openShareWindow(url, 'facebook');
        this.trackShare('facebook');
    }
    
    shareToLine() {
        const text = `${this.shareData.text}\n${this.shareData.url}`;
        const url = `https://social-plugins.line.me/lineit/share?` +
            `url=${encodeURIComponent(this.shareData.url)}&` +
            `text=${encodeURIComponent(text)}`;
        
        this.openShareWindow(url, 'line');
        this.trackShare('line');
    }
    
    shareToTwitter() {
        const text = `${this.shareData.text}`;
        const hashtags = this.shareData.hashtags.join(',');
        const url = `https://twitter.com/intent/tweet?` +
            `text=${encodeURIComponent(text)}&` +
            `url=${encodeURIComponent(this.shareData.url)}&` +
            `hashtags=${encodeURIComponent(hashtags)}`;
        
        this.openShareWindow(url, 'twitter');
        this.trackShare('twitter');
    }
    
    shareToInstagram() {
        // Instagram 不支援直接 URL 分享，所以複製文字並提示用戶
        const shareText = `${this.shareData.text}\n\n${this.shareData.url}\n\n${this.shareData.hashtags.map(tag => `#${tag}`).join(' ')}`;
        
        try {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(shareText).then(() => {
                    this.showInstagramSharePrompt();
                });
            } else {
                this.fallbackCopyToClipboard(shareText);
                this.showInstagramSharePrompt();
            }
            this.trackShare('instagram');
        } catch (error) {
            console.error('Instagram share failed:', error);
            this.showShareNotification('分享失敗，請手動複製內容分享', 'error');
        }
    }
    
    showInstagramSharePrompt() {
        const promptDiv = document.createElement('div');
        promptDiv.className = 'instagram-share-prompt';
        promptDiv.innerHTML = `
            <div class="prompt-content">
                <div class="prompt-icon">📷</div>
                <div class="prompt-title">Instagram 分享</div>
                <div class="prompt-message">文字已複製到剪貼簿！<br>請開啟 Instagram 並貼上分享</div>
                <div class="prompt-actions">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" class="prompt-close">知道了</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(promptDiv);
        
        // 自動移除提示
        setTimeout(() => {
            if (promptDiv.parentNode) {
                promptDiv.parentNode.removeChild(promptDiv);
            }
        }, 5000);
    }
    
    async copyShareLink() {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(this.shareData.url);
            } else {
                // Fallback for older browsers
                this.fallbackCopyToClipboard(this.shareData.url);
            }
            
            this.showShareNotification('連結已複製到剪貼簿！');
            this.trackShare('copy_link');
        } catch (error) {
            console.error('Copy failed:', error);
            this.showShareNotification('複製失敗，請手動複製連結', 'error');
        }
    }
    
    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Fallback copy failed:', err);
            throw err;
        } finally {
            document.body.removeChild(textArea);
        }
    }
    
    openShareWindow(url, platform) {
        const windowFeatures = this.getWindowFeatures(platform);
        const shareWindow = window.open(url, `share_${platform}`, windowFeatures);
        
        // Focus the share window if it was blocked
        if (shareWindow) {
            shareWindow.focus();
        } else {
            // If popup was blocked, open in new tab
            window.open(url, '_blank');
        }
    }
    
    getWindowFeatures(platform) {
        const features = {
            facebook: 'width=600,height=400',
            twitter: 'width=600,height=400',
            line: 'width=500,height=500',
            instagram: 'width=600,height=400'
        };
        
        const baseFeatures = 'scrollbars=yes,resizable=yes,toolbar=no,location=yes';
        return `${features[platform] || 'width=600,height=400'},${baseFeatures}`;
    }
    
    showShareNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = 'share-notification';
        notification.textContent = message;
        
        if (type === 'error') {
            notification.style.background = 'rgba(220, 53, 69, 0.95)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }
    
    trackShare(platform) {
        // Google Analytics 事件追蹤
        if (typeof gtag !== 'undefined') {
            gtag('event', 'share', {
                method: platform,
                content_type: 'waitlist_page',
                content_id: 'foodfate_waitlist'
            });
        }
        
        // 內部追蹤
        trackEvent('share_click', 'social_media', platform);
        
        console.log(`Shared to ${platform}`);
    }
}

// 創建全域分享器實例
const socialSharer = new SocialMediaSharer();

// 全域分享函數
function shareToFacebook() { socialSharer.shareToFacebook(); }
function shareToLine() { socialSharer.shareToLine(); }
function shareToTwitter() { socialSharer.shareToTwitter(); }
function shareToInstagram() { socialSharer.shareToInstagram(); }
function copyShareLink() { socialSharer.copyShareLink(); }

// 增強的分析追蹤系統
class AnalyticsEnhanced {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.pageLoadTime = Date.now();
        this.events = [];
        this.userAgent = navigator.userAgent;
        this.referrer = document.referrer;
        
        this.init();
    }
    
    init() {
        this.trackPageLoad();
        this.setupScrollTracking();
        this.setupEngagementTracking();
        this.setupFormInteractionTracking();
        this.setupPerformanceTracking();
    }
    
    generateSessionId() {
        return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }
    
    trackPageLoad() {
        const loadTime = Date.now() - this.pageLoadTime;
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                session_id: this.sessionId,
                load_time: loadTime,
                referrer: this.referrer
            });
        }
        
        this.trackEvent('page_load', 'navigation', 'initial_load', loadTime);
    }
    
    setupScrollTracking() {
        let scrollDepth = 0;
        let maxScroll = 0;
        const scrollMilestones = [25, 50, 75, 90, 100];
        const trackedMilestones = new Set();
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
            
            if (documentHeight > 0) {
                scrollDepth = Math.round((scrollTop / documentHeight) * 100);
                maxScroll = Math.max(maxScroll, scrollDepth);
                
                scrollMilestones.forEach(milestone => {
                    if (scrollDepth >= milestone && !trackedMilestones.has(milestone)) {
                        trackedMilestones.add(milestone);
                        this.trackScrollMilestone(milestone);
                    }
                });
            }
        });
        
        // Track max scroll on page unload
        window.addEventListener('beforeunload', () => {
            this.trackEvent('scroll_depth', 'engagement', 'max_scroll', maxScroll);
        });
    }
    
    trackScrollMilestone(percentage) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll', {
                event_category: 'engagement',
                event_label: `${percentage}%`,
                value: percentage
            });
        }
        
        this.trackEvent('scroll_milestone', 'engagement', `${percentage}%`, percentage);
    }
    
    setupEngagementTracking() {
        let engagementStart = Date.now();
        let totalEngagementTime = 0;
        let isActive = true;
        
        // Track active/inactive states
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                if (isActive) {
                    totalEngagementTime += Date.now() - engagementStart;
                    isActive = false;
                }
            } else {
                engagementStart = Date.now();
                isActive = true;
            }
        });
        
        // Track engagement time on unload
        window.addEventListener('beforeunload', () => {
            if (isActive) {
                totalEngagementTime += Date.now() - engagementStart;
            }
            
            this.trackEvent('engagement_time', 'engagement', 'total_time', Math.round(totalEngagementTime / 1000));
        });
        
        // Track idle time
        let idleTimer;
        const resetIdleTimer = () => {
            clearTimeout(idleTimer);
            idleTimer = setTimeout(() => {
                this.trackEvent('user_idle', 'engagement', 'idle_5min');
            }, 5 * 60 * 1000); // 5 minutes
        };
        
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetIdleTimer, true);
        });
    }
    
    setupFormInteractionTracking() {
        const emailInput = document.getElementById('email');
        const nameInput = document.getElementById('name');
        const form = document.getElementById('waitlistForm');
        
        if (emailInput) {
            emailInput.addEventListener('focus', () => {
                this.trackEvent('form_interaction', 'engagement', 'email_focus');
            });
            
            emailInput.addEventListener('input', () => {
                this.trackEvent('form_interaction', 'engagement', 'email_input');
            });
        }
        
        if (nameInput) {
            nameInput.addEventListener('focus', () => {
                this.trackEvent('form_interaction', 'engagement', 'name_focus');
            });
        }
        
        if (form) {
            form.addEventListener('submit', () => {
                this.trackEvent('form_interaction', 'conversion', 'form_submit');
            });
        }
    }
    
    setupPerformanceTracking() {
        // Track Core Web Vitals
        if ('web-vital' in window) {
            import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
                onCLS(this.trackWebVital.bind(this));
                onFID(this.trackWebVital.bind(this));
                onFCP(this.trackWebVital.bind(this));
                onLCP(this.trackWebVital.bind(this));
                onTTFB(this.trackWebVital.bind(this));
            });
        }
        
        // Track resource loading times
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                
                if (navigation) {
                    this.trackEvent('performance', 'timing', 'dom_content_loaded', Math.round(navigation.domContentLoadedEventEnd));
                    this.trackEvent('performance', 'timing', 'load_complete', Math.round(navigation.loadEventEnd));
                }
                
                // Track resource loading
                const resources = performance.getEntriesByType('resource');
                resources.forEach(resource => {
                    if (resource.name.includes('.css') || resource.name.includes('.js')) {
                        this.trackEvent('performance', 'resource', resource.name.split('/').pop(), Math.round(resource.duration));
                    }
                });
            }, 1000);
        });
    }
    
    trackWebVital(metric) {
        if (typeof gtag !== 'undefined') {
            gtag('event', metric.name, {
                event_category: 'web_vitals',
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                event_label: metric.id
            });
        }
        
        this.trackEvent('web_vital', 'performance', metric.name, Math.round(metric.value));
    }
    
    trackEvent(action, category, label = '', value = 1) {
        const event = {
            action,
            category,
            label,
            value,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            userAgent: this.userAgent,
            url: window.location.href
        };
        
        this.events.push(event);
        
        // Store events in localStorage for offline tracking
        const storedEvents = JSON.parse(localStorage.getItem('analyticsEvents') || '[]');
        storedEvents.push(event);
        
        // Keep only last 100 events
        if (storedEvents.length > 100) {
            storedEvents.splice(0, storedEvents.length - 100);
        }
        
        localStorage.setItem('analyticsEvents', JSON.stringify(storedEvents));
        
        console.log('Analytics Event:', event);
    }
    
    // A/B Testing support
    getExperimentVariant(experimentId) {
        const key = `experiment_${experimentId}`;
        let variant = localStorage.getItem(key);
        
        if (!variant) {
            variant = Math.random() < 0.5 ? 'A' : 'B';
            localStorage.setItem(key, variant);
        }
        
        return variant;
    }
    
    trackExperiment(experimentId, variant, action) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'experiment_interaction', {
                experiment_id: experimentId,
                variant: variant,
                action: action
            });
        }
        
        this.trackEvent('experiment', 'testing', `${experimentId}_${variant}_${action}`);
    }
}

// 初始化增強分析
document.addEventListener('DOMContentLoaded', function() {
    if (typeof gtag !== 'undefined' || localStorage.getItem('cookieConsent') === 'accepted') {
        new AnalyticsEnhanced();
    }
});
