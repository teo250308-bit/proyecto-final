// const contenedor = document.getElementById("carrito-contenido");

// document.addEventListener("DOMContentLoaded", () => {
//   mostrarCarrito();
// });

// // --- Función para mostrar el carrito ---
// function mostrarCarrito() {
//   let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//   if (carrito.length === 0) {
//     contenedor.innerHTML = "<p>Tu carrito está vacío 🛍️</p>";
//     return;
//   }

//   let html = `
//     <table style="width:100%; border-collapse:collapse; text-align:center;">
//       <thead>
//         <tr style="background:#FFC300; color:#fff;">
//           <th>Imagen</th>
//           <th>Producto</th>
//           <th>Precio</th>
//           <th>Cantidad</th>
//           <th>Subtotal</th>
//           <th>Acciones</th>
//         </tr>
//       </thead>
//       <tbody>
//   `;

//   let total = 0;

//   carrito.forEach((item, index) => {
//     const subtotal = item.precio * item.cantidad;
//     total += subtotal;

//     html += `
//       <tr style="border-bottom:1px solid #ddd;">
//         <td><img src="${item.imagen}" width="80" height="80" style="border-radius:8px;"></td>
//         <td>${item.nombre}</td>
//         <td>$${item.precio}</td>
//         <td>
//           <button onclick="cambiarCantidad(${index}, -1)">➖</button>
//           ${item.cantidad}
//           <button onclick="cambiarCantidad(${index}, 1)">➕</button>
//         </td>
//         <td><strong>$${subtotal}</strong></td>
//         <td><button onclick="eliminarProducto(${index})" style="color:red;">❌</button></td>
//       </tr>
//     `;
//   });

//   html += `
//       </tbody>
//     </table>
//     <h3 style="margin-top:20px;">Total: $${total}</h3>
//     <button onclick="procesarPedido()" style="
//       background-color:#4CAF50;
//       color:white;
//       padding:10px 20px;
//       border:none;
//       border-radius:5px;
//       cursor:pointer;
//       font-size:1rem;">
//       Procesar pedido
//     </button>
//     <button onclick="vaciarCarrito()" style="
//       background-color:#e74c3c;
//       color:white;
//       padding:10px 20px;
//       border:none;
//       border-radius:5px;
//       cursor:pointer;
//       font-size:1rem;
//       margin-left:10px;">
//       Vaciar carrito
//     </button>
//   `;

//   contenedor.innerHTML = html;
// }

// // --- Cambiar cantidad ---
// function cambiarCantidad(index, cambio) {
//   let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
//   carrito[index].cantidad += cambio;

//   if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
//   localStorage.setItem("carrito", JSON.stringify(carrito));
//   mostrarCarrito();
// }

// // --- Eliminar producto ---
// function eliminarProducto(index) {
//   let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
//   carrito.splice(index, 1);
//   localStorage.setItem("carrito", JSON.stringify(carrito));
//   mostrarCarrito();
// }

// // --- Vaciar carrito ---
// function vaciarCarrito() {
//   localStorage.removeItem("carrito");
//   mostrarCarrito();
// }

// // --- Procesar pedido ---
// function procesarPedido() {
//   const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
//   if (carrito.length === 0) {
//     alert("Tu carrito está vacío 😅");
//     return;
//   }

//   // Podríamos enviar los datos al backend con fetch si tuvieras una tabla 'Pedidos'
//   alert("✅ Pedido procesado correctamente. ¡Gracias por tu compra!");
//   localStorage.removeItem("carrito");
//   mostrarCarrito();
// }
const contenedor = document.getElementById("carrito-contenido");
const modal = document.getElementById("modal-pago");
const closeBtn = document.querySelector(".close-btn");
const formPago = document.getElementById("form-pago");
const metodoPago = document.getElementById("metodo");
const datosTarjeta = document.getElementById("datos-tarjeta");

document.addEventListener("DOMContentLoaded", () => {
  mostrarCarrito();
});

// --- Mostrar carrito ---
function mostrarCarrito() {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p>Tu carrito está vacío 🛍️</p>";
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
      <td data-label="Imagen"><img src="${item.imagen}" width="80" height="80"></td>
      <td data-label="Producto">${item.nombre}</td>
      <td data-label="Precio">$${item.precio}</td>
      <td data-label="Cantidad">
        <button onclick="cambiarCantidad(${index}, -1)">➖</button>
        ${item.cantidad}
        <button onclick="cambiarCantidad(${index}, 1)">➕</button>
      </td>
      <td data-label="Subtotal"><strong>$${subtotal}</strong></td>
      <td data-label="Acciones"><button onclick="eliminarProducto(${index})" style="color:red;">❌</button></td>
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

// --- Funciones de carrito ---
function cambiarCantidad(index, cambio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito[index].cantidad += cambio;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function eliminarProducto(index) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function vaciarCarrito() {
  localStorage.removeItem("carrito");
  mostrarCarrito();
}

// --- Modal de pago ---
function abrirPago() {
  modal.style.display = "flex";
}

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

// --- Mostrar campos de tarjeta si corresponde ---
metodoPago.addEventListener("change", () => {
  datosTarjeta.style.display = metodoPago.value === "tarjeta" ? "block" : "none";
});

// --- Procesar pago ---
formPago.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const metodo = metodoPago.value;
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  if (!nombre || !correo || !metodo) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  // Aquí podríamos enviar los datos a PHP si tuvieras backend.
  alert(`✅ Gracias ${nombre}! Tu pago con método "${metodo}" fue procesado con éxito.`);

  localStorage.removeItem("carrito");
  modal.style.display = "none";
  mostrarCarrito();
});
