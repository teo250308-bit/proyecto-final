(function () {
  const script = document.currentScript;
  const base = (script && script.dataset && script.dataset.base) || '';

  const addLink = (nav, id, html) => {
    if (!nav || document.getElementById(id)) return;
    const li = document.createElement('li');
    li.className = 'menu-item';
    li.innerHTML = html;
    nav.appendChild(li);
  };

  document.addEventListener('DOMContentLoaded', async () => {
    const nav = document.getElementById('main-menu');
    if (!nav) return;
    // Evita duplicar enlaces en páginas del panel admin que ya los traen fijos
    if (location.pathname.includes('/m_admin/')) return;
    try {
      const res = await fetch(`${base}autocheck/auth_check.php`, { credentials: 'include' });
      if (!res.ok) return;
      const data = await res.json();
      if (!data || !data.auth || data.rol !== 'admin') return;
      addLink(nav, 'nav-admin-dashboard', `<a id="nav-admin-dashboard" href="${base}m_admin/index_admin.html">Dashboard</a>`);
      addLink(nav, 'nav-admin-news', `<a id="nav-admin-news" href="${base}m_admin/index_admin.html#news-admin-section">Gestionar novedades</a>`);
    } catch (err) {
      console.error(err);
    }
  });
})();
