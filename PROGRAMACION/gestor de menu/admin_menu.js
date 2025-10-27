$(document).ready(function() {
    // Función para cargar/refrescar la lista de productos
    function cargarProductos(searchTerm = '') {
        $.ajax({
            url: 'admin_menu.php',
            type: 'GET',
            data: { action: 'read', search: searchTerm },
            dataType: 'json',
            success: function(response) {
                let html = '';
                if (response.success && response.productos.length > 0) {
                    response.productos.forEach(producto => {
                        html += `
                            <tr>
                                <td>${producto.Id_producto}</td>
                                <td><img src="${producto.Imagen || 'placeholder.png'}" class="product-img img-thumbnail" alt="Imagen"></td>
                                <td>${producto.Nombre}</td>
                                <td>${producto.Descripcion}</td>
                                <td>${producto.Precio}</td>
                                <td>${producto.Tipo}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm btn-edit" data-id="${producto.Id_producto}" data-bs-toggle="modal" data-bs-target="#modalEditar">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="btn btn-danger btn-sm btn-delete" data-id="${producto.Id_producto}" data-nombre="${producto.Nombre}" data-bs-toggle="modal" data-bs-target="#modalEliminar">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                } else {
                    html = `<tr><td colspan="7" class="text-center">${response.message || 'No se encontraron platos.'}</td></tr>`;
                }
                $('#tablaProductos').html(html);
            },
            error: function(xhr, status, error) {
                alert('Error al cargar productos: ' + error);
            }
        });
    }

    // Cargar productos al iniciar
    cargarProductos();

    // Evento de Búsqueda
    $('#btnBuscar').on('click', function() {
        const searchTerm = $('#inputBuscar').val();
        cargarProductos(searchTerm);
    });

    // Evento de Agregar Producto (CREATE)
    $('#formAgregarProducto').on('submit', function(e) {
        e.preventDefault();
        const formData = $(this).serialize() + '&action=create';

        $.ajax({
            url: 'admin_menu.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert('Plato agregado con éxito!');
                    $('#modalAgregar').modal('hide');
                    $('#formAgregarProducto')[0].reset();
                    cargarProductos();
                } else {
                    alert('Error al agregar plato: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                alert('Error en la petición de agregar: ' + error);
            }
        });
    });

    // Evento para cargar datos en el Modal de Edición (antes de UPDATE)
    $('#tablaProductos').on('click', '.btn-edit', function() {
        const id = $(this).data('id');
        // Buscar el producto en la tabla (o hacer otra llamada AJAX para obtener 1 producto)
        // Por simplicidad, aquí haremos una búsqueda directa en la fila para el ejemplo:
        const $row = $(this).closest('tr');
        $('#id_producto_edit').val(id);
        $('#nombre_edit').val($row.find('td:eq(2)').text());
        $('#descripcion_edit').val($row.find('td:eq(3)').text());
        $('#precio_edit').val($row.find('td:eq(4)').text());
        // La imagen y el tipo requerirían una llamada separada para ser precisos si solo se lee de la tabla
        // Asumiendo que se carga la URL/nombre desde el atributo 'src' de la imagen o una llamada GET específica
        // Para la imagen:
        const imgSrc = $row.find('.product-img').attr('src');
        $('#imagen_edit').val(imgSrc !== 'placeholder.png' ? imgSrc : ''); // Si es el placeholder, dejar vacío
        $('#tipo_edit').val($row.find('td:eq(5)').text());
    });

    // Evento de Editar Producto (UPDATE)
    $('#formEditarProducto').on('submit', function(e) {
        e.preventDefault();
        const formData = $(this).serialize() + '&action=update';

        $.ajax({
            url: 'admin_menu.php',
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert('Plato actualizado con éxito!');
                    $('#modalEditar').modal('hide');
                    cargarProductos();
                } else {
                    alert('Error al actualizar plato: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                alert('Error en la petición de actualización: ' + error);
            }
        });
    });

    // Evento para cargar datos en el Modal de Eliminación (antes de DELETE)
    $('#tablaProductos').on('click', '.btn-delete', function() {
        const id = $(this).data('id');
        const nombre = $(this).data('nombre');
        $('#id_producto_delete').val(id);
        $('#nombreProductoEliminar').text(nombre);
    });

    // Evento de Confirmar Eliminación (DELETE)
    $('#btnConfirmarEliminar').on('click', function() {
        const id = $('#id_producto_delete').val();
        
        $.ajax({
            url: 'admin_menu.php',
            type: 'POST',
            data: { action: 'delete', Id_producto: id },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    alert('Plato eliminado con éxito!');
                    $('#modalEliminar').modal('hide');
                    cargarProductos();
                } else {
                    alert('Error al eliminar plato: ' + response.message);
                }
            },
            error: function(xhr, status, error) {
                alert('Error en la petición de eliminación: ' + error);
            }
        });
    });
});