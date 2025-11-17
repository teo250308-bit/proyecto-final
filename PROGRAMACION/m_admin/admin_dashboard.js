const charts = {};
const fmt = (value = 0) => new Intl.NumberFormat('es-UY').format(Number(value) || 0);

Chart.defaults.font.family = "'Josefin Sans','Inter',sans-serif";
Chart.defaults.color = '#475467';
Chart.defaults.plugins.legend.position = 'bottom';

document.addEventListener('DOMContentLoaded', async () => {
  const isAdmin = await ensureAdmin();
  if (!isAdmin) {
    alert('Necesitas iniciar sesión como administrador para ver el panel.');
    location.href = '../porceso_de_login/login.html';
    return;
  }
  loadMetrics();
  initNewsAdmin();
});

async function ensureAdmin() {
  try {
    const res = await fetch('../autocheck/auth_check.php', { credentials: 'include' });
    if (!res.ok) return false;
    const data = await res.json();
    return data && data.auth && data.rol === 'admin';
  } catch {
    return false;
  }
}

async function loadMetrics() {
  try {
    const res = await fetch('dashboard_metrics.php', { credentials: 'include' });
    if (!res.ok) throw new Error('No se pudo obtener la información.');
    const data = await res.json();
    hydrateHero(data);
    hydrateConversion(data);
    hydrateActivity(data);
    hydrateTopPedidos(data);
  } catch (err) {
    console.error(err);
    const badge = document.getElementById('hero-updated');
    if (badge) badge.textContent = err.message;
  }
}

function hydrateHero(data) {
  const diario = data?.reservasPedidos?.diario || {};
  const semanal = data?.reservasPedidos?.semanal || {};
  const mensual = data?.reservasPedidos?.mensual || {};

  const heroDia = last(diario.totales);
  const heroSemana = last(semanal.totales);
  const heroMes = last(mensual.totales);

  updateText('hero-dia', heroDia);
  updateText('hero-semana', heroSemana);
  updateText('hero-mes', heroMes);

  const heroBadge = document.getElementById('hero-updated');
  if (heroBadge && data.generatedAt) {
    const date = new Date(data.generatedAt);
    heroBadge.textContent = `Actualizado — ${date.toLocaleString('es-UY', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })}`;
  }

}

function hydrateConversion(data) {
  const conversion = data?.conversion || {};
  updateText('conversion-valor', conversion.porcentaje ? `${conversion.porcentaje}%` : '0%');
  updateText('conversion-visitas', conversion.visitas);
  updateText('conversion-rp', conversion.reservasPedidos);
  const detalle = document.getElementById('conversion-detalle');
  if (detalle) {
    detalle.textContent = `${fmt(conversion.reservasPedidos)} reservas/pedidos · ${fmt(conversion.visitas)} visitas (${conversion.periodo?.desde} → ${conversion.periodo?.hasta})`;
  }
  const serie = conversion.serie || {};
  renderLineChart('chartConversion', serie.labels || [], [
    { label: 'Visitas', data: serie.visitas, borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,.2)', tension: .3, fill: true },
    { label: 'Reservas + pedidos', data: serie.totales, borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,.25)', tension: .3 },
  ]);
}

function hydrateActivity(data) {
  const visitas = data?.actividad?.visitasPorHora || {};
  renderBarChart('chartVisitasHora', visitas.labels || [], [
    { label: 'Visitas', data: visitas.valores, backgroundColor: '#38bdf8' },
  ]);
}

function hydrateTopPedidos(data) {
  renderList('lista-platos-pedidos', data?.platosPedidos, 'Sin pedidos registrados', 'success', 'cantidad');
}

function renderList(id, items = [], emptyLabel = 'Sin datos', pill = 'info', valueKey = 'total') {
  const el = document.getElementById(id);
  if (!el) return;
  if (!Array.isArray(items) || items.length === 0) {
    el.innerHTML = `<li><span>${emptyLabel}</span></li>`;
    return;
  }
  el.innerHTML = items.map(item => {
    const nombre = item?.nombre || 'Sin nombre';
    const valor = fmt(item?.[valueKey] ?? 0);
    return `<li><span>${nombre}</span><span class="pill ${pill}">${valor}</span></li>`;
  }).join('');
}

function renderLineChart(id, labels = [], datasets = []) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  destroyChart(id);
  charts[id] = new Chart(ctx, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
    },
  });
}

function renderBarChart(id, labels = [], datasets = [], stacked = false) {
  const ctx = document.getElementById(id);
  if (!ctx) return;
  destroyChart(id);
  charts[id] = new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked },
        y: { stacked, beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  });
}

function destroyChart(id) {
  if (charts[id]) {
    charts[id].destroy();
    delete charts[id];
  }
}

function updateText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = typeof value === 'string' ? value : fmt(value);
}

function last(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 0;
  return Number(arr[arr.length - 1]) || 0;
}

async function initNewsAdmin() {
  const form = document.getElementById('news-form');
  const list = document.getElementById('news-admin-list');
  const resetBtn = document.getElementById('news-reset');
  if (!form || !list) return;

  const state = { editingId: null };

  const formTitle = document.getElementById('news-title');
  const formDescription = document.getElementById('news-description');
  const formImage = document.getElementById('news-image');
  const formOrder = document.getElementById('news-order');
  const formActive = document.getElementById('news-active');
  const formImageFile = document.getElementById('news-image-file');
  const uploadLabel = document.getElementById('news-upload-label');
  const formId = document.getElementById('news-id');

  const uploadNewsImage = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('imagen', file);
    const originalText = uploadLabel ? uploadLabel.textContent : '';
    if (uploadLabel) uploadLabel.textContent = 'Subiendo...';
    try {
      const res = await fetch('../novedades/upload.php', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.path) {
        throw new Error(data.error || 'No se pudo subir la imagen');
      }
      formImage.value = data.path;
      if (uploadLabel) uploadLabel.textContent = 'Subido';
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al subir la imagen');
      if (uploadLabel) uploadLabel.textContent = originalText || 'Subir';
    }
  };

  const resetForm = () => {
    state.editingId = null;
    formId.value = '';
    formTitle.value = '';
    formDescription.value = '';
    formImage.value = '';
    formOrder.value = '0';
    formActive.checked = true;
  };

  const fetchNews = async () => {
    try {
      const res = await fetch('../novedades/list.php?all=1', { credentials: 'include', cache: 'no-store' });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data && data.error || 'No se pudo obtener la lista');
      if (data.error) throw new Error(data.error);
      if (data.fallback) {
        const warn = document.getElementById('news-admin-section');
        if (warn && !warn.querySelector('.news-warning')) {
          const p = document.createElement('p');
          p.className = 'news-warning';
          p.style.color = '#b45309';
          p.textContent = 'Mostrando novedades por defecto (revisa la base de datos o permisos).';
          warn.insertBefore(p, warn.firstChild);
        }
      }
      return Array.isArray(data.items) ? data.items : [];
    } catch (err) {
      console.error(err);
      alert(err.message || 'No se pudo obtener la lista de novedades');
      return [];
    }
  };

  const renderList = async () => {
    const items = await fetchNews();
    if (!items.length) {
      list.innerHTML = '<li>No hay novedades cargadas.</li>';
      return;
    }
    list.innerHTML = items.map(item => {
      const statusClass = item.activo ? 'pill success' : 'pill warning';
      const statusText = item.activo ? 'Activa' : 'Pausada';
      return `
        <li data-id="${item.id}">
          <div>
            <strong>${item.titulo || 'Sin título'}</strong>
            <div class="split" style="font-size:.8rem;color:#6b7280;">
              <span>Orden ${item.orden ?? 0}</span>
              <span>${item.imagen || 'Sin imagen'}</span>
            </div>
          </div>
          <div style="display:flex;gap:.4rem;align-items:center;">
            <span class="${statusClass}">${statusText}</span>
            <button type="button" class="btn news-edit" data-id="${item.id}" style="padding:.35rem .7rem;border-radius:6px;border:1px solid #e5e7eb;background:#fff;">Editar</button>
            <button type="button" class="btn news-delete" data-id="${item.id}" style="padding:.35rem .7rem;border-radius:6px;border:1px solid #f87171;background:#fee2e2;color:#b91c1c;">Borrar</button>
          </div>
        </li>
      `;
    }).join('');

    list.querySelectorAll('.news-edit').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const item = items.find(n => Number(n.id) === id);
        if (!item) return;
        state.editingId = id;
        formId.value = id;
        formTitle.value = item.titulo || '';
        formDescription.value = item.descripcion || '';
        formImage.value = item.imagen || '';
        formOrder.value = item.orden ?? 0;
        formActive.checked = !!item.activo;
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    list.querySelectorAll('.news-delete').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = Number(btn.dataset.id);
        if (!id) return;
        if (!confirm('¿Eliminar esta novedad?')) return;
        try {
          const res = await fetch('../novedades/delete.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ id }),
          });
          if (!res.ok) throw new Error('No se pudo eliminar');
          if (state.editingId === id) resetForm();
          await renderList();
        } catch (err) {
          console.error(err);
          alert(err.message || 'Error eliminando novedad');
        }
      });
    });
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      id: formId.value ? Number(formId.value) : null,
      titulo: formTitle.value.trim(),
      descripcion: formDescription.value.trim(),
      imagen: formImage.value.trim(),
      orden: Number(formOrder.value) || 0,
      activo: formActive.checked ? 1 : 0,
    };
    try {
      const res = await fetch('../novedades/save.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'No se pudo guardar');
      }
      resetForm();
      await renderList();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error al guardar la novedad');
    }
  });

  if (resetBtn) resetBtn.addEventListener('click', resetForm);
  if (formImageFile) {
    formImageFile.addEventListener('change', async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      await uploadNewsImage(file);
      e.target.value = '';
      if (uploadLabel) {
        setTimeout(() => { uploadLabel.textContent = 'Subir'; }, 1500);
      }
    });
  }
  await renderList();
}
