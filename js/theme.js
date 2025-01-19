console.log('Theme script loaded');
function initTheme() {
    try {
        console.log('InitTheme called');
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) {
            console.error('Theme toggle not found');
            return;
        }
        
        // Charger la préférence de thème
        const currentTheme = localStorage.getItem('theme') || 'default';
        document.documentElement.setAttribute('data-theme', currentTheme);
        themeToggle.checked = currentTheme === 'dark';
        
        // Gérer le changement de thème
        themeToggle.addEventListener('change', function() {
            const newTheme = this.checked ? 'dark' : 'default';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            console.log('Theme changed to:', newTheme);
        });
    } catch (error) {
        console.error('Error in initTheme:', error);
    }
}

// Essayer d'initialiser dès que possible
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTheme);
} else {
    initTheme();
} 