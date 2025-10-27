let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let total = JSON.parse(localStorage.getItem("total")) || 0;

mostrarCarrito();

function agregarCarrito(plato, precio) {
  carrito.push({ plato, precio });
  total += precio;
  guardarEnLocalStorage();
  mostrarCarrito();
}

function mostrarCarrito() {
  const lista = document.getElementById("listaCarrito");
  lista.innerHTML = "";

  carrito.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = `${item.plato} - ${item.precio} €`;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "❌";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.onclick = () => eliminarPlato(index);

    li.appendChild(btnEliminar);
    lista.appendChild(li);
  });

  document.getElementById("total").textContent = total;
}

function eliminarPlato(index) {
  total -= carrito[index].precio;
  carrito.splice(index, 1);
  guardarEnLocalStorage();
  mostrarCarrito();
}

function vaciarCarrito() {
  carrito = [];
  total = 0;
  guardarEnLocalStorage();
  mostrarCarrito();
}

function guardarEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  localStorage.setItem("total", JSON.stringify(total));
}
