document.addEventListener('DOMContentLoaded', () => {
  // Enhance accessibility for nav tabs
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

  // Hook theme button (if function toggleTheme exists elsewhere)
  const themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    if (typeof toggleTheme === 'function') toggleTheme();
  });

  // Ensure body theme attribute defaults
  if (!document.documentElement.hasAttribute('data-theme')) {
    const saved = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', saved);
  }
});
