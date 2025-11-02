document.addEventListener("DOMContentLoaded", () => {
  const tabla = document.getElementById("tablaUsuarios");

  // Modal
  const overlay = document.getElementById("modalOverlay");
  const btnAbrir = document.getElementById("btnAbrirModal");
  const btnCerrar = document.getElementById("btnCerrarModal");
  const btnCancelar = document.getElementById("btnCancelar");

  const form = document.getElementById("usuarioForm");
  const nombre = document.getElementById("nombre");
  const correo = document.getElementById("correo");
  const contrasena = document.getElementById("contrasena");
  const rol = document.getElementById("rol");

  const abrirModal = () => overlay.classList.add("open");
  const cerrarModal = () => overlay.classList.remove("open");

  btnAbrir.addEventListener("click", () => {
    form.reset();
    abrirModal();
  });
  btnCerrar.addEventListener("click", cerrarModal);
  btnCancelar.addEventListener("click", cerrarModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cerrarModal();
  });

  // Cargar usuarios
  async function cargarUsuarios() {
    const res = await fetch("listar_usuarios.php");
    const data = await res.json();
    if (!data.success) return;

    tabla.innerHTML = "";
    data.usuarios.forEach(u => {
      const puedeEliminar = u.rol !== "admin";
      const esAdmin = u.rol === "admin";

      tabla.innerHTML += `
        <tr>
          <td data-label="ID">${u.id}</td>
          <td data-label="Nombre">${u.nombre}</td>
          <td data-label="Correo">${u.correo}</td>
          <td data-label="Rol">
            ${esAdmin ? `
              <span class="badge-admin">Admin</span>
            ` : `
              <select onchange="cambiarRol(${u.id}, this.value)">
                <option value="empleado" ${u.rol === "empleado" ? "selected" : ""}>Empleado</option>
                <option value="cliente" ${u.rol === "cliente" ? "selected" : ""}>Cliente</option>
              </select>
            `}
          </td>
          <td data-label="Fecha">${u.fecha_registro}</td>
          <td data-label="Acción">
            ${puedeEliminar 
              ? `<button class="btn-danger" onclick="eliminarUsuario(${u.id})">🗑️ Eliminar</button>`
              : `<span class="no-delete">Bloqueado</span>`
            }
          </td>
        </tr>
      `;
    });
  }

  // Agregar usuario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nombre: nombre.value.trim(),
      correo: correo.value.trim(),
      contrasena: contrasena.value.trim(),
      rol: rol.value
    };

    try {
      const res = await fetch("add_usuario.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) {
        cerrarModal();
        cargarUsuarios();
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Cambiar rol
  window.cambiarRol = async (id, rol) => {
    try {
      const res = await fetch("cambiar_rol.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, rol })
      });
      const data = await res.json();
      console.log(data.message);
    } catch (err) {
      console.error(err);
    }
  };

  // Eliminar usuario
  window.eliminarUsuario = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      const res = await fetch("eliminar_usuario.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) cargarUsuarios();
    } catch (err) {
      console.error(err);
    }
  };

  cargarUsuarios();
});
