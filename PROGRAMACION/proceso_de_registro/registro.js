
    const formReg = document.getElementById('registerForm');
document.addEventListener('DOMContentLoaded', function() {
    if (!formReg) return;

});

 formReg.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(formReg);
        try {
            fetch('procesar_registro.php', {
                method: 'POST',
                body: formData
            })
            // si usan .then el php SIMPRE tiene que devolver JSON
            .then(response => response.json()) 
            .then(data=>{
                console.log(data)
                if(data.success){
                    Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Your work has been saved",
                    showConfirmButton: false,
                    timer: 1500
                    });
                    setTimeout(() => {
                        window.location.href = "login.html"}, 1600);
                } else {
                    alert(data);
                }
                
            })

        } catch (error) {
            alert("Error de conexión: " + error);
        }
    });