document.addEventListener('DOMContentLoaded', () => {
  const base = location.pathname.includes('/PROGRAMACION/m_usuarios/') ? '../' : '';

  async function requireAuth() {
    try {
      const r = await fetch(`${base}autocheck/auth_check.php`, { credentials: 'include' });
      if (!r.ok) return false;
      const j = await r.json();
      return j.auth === true;
    } catch {
      return false;
    }
  }
  const elAll = document.getElementById('contenido-menu');
  const elComidas = document.getElementById('contenido-menu-comidas');
  const elBebidas = document.getElementById('contenido-menu-bebidas');
  const elPostres = document.getElementById('contenido-menu-postres');

  if (!elAll && !elComidas && !elBebidas && !elPostres) return;

  fetch('m_usuarios/menu.php')
    .then(r => { if (!r.ok) throw new Error('Error al cargar el menú'); return r.json(); })
    .then(data => {
      const buckets = { comidas: [], bebidas: [], postres: [] };

      const card = (item, imagen) => `
        <div style="background:url('${imagen}') center/cover;" class="tarjeta-rest">
          <div class="wrap-text_tarjeta-rest">
            <h3>${item.Nombre}</h3>
            <p>${item.Descripcion ?? ''}</p>
            <div class="cta-wrap_tarjeta-rest">
              <div class="precio_tarjeta-rest"><span>$${item.Precio}</span></div>
              <div class="cta_tarjeta-rest">
                <button class="btn-pedir"
                        data-id="${item.Id_producto}"
                        data-nombre="${item.Nombre}"
                        data-precio="${item.Precio}"
                        data-imagen="${imagen}">
                  Pedir ahora
                </button>
              </div>
            </div>
          </div>
        </div>`;

      const classify = (t) => {
        const v = (t || '').toString().toLowerCase();
        if (v.includes('postre') || v.includes('dulce')) return 'postres';
        if (v.includes('bebida') || v.includes('jugo') || v.includes('trago')) return 'bebidas';
        return 'comidas';
      };

      (Array.isArray(data) ? data : []).forEach(item => {
        const imagen = item.Imagen && item.Imagen.startsWith('http')
          ? item.Imagen
          : (item.Imagen ? `img/${item.Imagen}` : 'img/default.jpg');
        buckets[classify(item.Tipo)].push(card(item, imagen));
      });

      if (elComidas) elComidas.innerHTML = buckets.comidas.join('') || '<p>No hay comidas disponibles.</p>';
      if (elBebidas) elBebidas.innerHTML = buckets.bebidas.join('') || '<p>No hay bebidas disponibles.</p>';
      if (elPostres) elPostres.innerHTML = buckets.postres.join('') || '<p>No hay postres disponibles.</p>';
      if (elAll) elAll.innerHTML = [...buckets.comidas, ...buckets.bebidas, ...buckets.postres].join('');

      document.querySelectorAll('.btn-pedir').forEach(btn => {
        btn.addEventListener('click', async (e) => {
          const ok = await requireAuth();
          if (!ok) {
            alert('Inicia sesión para pedir.');
            location.href = `${base}porceso_de_login/login.html`;
            return;
          }
          const producto = {
            id: e.target.dataset.id,
            nombre: e.target.dataset.nombre,
            precio: parseFloat(e.target.dataset.precio),
            imagen: e.target.dataset.imagen,
            cantidad: 1
          };
          agregarAlCarrito(producto);
        });
      });
    })
    .catch(err => {
      console.error(err);
      const errorHtml = '<p>Error al cargar el menú.</p>';
      if (elComidas) elComidas.innerHTML = errorHtml;
      if (elBebidas) elBebidas.innerHTML = errorHtml;
      if (elPostres) elPostres.innerHTML = errorHtml;
      if (elAll) elAll.innerHTML = errorHtml;
    });
});

function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const index = carrito.findIndex(item => item.id === producto.id);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push(producto);
  }
  localStorage.setItem('carrito', JSON.stringify(carrito));
  alert(`${producto.nombre} se agregó al carrito`);
}
