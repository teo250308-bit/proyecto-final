const formLogin = document.getElementById('LoginForm');


 formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(formLogin);
        try {
            fetch('procesar_login.php', {
                method: 'POST',
                body: formData
            })
            // si usan .then el php SIMPRE tiene que devolver JSON
            .then(response => response.json()) 
            .then(data=>{
            
                console.log(data)
                
                if(data.success==="cliente"){
                    try {
                      const nombre = data.nombre || data.usuario || data.email || 'Usuario';
                      localStorage.setItem('user_nombre', nombre);
                    } catch {}
                    Swal.fire({ position: 'center', icon: 'success', title: 'Login exitoso!!' })
                      .then(()=>{ window.location.href = "../m_usuarios/index_usuarios.html"; });
                } else if(data.success==="admin"){
                    Swal.fire({ position: 'center', icon: 'success', title: 'Login exitoso!!' })
                      .then(()=>{ window.location.href = "../m_admin/index_admin.html"; });
                } else {
                    Swal.fire({
                      icon: 'error',
                      title: 'Oops...',
                      text: 'Algo salio mal!!',
                      footer: '<a href="../contacto/contactov2.html">Contactate con nosotros</a>'
                    });
                }  
                
            
            })

        } catch (error) {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Algo salio mal!!',
              footer: '<a href="../contacto/contactov2.html">Contactate con nosotros</a>'
            });
        }
    });

    const loginFormAlt = document.getElementById('loginForm'); if (loginFormAlt) loginFormAlt.addEventListener('submit', async (e) => {
  e.preventDefault();

  const datos = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  const res = await fetch('../autocheck/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
    credentials: 'include'
  });

  const data = await res.json();
  if (data.ok) {
    try {
      const nombre = data.nombre || data.usuario || data.email || 'Usuario';
      localStorage.setItem('user_nombre', nombre);
    } catch {}
    Swal.fire({ position: 'center', icon: 'success', title: 'Login exitoso!!' })
      .then(()=>{ window.location.href = '../m_usuarios/index_usuarios.html'; });
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: data.msg || 'Algo salio mal!!',
      footer: '<a href="../contacto/contactov2.html">Contactate con nosotros</a>'
    });
  }
});

