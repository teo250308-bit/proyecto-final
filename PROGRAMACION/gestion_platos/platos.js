document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaPlatos");

  // Modal + form
  const overlay = document.getElementById("modalOverlay");
  const btnAbrir = document.getElementById("btnAbrirModal");
  const btnCerrar = document.getElementById("btnCerrarModal");
  const btnCancelar = document.getElementById("btnCancelar");

  const form = document.getElementById("platoForm");
  const tituloModal = document.getElementById("modalTitle");
  const inputId = document.getElementById("platoId");
  const inputNombre = document.getElementById("nombre");
  const inputDescripcion = document.getElementById("descripcion");
  const inputImagen = document.getElementById("imagen");
  const inputPrecio = document.getElementById("precio");
  const inputTipo = document.getElementById("tipo");
  const imgPreview = document.getElementById("imgPreview");

  let cachePlatos = new Map(); // id -> objeto plato

  // Abrir/Cerrar modal
  const abrirModal = () => overlay.classList.add("open");
  const cerrarModal = () => overlay.classList.remove("open");

  btnAbrir.addEventListener("click", () => {
    // Reset a modo "Agregar"
    tituloModal.textContent = "Agregar Plato";
    form.reset();
    inputId.value = "";
    imgPreview.style.backgroundImage = "";
    abrirModal();
  });

  btnCerrar.addEventListener("click", cerrarModal);
  btnCancelar.addEventListener("click", cerrarModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cerrarModal();
  });

  // Vista previa imagen
  inputImagen.addEventListener("input", () => {
    const url = inputImagen.value.trim();
    imgPreview.style.backgroundImage = url ? `url("${url}")` : "";
  });

  // Cargar lista
  async function cargarPlatos() {
    try {
      const res = await fetch("listar_platos.php");
      const data = await res.json();
      if (!data.success) return;

      cachePlatos.clear();
      tabla.innerHTML = "";
      data.platos.forEach(p => {
        cachePlatos.set(Number(p.Id_producto), p);
        tabla.innerHTML += `
          <tr>
            <td data-label="ID">${p.Id_producto}</td>
            <td data-label="Plato">${p.Nombre}</td>
            <td data-label="Descripción">${p.Descripcion}</td>
            <td data-label="Imagen">
              <img src="${p.Imagen}" width="60" height="60" style="object-fit:cover;border-radius:6px;display:block;margin-bottom:6px;">
              <a href="${p.Imagen}" target="_blank" rel="noopener">Ver</a>
            </td>
            <td data-label="Precio">$ ${p.Precio}</td>
            <td data-label="Tipo">${p.Tipo}</td>
            <td data-label="Acción">
              <div style="display:flex; gap:8px; align-items:center;">
                <button class="btn-secondary" onclick="editarPlato(${p.Id_producto})">✎ Editar</button>
                <button class="btn-danger" onclick="eliminarPlato(${p.Id_producto})">🗑️ Eliminar</button>
              </div>
            </td>
          </tr>
        `;
      });
    } catch (err) {
      console.error("Error al listar platos:", err);
    }
  }

  // Exponer funciones globales para botones
  window.editarPlato = (id) => {
    const p = cachePlatos.get(Number(id));
    if (!p) return;

    // Modo edición
    tituloModal.textContent = `Editar Plato #${p.Id_producto}`;
    inputId.value = p.Id_producto;
    inputNombre.value = p.Nombre;
    inputDescripcion.value = p.Descripcion;
    inputImagen.value = p.Imagen;
    imgPreview.style.backgroundImage = p.Imagen ? `url("${p.Imagen}")` : "";
    inputPrecio.value = p.Precio;
    inputTipo.value = p.Tipo;

    abrirModal();
  };

  window.eliminarPlato = async (id) => {
    if (!confirm("¿Eliminar este plato?")) return;
    try {
      const res = await fetch("eliminar_plato.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) cargarPlatos();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  // Guardar (crear o actualizar)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const payload = {
      id: inputId.value.trim(),
      nombre: inputNombre.value.trim(),
      descripcion: inputDescripcion.value.trim(),
      imagen: inputImagen.value.trim(),
      precio: inputPrecio.value.trim(),
      tipo: inputTipo.value.trim()
    };

    const esEdicion = !!payload.id;
    const url = esEdicion ? "editar_plato_full.php" : "add_plato.php";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        cerrarModal();
        cargarPlatos();
      }
    } catch (err) {
      console.error("Error al guardar:", err);
    }
  });

  // Primera carga
  cargarPlatos();
});
