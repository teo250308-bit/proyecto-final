const contenedor = document.getElementById('contenido-menu');

document.addEventListener('DOMContentLoaded', () => {
  if (!contenedor) return;

  fetch('m_usuarios/menu.php')
    .then(r => {
      if (!r.ok) throw new Error('Error al cargar el menú');
      return r.json();
    })
    .then(data => {
      let html = '';

      data.forEach(item => {
        const imagen = item.Imagen && item.Imagen.startsWith('http')
          ? item.Imagen
          : (item.Imagen ? `img/${item.Imagen}` : 'img/default.jpg');

        html += `
          <div style="background:url('${imagen}') center/cover;" class="tarjeta-rest">
            <div class="wrap-text_tarjeta-rest">
              <h3>${item.Nombre}</h3>
              <p>${item.Descripcion ?? ''}</p>
              <div class="cta-wrap_tarjeta-rest">
                <div class="precio_tarjeta-rest">
                  <span>$${item.Precio}</span>
                </div>
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
          </div>
        `;
      });

      contenedor.innerHTML = html;

      document.querySelectorAll('.btn-pedir').forEach(btn => {
        btn.addEventListener('click', (e) => {
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
      contenedor.innerHTML = '<p>Error al cargar el menú.</p>';
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

