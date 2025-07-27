document.addEventListener('DOMContentLoaded', () => {
    // Initialize i18n first
    i18n.init();
    
    // Make i18n globally accessible for help modal
    window.i18n = i18n;
    
    const ui = new UI();
    ui.init();
});