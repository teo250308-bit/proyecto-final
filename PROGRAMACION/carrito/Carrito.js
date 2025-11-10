const contenedor = document.getElementById('carrito-contenido');
const modal = document.getElementById('modal-pago');
const closeBtn = document.querySelector('.close-btn');
const formPago = document.getElementById('form-pago');
const metodoPago = document.getElementById('metodo');
const datosTarjeta = document.getElementById('datos-tarjeta');

document.addEventListener('DOMContentLoaded', () => {
  mostrarCarrito();
});

function normalizarImagen(url) {
  if (!url) return '../img/default.jpg';
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('../img/')) return url;
  if (url.startsWith('./img/')) return `../${url.slice(2)}`;
  if (url.startsWith('img/')) return `../${url}`;
  if (url.startsWith('/')) return url;
  return `../img/${url}`;
}

function mostrarCarrito() {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  if (carrito.length === 0) {
    contenedor.innerHTML = '<p>Tu carrito está vacío.</p>';
    return;
  }

  let html = `
    <table style="width:100%; border-collapse:collapse; text-align:center;">
      <thead>
        <tr style="background:#FFC300; color:#fff;">
          <th>Imagen</th>
          <th>Producto</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Subtotal</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
  `;

  let total = 0;
  carrito.forEach((item, index) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    html += `
      <tr>
        <td data-label="Imagen"><img src="${normalizarImagen(item.imagen)}" width="80" height="80" style="border-radius:8px;object-fit:cover;"></td>
        <td data-label="Producto">${item.nombre}</td>
        <td data-label="Precio">$${item.precio}</td>
        <td data-label="Cantidad">
          <button onclick="cambiarCantidad(${index}, -1)" aria-label="Restar">➖</button>
          ${item.cantidad}
          <button onclick="cambiarCantidad(${index}, 1)" aria-label="Sumar">➕</button>
        </td>
        <td data-label="Subtotal"><strong>$${subtotal}</strong></td>
        <td data-label="Acciones"><button onclick="eliminarProducto(${index})" style="color:red;">Eliminar</button></td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>
    <h3 style="margin-top:20px;">Total: $${total}</h3>
    <button onclick="abrirPago()" class="btn-pagar" style="
      background-color:#4CAF50;
      color:white;
      padding:10px 20px;
      border:none;
      border-radius:5px;
      cursor:pointer;
      font-size:1rem;">
      Procesar pedido
    </button>
    <button onclick="vaciarCarrito()" style="
      background-color:#e74c3c;
      color:white;
      padding:10px 20px;
      border:none;
      border-radius:5px;
      cursor:pointer;
      font-size:1rem;
      margin-left:10px;">
      Vaciar carrito
    </button>
  `;

  contenedor.innerHTML = html;
}

function cambiarCantidad(index, cambio) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

function eliminarProducto(index) {
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  mostrarCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem('carrito');
  mostrarCarrito();
}

async function checkAuthCart() {
  try {
    const r = await fetch('../autocheck/auth_check.php', { credentials: 'include' });
    if (!r.ok) return false;
    const j = await r.json();
    return j.auth === true;
  } catch { return false; }
}

async function abrirPago() {
  const ok = await checkAuthCart();
  if (!ok) {
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        icon: 'info',
        title: 'Inicia sesión',
        text: 'Necesitas iniciar sesión para finalizar tu compra.',
        showCancelButton: true,
        confirmButtonText: 'Iniciar sesión',
        cancelButtonText: 'Cancelar'
      }).then(res => { if (res.isConfirmed) location.href = '../porceso_de_login/login.html'; });
    } else {
      alert('Necesitas iniciar sesión para finalizar tu compra.');
      location.href = '../porceso_de_login/login.html';
    }
    return;
  }
  if (modal) modal.style.display = 'flex';
}

if (closeBtn) closeBtn.onclick = () => { if (modal) modal.style.display = 'none'; };
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

if (metodoPago) {
  metodoPago.addEventListener('change', () => {
    if (datosTarjeta) datosTarjeta.style.display = metodoPago.value === 'tarjeta' ? 'block' : 'none';
  });
}

if (formPago) {
  formPago.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const metodo = metodoPago ? metodoPago.value : '';
    if (!nombre || !correo || !metodo) {
      alert('Por favor, completa todos los campos.');
      return;
    }
    alert(`Listo. ¡Gracias, ${nombre}! Tu pago con método "${metodo}" fue procesado con éxito.`);
    localStorage.removeItem('carrito');
    if (modal) modal.style.display = 'none';
    mostrarCarrito();
  });
}

