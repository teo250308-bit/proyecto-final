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
      .then(response => response.json())
      .then(data => {
        console.log(data);
        if (data.success) {
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Registro exitoso!!',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            window.location.href = '../porceso_de_login/login.html';
          }, 1600);
        } else {
          alert(data.msg || 'Error en el registro');
        }
      });
  } catch (error) {
    alert('Error de conexion: ' + error);
  }
});

