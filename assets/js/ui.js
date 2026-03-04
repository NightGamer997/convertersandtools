document.addEventListener('DOMContentLoaded', () => {
  // Accessibility hooks for nav tabs
  const tabs = Array.from(document.querySelectorAll('.nav-tab'));
  const tabList = document.querySelector('.nav-tabs');
  if (tabList) tabList.setAttribute('role', 'tablist');
  tabs.forEach((t, i) => {
    t.setAttribute('role', 'tab');
    t.setAttribute('tabindex', t.classList.contains('active') ? '0' : '-1');
    t.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); tabs[(i+1)%tabs.length].focus(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); tabs[(i-1+tabs.length)%tabs.length].focus(); }
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t.click(); }
    });
  });

  // Theme handling
  const themeBtn = document.querySelector('.theme-toggle');

  function applyTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    try{ localStorage.setItem('theme', t); }catch(e){}
    updateThemeButton(t);
  }

  // Toggle theme (dark <-> light)
  function toggleTheme(){
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Update appearance of theme button
  function updateThemeButton(theme){
    const btn = document.querySelector('.theme-toggle');
    if(!btn) return;
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.dataset.theme = theme;
    btn.innerHTML = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
  }

  // Expose helpers globally for pages that call them
  window.toggleTheme = toggleTheme;
  window.updateThemeButton = updateThemeButton;

  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
    themeBtn.setAttribute('role','button');
    themeBtn.setAttribute('aria-label','Toggle dark / light theme');
  }

  // Initialize theme: prefer saved, then system preference, fallback to dark
  const saved = (() => { try { return localStorage.getItem('theme'); } catch(e){ return null; } })();
  if (saved) {
    applyTheme(saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    applyTheme('light');
  } else {
    applyTheme('dark');
  }
});

