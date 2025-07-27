class HelpManager {
    constructor() {
        this.helpToggle = document.getElementById('help-toggle');
        this.helpModal = document.getElementById('help-modal');
        this.helpClose = document.getElementById('help-close');
        this.modalOverlay = document.querySelector('.modal-overlay');
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // ヘルプボタンクリック
        this.helpToggle.addEventListener('click', () => {
            this.showModal();
        });
        
        // 閉じるボタンクリック
        this.helpClose.addEventListener('click', () => {
            this.hideModal();
        });
        
        // オーバーレイクリック
        this.modalOverlay.addEventListener('click', () => {
            this.hideModal();
        });
        
        // ESCキーで閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.helpModal.classList.contains('hidden')) {
                this.hideModal();
            }
        });
    }
    
    showModal() {
        this.helpModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // スクロールを無効化
        
        // フォーカスをモーダルに移動
        this.helpClose.focus();
    }
    
    hideModal() {
        this.helpModal.classList.add('hidden');
        document.body.style.overflow = ''; // スクロールを復元
        
        // フォーカスをヘルプボタンに戻す
        this.helpToggle.focus();
    }
}

// DOMContentLoadedで初期化
document.addEventListener('DOMContentLoaded', () => {
    new HelpManager();
});