// Load synchronously in <head> right after the stylesheet so the theme applies before the first paint.
// <body> does not exist yet, so the dark-mode class goes on <html>; styles.css uses `.dark-mode body ...`.
(() => {
    let theme;
    try {
        const saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') theme = saved;
    } catch (_error) {
        // Storage may be blocked or unavailable under file://.
    }
    if (!theme) theme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.classList.toggle('dark-mode', theme === 'dark');
})();
