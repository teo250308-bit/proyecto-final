function mostrarAlerta({ icon = 'info', title = 'Aviso', text = '', footer = null }) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({ icon, title, text, footer });
  } else {
    alert(text || title);
  }
}

function guardarNombre(data) {
  try {
    const nombre = data?.nombre || data?.usuario || data?.email || 'Usuario';
    localStorage.setItem('user_nombre', nombre);
  } catch (_) {}
}

async function enviarLogin(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);

  try {
    const response = await fetch('procesar_login.php', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    let data = null;
    try {
      data = await response.json();
    } catch (_) {
      throw new Error('La respuesta del servidor no es v\u00E1lida.');
    }

    if (!response.ok) {
      throw new Error((data && (data.Error || data.msg)) || 'No se pudo iniciar sesi\u00F3n.');
    }

    if (data.success === 'cliente') {
      guardarNombre(data);
      mostrarAlerta({ icon: 'success', title: 'Login exitoso!!' });
      setTimeout(() => { window.location.href = '../m_usuarios/index_usuarios.html'; }, 500);
      return;
    }

    if (data.success === 'admin') {
      guardarNombre(data);
      mostrarAlerta({ icon: 'success', title: 'Login exitoso!!' });
      setTimeout(() => { window.location.href = '../m_admin/index_admin.html'; }, 500);
      return;
    }

    throw new Error((data && (data.Error || data.msg)) || 'Credenciales inv\u00E1lidas.');
  } catch (error) {
    mostrarAlerta({
      icon: 'error',
      title: 'Oops...',
      text: error.message || 'Algo sali\u00F3 mal!!',
      footer: '<a href="../contacto/contactov2.html">Contactate con nosotros</a>'
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const formLogin = document.getElementById('LoginForm');
  if (formLogin) {
    formLogin.addEventListener('submit', enviarLogin);
  }

  const loginFormAlt = document.getElementById('loginForm');
  if (loginFormAlt) {
    loginFormAlt.addEventListener('submit', async (e) => {
      e.preventDefault();
      const datos = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
      };

      try {
        const res = await fetch('../autocheck/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(datos),
          credentials: 'include'
        });
        const data = await res.json();
        if (data.ok) {
          guardarNombre(data);
          mostrarAlerta({ icon: 'success', title: 'Login exitoso!!' });
          setTimeout(() => { window.location.href = '../m_usuarios/index_usuarios.html'; }, 500);
        } else {
          throw new Error(data.msg || 'Algo sali\u00F3 mal!!');
        }
      } catch (err) {
        mostrarAlerta({
          icon: 'error',
          title: 'Oops...',
          text: err.message || 'Algo sali\u00F3 mal!!',
          footer: '<a href="../contacto/contactov2.html">Contactate con nosotros</a>'
        });
      }
    });
  }
});
