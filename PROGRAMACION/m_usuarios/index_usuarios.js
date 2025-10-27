const contenido = document.getElementById("contenido-menu");

document.addEventListener("DOMContentLoaded", () => {
    fetch("menu.php")
    .then(response => response.json())
    .then(data => {
        console.log(data);
        
        let productos = "";
        data.forEach(item => {
            productos += `      
            
            <div style="background:url(img/pizza.jpg)center;background-size: cover;" 
            class="tarjeta-rest">
        <div class="wrap-text_tarjeta-rest">
          <h3>${item.Nombre}</h3>
          <p>
          ${item.Descripcion}
          </p>
          <div class="cta-wrap_tarjeta-rest">
            <div class="precio_tarjeta-rest">
              <span>€${item.Precio}</span>
            </div>
            <div class="cta_tarjeta-rest">
              <a href="">Pedir ahora</a>
            </div>
          </div>
        </div>  
      </div>
    ` 
        contenido.innerHTML = productos;
    })
    })
})          
