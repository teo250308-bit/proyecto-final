const API = "api";

async function fetchJSON(path, options = {}) {
    const res = await fetch(`${API}/${path}`, options);
    return res.json();
}

async function cargarUsuarios() {
    const tbody = document.querySelector("#tablaUsuarios tbody");
    tbody.innerHTML = "<tr><td colspan='5'>Cargando...</td></tr>";
    try {
        const res = await fetchJSON("list.php");
        if (res.success) {
            tbody.innerHTML = "";
            res.data.forEach(u => {
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${u.id}</td>
                    <td>${escapeHtml(u.nombre)}</td>
                    <td>${escapeHtml(u.email)}</td>
                    <td>
                        <select data-id="${u.id}" class="selectRol">
                            <option value="usuario" ${u.rol==='usuario'?'selected':''}>Usuario</option>
                            <option value="administrador" ${u.rol==='administrador'?'selected':''}>Administrador</option>
                            <option value="empleado" ${u.rol==='empleado'?'selected':''}>Empleado</option>
                        </select>
                    </td>
                    <td>
                        <button class="accion delete" data-id="${u.id}">Eliminar</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
            attachEvents();
        } else {
            document.getElementById("mensajeTabla").textContent = "Error al cargar usuarios.";
        }
    } catch (e) {
        document.getElementById("mensajeTabla").textContent = "Error de conexión.";
    }
}

function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
}

function attachEvents() {
    document.querySelectorAll(".delete").forEach(btn => {
        btn.onclick = async () => {
            const id = btn.dataset.id;
            if (!confirm("¿Eliminar usuario #"+id+"?")) return;
            try {
                const res = await fetchJSON("delete.php", {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({id: parseInt(id)})
                });
                if (res.success) cargarUsuarios();
                else alert(res.message || "Error al eliminar");
            } catch (e) { alert("Error de conexión"); }
        };
    });

    document.querySelectorAll(".selectRol").forEach(sel => {
        sel.onchange = async () => {
            const id = parseInt(sel.dataset.id);
            const rol = sel.value;
            try {
                const res = await fetchJSON("update_role.php", {
                    method: "POST",
                    headers: {"Content-Type":"application/json"},
                    body: JSON.stringify({id, rol})
                });
                if (!res.success) alert(res.message || "Error al actualizar rol");
            } catch (e) { alert("Error de conexión"); }
        };
    });
}

document.getElementById("formAgregar").addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value.trim();
    const email  = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const rol = document.getElementById("rol").value;
    document.getElementById("mensajeAgregar").textContent = "Agregando...";

    try {
        const res = await fetchJSON("add.php", {
            method: "POST",
            headers: {"Content-Type":"application/json"},
            body: JSON.stringify({nombre, email, password, rol})
        });
        if (res.success) {
            document.getElementById("mensajeAgregar").textContent = "Usuario agregado";
            document.getElementById("formAgregar").reset();
            cargarUsuarios();
        } else {
            document.getElementById("mensajeAgregar").textContent = res.message || "Error al agregar";
        }
    } catch (e) {
        document.getElementById("mensajeAgregar").textContent = "Error de conexión";
    }
});

// carga inicial
cargarUsuarios();
