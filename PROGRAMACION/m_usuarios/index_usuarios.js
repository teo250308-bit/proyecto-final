// const contenido = document.getElementById("contenido-menu");

// document.addEventListener("DOMContentLoaded", () => {
//     fetch("menu.php")
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
        
//         let productos = "";
//         data.forEach(item =>{
//             productos += `      
            
//             <div style="background:url(img/pizza.jpg)center;background-size: cover;" 
//             class="tarjeta-rest">
//         <div class="wrap-text_tarjeta-rest">
//           <h3>${item.Nombre}</h3>
//           <p>
//           ${item.Descripcion}
//           </p>
//           <div class="cta-wrap_tarjeta-rest">
//             <div class="precio_tarjeta-rest">
//               <span>€${item.Precio}</span>
//             </div>
//             <div class="cta_tarjeta-rest">
//               <a href="">Pedir ahora</a>
//             </div>
//           </div>
//         </div>  
//       </div>
//     ` 
//         contenido.innerHTML = productos;
//     })
//     })
// })  

const contenido = document.getElementById("contenido-menu");
const base = '../';

async function requireAuth() {
  try {
    const r = await fetch(`${base}autocheck/auth_check.php`, { credentials: 'include' });
    if (!r.ok) return false;
    const j = await r.json();
    return j.auth === true;
  } catch { return false; }
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("menu.php")
    .then(response => {
      if (!response.ok) throw new Error("Error al cargar los datos del menú");
      return response.json();
    })
    .then(data => {
      let productos = "";

      data.forEach((item, index) => {
        // Determinar imagen correcta
        let imagen;
        if (item.Imagen && item.Imagen.startsWith("http")) {
          imagen = item.Imagen;
        } else if (item.Imagen) {
          imagen = `../img/${item.Imagen}`;
        } else {
          imagen = "../img/default.jpg";
        }

        // Crear tarjeta
        productos += `
          <div style="background:url('${imagen}') center/cover;" class="tarjeta-rest">
            <div class="wrap-text_tarjeta-rest">
              <h3>${item.Nombre}</h3>
              <p>${item.Descripcion}</p>
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

      contenido.innerHTML = productos;

      // Activar eventos para cada botón
      document.querySelectorAll(".btn-pedir").forEach(btn => {
        btn.addEventListener("click", async (e) => {
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
      contenido.innerHTML = "<p>Error al cargar el menú.</p>";
    });
});

// --- Función para agregar al carrito ---
function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  // Verificar si ya existe en el carrito
  const index = carrito.findIndex(item => item.id === producto.id);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push(producto);
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${producto.nombre} se agregó al carrito 🛒`);
}


// // --- Función para agregar al carrito ---
// function agregarAlCarrito(producto) {
//   let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

//   // Verificar si ya existe en el carrito
//   const index = carrito.findIndex(item => item.id === producto.id);
//   if (index !== -1) {
//     carrito[index].cantidad += 1;
//   } else {
//     carrito.push(producto);
//   }

//   localStorage.setItem("carrito", JSON.stringify(carrito));
//   alert(`${producto.nombre} se agregó al carrito 🛒`);
// }


