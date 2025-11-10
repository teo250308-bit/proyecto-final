document.addEventListener('DOMContentLoaded', async () => {
  // Cargar datos básicos desde sesión si existen
  try {
    const r = await fetch('../autocheck/auth_check.php', { credentials: 'include' });
    if (r.ok) {
      const j = await r.json();
      const nombre = j.nombre || j.usuario || localStorage.getItem('user_nombre') || '';
      const email = j.email || '';
      if (nombre) document.getElementById('perfil-nombre').value = nombre;
      if (email) document.getElementById('perfil-email').value = email;
    }
  } catch {}

  document.getElementById('form-perfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      nombre: document.getElementById('perfil-nombre').value.trim(),
      email: document.getElementById('perfil-email').value.trim(),
      password: document.getElementById('perfil-pass').value
    };

    try {
      const res = await fetch('../autocheck/update_profile.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        try { localStorage.setItem('user_nombre', payload.nombre); } catch {}
        alert('Perfil actualizado correctamente.');
      } else {
        alert(data.msg || 'No se pudo actualizar el perfil.');
      }
    } catch (err) {
      alert('Error de red al actualizar el perfil.');
    }
  });
});
