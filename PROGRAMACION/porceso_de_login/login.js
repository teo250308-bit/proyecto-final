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
                    window.location.href = "index_usuarios.html";
                } else if(data.success=="admin"){
                    window.location.href = "index_admin.html";
                }  
                
            
            })

        } catch (error) {
            alert("Error de conexión: " + error);
        }
    });