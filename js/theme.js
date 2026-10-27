class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeIcon = document.querySelector('.theme-icon');
        this.root = document.documentElement;

        // theme-init.js が <head> で付けたクラスを読み、アイコンだけ合わせる
        this.currentTheme = this.root.classList.contains('dark-mode') ? 'dark' : 'light';
        this.updateIcon();

        // トグルボタンのイベントリスナー
        this.themeToggle.addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    applyTheme() {
        this.root.classList.toggle('dark-mode', this.currentTheme === 'dark');
        this.updateIcon();
    }

    updateIcon() {
        this.themeIcon.textContent = this.currentTheme === 'dark' ? '☀️' : '🌙';
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

// 最初のテーマは theme-init.js が <head> で決める。ここではボタンを結び付けるだけ
document.addEventListener('DOMContentLoaded', () => {
    new ThemeManager();
});
