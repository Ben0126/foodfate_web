/**
 * Foodfate 國際化 (i18n) 系統
 * 支援動態語言切換，易於添加新語言
 */

class I18nManager {
    constructor() {
        this.currentLanguage = this.getDefaultLanguage();
        this.translations = {};
        this.supportedLanguages = {
            'zh-TW': { name: '中文', flag: '🇹🇼', dir: 'ltr' },
            'en': { name: 'English', flag: '🇺🇸', dir: 'ltr' },
            'es': { name: 'Español', flag: '🇪🇸', dir: 'ltr' },
            'ja': { name: '日本語', flag: '🇯🇵', dir: 'ltr' }
        };
        this.fallbackLanguage = 'en';
    }

    /**
     * 獲取默認語言
     */
    getDefaultLanguage() {
        // 檢查 localStorage
        const storedLang = localStorage.getItem('foodfate_language');
        if (storedLang && this.isLanguageSupported(storedLang)) {
            return storedLang;
        }

        // 檢查 URL 參數
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        if (urlLang && this.isLanguageSupported(urlLang)) {
            return urlLang;
        }

        // 檢查瀏覽器語言
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang === 'zh-TW' || browserLang === 'zh-Hant') {
            return 'zh-TW';
        }
        if (browserLang.startsWith('es')) {
            return 'es';
        }
        if (browserLang.startsWith('ja')) {
            return 'ja';
        }

        return 'en';
    }

    /**
     * 檢查語言是否支援
     */
    isLanguageSupported(lang) {
        return this.supportedLanguages.hasOwnProperty(lang);
    }

    /**
     * 載入語言文件
     */
    async loadLanguage(lang) {
        if (this.translations[lang]) {
            return this.translations[lang];
        }

        try {
            const response = await fetch(`./assets/i18n/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load language file: ${lang}`);
            }
            const translations = await response.json();
            this.translations[lang] = translations;
            return translations;
        } catch (error) {
            console.warn(`Failed to load language ${lang}, falling back to ${this.fallbackLanguage}`, error);
            if (lang !== this.fallbackLanguage) {
                return await this.loadLanguage(this.fallbackLanguage);
            }
            return {};
        }
    }

    /**
     * 初始化國際化系統
     */
    async init() {
        await this.loadLanguage(this.currentLanguage);
        this.updatePageLanguage();
        this.bindLanguageSwitcher();
        this.updateLanguageSwitcherUI();
    }

    /**
     * 切換語言
     */
    async changeLanguage(lang) {
        if (!this.isLanguageSupported(lang)) {
            console.warn(`Language ${lang} is not supported`);
            return;
        }

        this.currentLanguage = lang;
        localStorage.setItem('foodfate_language', lang);
        
        await this.loadLanguage(lang);
        this.updatePageLanguage();
        this.updateLanguageSwitcherUI();
        
        // 觸發語言變更事件
        window.dispatchEvent(new CustomEvent('languageChanged', { 
            detail: { language: lang } 
        }));
    }

    /**
     * 獲取翻譯文本
     */
    t(key, params = {}) {
        const translations = this.translations[this.currentLanguage] || {};
        let text = this.getNestedValue(translations, key);
        
        // 如果當前語言沒有找到，嘗試使用備用語言
        if (!text && this.currentLanguage !== this.fallbackLanguage) {
            const fallbackTranslations = this.translations[this.fallbackLanguage] || {};
            text = this.getNestedValue(fallbackTranslations, key);
        }
        
        // 如果還是沒有找到，返回 key
        if (!text) {
            console.warn(`Translation missing for key: ${key}`);
            return key;
        }

        // 替換參數
        return this.replaceParams(text, params);
    }

    /**
     * 獲取巢狀物件的值
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    /**
     * 替換參數
     */
    replaceParams(text, params) {
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * 更新頁面語言
     */
    updatePageLanguage() {
        // 更新 html lang 屬性
        document.documentElement.lang = this.currentLanguage;
        document.documentElement.dir = this.supportedLanguages[this.currentLanguage].dir;

        // 更新所有帶有 data-i18n 屬性的元素
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const text = this.t(key);
            
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                if (element.type === 'button' || element.type === 'submit') {
                    element.value = text;
                } else {
                    element.placeholder = text;
                }
            } else {
                element.textContent = text;
            }
        });

        // 更新所有帶有 data-i18n-html 屬性的元素（支援 HTML）
        const htmlElements = document.querySelectorAll('[data-i18n-html]');
        htmlElements.forEach(element => {
            const key = element.getAttribute('data-i18n-html');
            const html = this.t(key);
            element.innerHTML = html;
        });

        // 更新所有帶有 data-i18n-title 屬性的元素
        const titleElements = document.querySelectorAll('[data-i18n-title]');
        titleElements.forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            const title = this.t(key);
            element.title = title;
        });

        // 更新 meta 標籤
        this.updateMetaTags();
    }

    /**
     * 更新 meta 標籤
     */
    updateMetaTags() {
        const metaUpdates = {
            'title': this.t('meta.title'),
            'description': this.t('meta.description'),
            'keywords': this.t('meta.keywords'),
            'og:title': this.t('meta.og.title'),
            'og:description': this.t('meta.og.description'),
            'twitter:title': this.t('meta.twitter.title'),
            'twitter:description': this.t('meta.twitter.description')
        };

        // 更新 title
        if (metaUpdates.title) {
            document.title = metaUpdates.title;
        }

        // 更新其他 meta 標籤
        Object.entries(metaUpdates).forEach(([name, content]) => {
            if (!content || name === 'title') return;

            let selector;
            if (name.startsWith('og:') || name.startsWith('twitter:')) {
                selector = `meta[property="${name}"]`;
            } else {
                selector = `meta[name="${name}"]`;
            }

            const meta = document.querySelector(selector);
            if (meta) {
                meta.setAttribute('content', content);
            }
        });
    }

    /**
     * 綁定語言切換器
     */
    bindLanguageSwitcher() {
        // 為所有語言切換按鈕綁定事件
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-lang')) {
                e.preventDefault();
                const lang = e.target.getAttribute('data-lang');
                this.changeLanguage(lang);
            }
        });
    }

    /**
     * 更新語言切換器 UI
     */
    updateLanguageSwitcherUI() {
        const currentLangInfo = this.supportedLanguages[this.currentLanguage];
        
        // 更新導航欄中的語言切換器
        const navLangSwitcher = document.querySelector('.language-switch-nav');
        if (navLangSwitcher) {
            // 找到下一個語言（簡單的循環）
            const langKeys = Object.keys(this.supportedLanguages);
            const currentIndex = langKeys.indexOf(this.currentLanguage);
            const nextLang = langKeys[(currentIndex + 1) % langKeys.length];
            const nextLangInfo = this.supportedLanguages[nextLang];
            
            navLangSwitcher.innerHTML = `${nextLangInfo.flag} ${nextLangInfo.name}`;
            navLangSwitcher.setAttribute('data-lang', nextLang);
        }

        // 更新語言選擇器下拉選單（如果存在）
        const langDropdown = document.querySelector('.language-dropdown');
        if (langDropdown) {
            this.updateLanguageDropdown(langDropdown);
        }
    }

    /**
     * 更新語言下拉選單
     */
    updateLanguageDropdown(dropdown) {
        dropdown.innerHTML = '';
        
        Object.entries(this.supportedLanguages).forEach(([code, info]) => {
            const option = document.createElement('button');
            option.className = `lang-option ${code === this.currentLanguage ? 'active' : ''}`;
            option.setAttribute('data-lang', code);
            option.innerHTML = `${info.flag} ${info.name}`;
            dropdown.appendChild(option);
        });
    }

    /**
     * 創建語言選擇器
     */
    createLanguageSelector(container) {
        const selector = document.createElement('div');
        selector.className = 'language-selector';
        
        const currentLang = this.supportedLanguages[this.currentLanguage];
        selector.innerHTML = `
            <button class="current-lang">
                ${currentLang.flag} ${currentLang.name} ▼
            </button>
            <div class="language-dropdown" style="display: none;">
            </div>
        `;

        // 綁定點擊事件
        const toggleBtn = selector.querySelector('.current-lang');
        const dropdown = selector.querySelector('.language-dropdown');
        
        toggleBtn.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
            this.updateLanguageDropdown(dropdown);
        });

        // 點擊外部關閉
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });

        container.appendChild(selector);
        return selector;
    }

    /**
     * 獲取當前語言信息
     */
    getCurrentLanguageInfo() {
        return {
            code: this.currentLanguage,
            ...this.supportedLanguages[this.currentLanguage]
        };
    }

    /**
     * 獲取支援的語言列表
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }
}

// 全域 i18n 實例
window.i18n = new I18nManager();

// 頁面載入完成後初始化
document.addEventListener('DOMContentLoaded', async () => {
    await window.i18n.init();
});

// 導出模組（如果使用模組系統）
if (typeof module !== 'undefined' && module.exports) {
    module.exports = I18nManager;
}