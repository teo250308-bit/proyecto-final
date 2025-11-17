const contenido = document.getElementById('contenido-menu');
const base = '../';
const encode = (value = '') => encodeURIComponent((value ?? '').toString());

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

function hydrateMiniCart() {
  const chip = document.getElementById('mini-cart');
  if (!chip) return;
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const items = carrito.reduce((acc, it) => acc + (it.cantidad || 1), 0);
  const total = carrito.reduce((acc, it) => acc + (it.precio || 0) * (it.cantidad || 1), 0);
  chip.textContent = `Carrito: ${items} items - $${total}`;
}

function clasificar(tipo) {
  const v = (tipo || '').toString().toLowerCase();
  if (v.includes('postre') || v.includes('dulce')) return 'postres';
  if (v.includes('bebida') || v.includes('jugo') || v.includes('trago')) return 'bebidas';
  return 'comidas';
}

function imagenParaFondo(path) {
  if (!path) return '../img/default.jpg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('./img/')) return `../${path.slice(2)}`;
  if (path.startsWith('img/')) return `../${path}`;
  return `../img/${path}`;
}

function imagenParaCarrito(path) {
  if (!path) return 'img/default.jpg';
  if (path.startsWith('http')) return path;
  if (path.startsWith('./img/')) return path.replace(/^\.\//, '');
  if (path.startsWith('img/')) return path;
  return `img/${path}`;
}

document.addEventListener('DOMContentLoaded', async () => {
  // Set nombre desde sesión o localStorage
  try {
    const r = await fetch(`${base}autocheck/auth_check.php`, { credentials: 'include' });
    if (r.ok) {
      const j = await r.json();
      const nombreSrv = j && (j.nombre || j.usuario || j.username || j.email);
      if (nombreSrv) {
        const span = document.getElementById('user-nombre');
        if (span) span.textContent = nombreSrv;
      }
    }
  } catch {}
  if (document.getElementById('user-nombre') && document.getElementById('user-nombre').textContent === 'Usuario') {
    try {
      const nombreLS = localStorage.getItem('user_nombre');
      if (nombreLS) document.getElementById('user-nombre').textContent = nombreLS;
    } catch {}
  }

  try {
    const response = await fetch('menu.php');
    if (!response.ok) throw new Error('Error al cargar los datos del men\u00FA');
    const data = await response.json();

    let html = '';
    (Array.isArray(data) ? data : []).forEach(item => {
      const imgBg = imagenParaFondo(item.Imagen || '');
      const imgCart = imagenParaCarrito(item.Imagen || '');
      const tipo = clasificar(item.Tipo);
      html += `
        <div style="background:url('${imgBg}') center/cover;" class="tarjeta-rest" data-tipo="${tipo}">
          <div class="wrap-text_tarjeta-rest">
            <h3>${item.Nombre}</h3>
            <p>${item.Descripcion ?? ''}</p>
            <div class="cta-wrap_tarjeta-rest">
              <div class="precio_tarjeta-rest">
                <span>$${item.Precio}</span>
              </div>
              <div class="cta_tarjeta-rest">
                <button class="btn-detalle"
                        data-id="${item.Id_producto}"
                        data-nombre="${item.Nombre}"
                        data-precio="${item.Precio}"
                        data-descripcion="${encode(item.Descripcion ?? '')}">
                  Ver más
                </button>
                <button class="btn-pedir"
                        data-id="${item.Id_producto}"
                        data-nombre="${item.Nombre}"
                        data-precio="${item.Precio}"
                        data-imagen="${imgCart}">
                  Pedir ahora🍽️
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    });
    if (contenido) contenido.innerHTML = html || '<p>No hay productos para mostrar.</p>';

    document.querySelectorAll('.btn-detalle').forEach(btn => {
      btn.addEventListener('click', () => {
        const nombre = btn.dataset.nombre || 'Plato';
        const descripcion = decodeURIComponent(btn.dataset.descripcion || '');
        const precio = parseFloat(btn.dataset.precio || '0');
        const content = `${descripcion || 'Sin descripción disponible.'}<br><br><strong>Precio:</strong> $${precio}`;
        if (typeof Swal !== 'undefined') {
          Swal.fire({
            title: nombre,
            html: content,
            confirmButtonText: 'Cerrar',
            width: 600,
          });
        } else {
          alert(`${nombre}\n\n${descripcion}\n\nPrecio: $${precio}`);
        }
      });
    });

    document.querySelectorAll('.btn-pedir').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const ok = await requireAuth();
        if (!ok) {
          if (typeof Swal !== 'undefined') {
            Swal.fire({
              icon: 'info',
              title: 'Inicia sesi\u00F3n',
              text: 'Necesitas iniciar sesi\u00F3n para pedir.',
              showCancelButton: true,
              confirmButtonText: 'Iniciar sesi\u00F3n',
              cancelButtonText: 'Cancelar'
            }).then(res => { if (res.isConfirmed) location.href = `${base}porceso_de_login/login.html`; });
          } else {
            alert('Necesitas iniciar sesi\u00F3n para pedir.');
            location.href = `${base}porceso_de_login/login.html`;
          }
          return;
        }
        const target = e.currentTarget;
        const producto = {
          id: target.dataset.id,
          nombre: target.dataset.nombre,
          precio: parseFloat(target.dataset.precio),
          imagen: target.dataset.imagen,
          cantidad: 1
        };
        agregarAlCarrito(producto);
      });
    });

    // Filtros
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.getAttribute('data-filter');
        document.querySelectorAll('#contenido-menu .tarjeta-rest').forEach(card => {
          if (f === 'todos') {
            card.style.display = '';
          } else {
            card.style.display = (card.getAttribute('data-tipo') === f) ? '' : 'none';
          }
        });
      });
    });

    hydrateMiniCart();
  } catch (err) {
    console.error(err);
    if (contenido) contenido.innerHTML = '<p>Error al cargar el men\u00FA.</p>';
  }
});

function agregarAlCarrito(producto) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const idx = carrito.findIndex(it => it.id === producto.id);
  if (idx !== -1) carrito[idx].cantidad += 1; else carrito.push(producto);
  localStorage.setItem('carrito', JSON.stringify(carrito));

  if (typeof Swal !== 'undefined') {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: `${producto.nombre} se agregó al carrito 🛒`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true
    });
  } else {
    alert(`${producto.nombre} se agregó al carrito`);
  }
  hydrateMiniCart();
}



