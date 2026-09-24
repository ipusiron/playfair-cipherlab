class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.body = document.body;
        
        // ローカルストレージから設定を読み込む
        this.currentTheme = this.body.classList.contains('dark-mode') ? 'dark' : 'light';
        this.applyTheme();
        
        // トグルボタンのイベントリスナー
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }
    
    applyTheme() {
        if (this.currentTheme === 'dark') {
            this.body.classList.add('dark-mode');
            this.themeIcon.textContent = '☀️';
        } else {
            this.body.classList.remove('dark-mode');
            this.themeIcon.textContent = '🌙';
        }
    }
    
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        try {
            localStorage.setItem('theme', this.currentTheme);
        } catch (_error) {
            // Theme changes still work without persistent storage.
        }
        this.applyTheme();
    }
}

// DOMContentLoadedの前に実行して、ちらつきを防ぐ
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
