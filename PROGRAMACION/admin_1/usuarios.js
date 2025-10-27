// const usuarios = document.getElementById("usuarios")




// document.addEventListener("DOMContentLoaded", () => {
//     fetch("gestion_usuarios.php")
//         .then(res => res.json())
//         .then(data => {
//             console.log(data);
//             tabla =`
//             <table>
//             <thead>
//                 <tr>
//                     <th>ID</th>
//                     <th>Nombre</th>
//                     <th>Correo</th>
//                     <th>Rol</th>
//                     <th>Acciones</th>
//                 </tr>
//             </thead>
//             <tbody>`

//             data.forEach(u => {
//                 tabla += `
//                 <tr>
//                     <td>${u.id}</td>
//                     <td>${u.nombre}</td>
//                     <td>${u.correo}</td>
//                     <td>${u.rol}</td>
//                     <td><button class=botoneliminar onclick=eliminarusuario('${u.id}','${u.rol}')>X</button></td>
//                 </tr>`

//                 // tabla +=fila;
//             });
            
            
//             tabla +=

//                     `
//             </tbody>
//         </table>`

        
//         usuarios.innerHTML += tabla;
//     })
// })


function eliminarusuario(id, rol){
    console.log(rol);
    
    if(rol != "admin"){

        fetch("eliminarusuario.php?id="+id)
        .then(res => res.json())
        .then(data => {
            alert("Usuario eliminado")
            location.reload()
        })
    }else{
        alert("No podes eliminar el adminsitrador")

    }
        

}

// usuarios.js

// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("registerForm");

//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const data = {
//       nombre: form.nombre.value,
//       correo: form.correo.value,
//       pass: form.contrasena.value
//     };

//     try {
//       const response = await fetch("adduser.php", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data)
//       });

//       const result = await response.json();
//       console.log(result);

//       if (result.success) {
//         alert("✅ Usuario agregado correctamente");
//         // Recarga automática 
//           location.reload();
        
//         form.reset();
//       } else {
//         alert("❌ Error: " + result.message);
//       }

//     } catch (error) {
//       console.error("❌ Error de conexión:", error);
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const tabla = document.getElementById("tablaUsuarios");

  // 🟩 Cargar todos los usuarios al inicio
  cargarUsuarios();

  // 🟦 Registrar nuevo usuario
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      nombre: form.nombre.value,
      correo: form.correo.value,
      pass: form.contrasena.value
    };

    try {
      const response = await fetch("adduser.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log(result);

      if (result.success) {
        alert("✅ Usuario agregado correctamente");
        form.reset();
        cargarUsuarios(); // refresca tabla sin recargar toda la página
      } else {
        alert("❌ Error: " + result.message);
      }

    } catch (error) {
      console.error("❌ Error de conexión:", error);
    }
  });

  // 🟨 Función: listar usuarios
  async function cargarUsuarios() {
    try {
      const res = await fetch("listar_usuarios.php");
      const data = await res.json();

      if (data.success) {
        tabla.innerHTML = ""; // limpiar tabla
        data.usuarios.forEach(u => {
          tabla.innerHTML += `
            <tr>
              <td>${u.id}</td>
              <td>${u.nombre}</td>
              <td>${u.correo}</td>
              <td>
                <select onchange="cambiarRol(${u.id}, this.value)">
                  <option value="admin" ${u.rol === "admin" ? "selected" : ""}>Admin</option>
                  <option value="empleado" ${u.rol === "empleado" ? "selected" : ""}>Empleado</option>
                  <option value="cliente" ${u.rol === "cliente" ? "selected" : ""}>Cliente</option>
                </select>
              </td>
              <td>${u.fecha_registro}</td>
              <td><button onclick="eliminarUsuario(${u.id})">🗑️ Eliminar</button></td>
            </tr>
          `;
        });
      }
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
    }
  }

  // 🟥 Eliminar usuario
  window.eliminarUsuario = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

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

  // 🟧 Cambiar rol
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
});









