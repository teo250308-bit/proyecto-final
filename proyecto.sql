drop database if exists proyecto;
create database proyecto;
use proyecto;

CREATE TABLE Usuario (
    Id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    Nombre VARCHAR(100),
    Correo VARCHAR(100),
    Rol VARCHAR(50),
    Estado VARCHAR(50),
    pass VARCHAR (255)
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'empleado', 'cliente') DEFAULT 'cliente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Cliente (
    Id_usuario INT PRIMARY KEY,
    Comentarios TEXT,
    Restricciones_alimenticias TEXT,
    FOREIGN KEY (Id_usuario) REFERENCES Usuario(Id_usuario)
);

CREATE TABLE Producto (
    Id_producto INT PRIMARY KEY auto_increment,
    Nombre VARCHAR(100),
    Descripcion TEXT,
    Imagen TEXT,
    Precio Int,
    Tipo VARCHAR(50)
);

CREATE TABLE Ingrediente (
    Id_ingrediente INT PRIMARY KEY,
    Nombre VARCHAR(100),
    Unidad VARCHAR(50),
    Gramos_Litros DECIMAL(10,2),
    Stock_actual INT,
    Stock_minimo INT,
    Fecha_vencimiento DATE,
    Calorias INT,
    Grasas INT,
    Proteinas INT,
    Carbohidratos INT,
    Mililitros DECIMAL(10,2)
);

CREATE TABLE Producto_Ingrediente (
    Id_producto INT,
    Id_ingrediente INT,
    Cantidad_por_defecto DECIMAL(10,2),
    PRIMARY KEY (Id_producto, Id_ingrediente),
    FOREIGN KEY (Id_producto) REFERENCES Producto(Id_producto),
    FOREIGN KEY (Id_ingrediente) REFERENCES Ingrediente(Id_ingrediente)
);

CREATE TABLE Pedido (
    Id_pedido INT PRIMARY KEY,
    Id_usuario INT,
    Fecha_hora TIMESTAMP,
    Estado VARCHAR(50),
    FOREIGN KEY (Id_usuario) REFERENCES Usuario(Id_usuario)
);

CREATE TABLE Detalle_pedido (
    Id_detalle INT PRIMARY KEY,
    Id_pedido INT,
    Id_producto INT,
    Cantidad INT,
    Subtotal DECIMAL(10,2),
    FOREIGN KEY (Id_pedido) REFERENCES Pedido(Id_pedido),
    FOREIGN KEY (Id_producto) REFERENCES Producto(Id_producto)
);

CREATE TABLE Detalle_Ingrediente_Personalizado (
    Id_detalle INT,
    Id_ingrediente INT,
    gramos DECIMAL(10,2),
    PRIMARY KEY (Id_detalle, Id_ingrediente),
    FOREIGN KEY (Id_detalle) REFERENCES Detalle_pedido(Id_detalle),
    FOREIGN KEY (Id_ingrediente) REFERENCES Ingrediente(Id_ingrediente)
);

CREATE TABLE Factura (
    Id_factura INT PRIMARY KEY,
    Id_pedido INT,
    Metodo_pago VARCHAR(20),
    Propina DECIMAL(10,2),
    Fecha DATE,
    FOREIGN KEY (Id_pedido) REFERENCES Pedido(Id_pedido)
);

CREATE TABLE Comentario (
    Id_comentario INT PRIMARY KEY,
    Id_producto INT,
    Id_usuario INT,
    Estrellas INT,
    Texto TEXT,
    Fecha DATE,
    FOREIGN KEY (Id_producto) REFERENCES Producto(Id_producto),
    FOREIGN KEY (Id_usuario) REFERENCES Usuario(Id_usuario)
);

CREATE TABLE Mesa (
    Id_mesa INT PRIMARY KEY,
    Capacidad INT,
    Disponibilidad BOOLEAN
);

CREATE TABLE Reserva (
    Id_reserva INT PRIMARY KEY,
    Id_usuario INT,
    Id_mesa INT,
    Fecha DATE,
    Hora TIME,
    Cantidad_personas INT,
    Estado VARCHAR(50),
    Ubicacion VARCHAR(100),
    FOREIGN KEY (Id_usuario) REFERENCES Usuario(Id_usuario),
    FOREIGN KEY (Id_mesa) REFERENCES Mesa(Id_mesa)
);

CREATE TABLE Promocion (
    Id_promocion INT PRIMARY KEY,
    Nombre VARCHAR(100),
    Descripcion TEXT,
    Descuento_porcentaje DECIMAL(5,2),
    Fecha_inicio DATE
);

CREATE TABLE Categoria (
    Id_categoria INT PRIMARY KEY,
    Nombre VARCHAR(50)
);

CREATE TABLE Producto_Categoria (
    Id_producto INT,
    Id_categoria INT,
    PRIMARY KEY (Id_producto, Id_categoria),
    FOREIGN KEY (Id_producto) REFERENCES Producto(Id_producto),
    FOREIGN KEY (Id_categoria) REFERENCES Categoria(Id_categoria)
);

CREATE TABLE Reporte (
    Id_reporte INT PRIMARY KEY,
    Fecha_generacion DATE,
    Descripcion TEXT,
    Generado_por_usuario INT,
    FOREIGN KEY (Generado_por_usuario) REFERENCES Usuario(Id_usuario)
);
