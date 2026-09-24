(() => {
    let theme;
    try {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') theme = saved;
    } catch (_error) {
        // Storage may be blocked or unavailable under file://.
    }
    if (!theme) theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode', theme === 'dark');
})();
