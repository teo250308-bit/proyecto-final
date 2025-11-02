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
                
                if(data.success=="cliente"){
                    window.location.href = "../m_usuarios/index_usuarios.html";
                } else if(data.success=="admin"){
                    window.location.href = "../m_admin/index_admin.html";
                }  
                
            
            })

        } catch (error) {
            alert("Error de conexión: " + error);
        }
    });

    document.getElementById('loginForm').addEventListener('submit', async (e) => {
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
  alert(data.msg);

  if (data.ok) {
    window.location.href = '../m_usuarios/index_usuarios.html';
  }
});
