CREATE DATABASE lentes;
\c joyas;

CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY, 
    nombre VARCHAR(255) NOT NULL, 
    descripcion TEXT, 
    precio DECIMAL(10,2) NOT NULL, 
    stock INT NOT NULL, 
    id_categoria INT, 
    imagen VARCHAR(256),
    habilitado BOOLEAN,
    CONSTRAINT fk_categoria FOREIGN KEY (id_categoria) REFERENCES categorias (id_categoria)
);

 INSERT INTO productos values
 	(DEFAULT, 'Lentes Unicornio', 'Los lentes unicornio son ideales para niños que disfrutan del aire libre, tienen factor uv para cuidarlos del sol y el color de los vidrios no interfiere con su visión.', 5950, 5 , 1, 'https://media.istockphoto.com/id/1924487804/photo/cactus-with-sunglasses-and-a-unicorn-float-on-a-studio-background.jpg?s=612x612&w=0&k=20&c=R2fTxuGMFXTMYVYgK9E4v1c6y2si-tjPLT8FS5vhgf8=', 'true'),
 	(DEFAULT, 'Lentes Mónaco', 'Los lentes Mónaco harán que las mujeres se sientan como si estuvieran de vacaciones en la elegante costa Europea, tienen factor uv para cuidarlas del sol y el color de los vidrios no interfiere con la visión.', 6980, 10 , 1, 'https://media.istockphoto.com/id/1921779371/photo/beach-ball-with-sunglasses-and-hat-on-peach-background-summer-fashion-concept.jpg?s=612x612&w=0&k=20&c=ROMU2dga2xs8WMTWHKcRTZbOYOKEDqfwxjz16JTJezo=', 'true'),
 	(DEFAULT, 'Lentes Margarita', 'Para verse elegante y alegre, los lentes Margarita son la elección de las mujeres que buscan ser diferentes y audaces, tienen factor uv para cuidarlas del sol y el color de los vidrios no interfiere con la visión.', 6580, 12 , 2, 'https://media.istockphoto.com/id/1857079076/photo/stylized-easter-egg-with-sunglasses-and-hat-surrounded-by-daisies.jpg?s=612x612&w=0&k=20&c=n7pdhMLc45bNlexT-SeMiIw6wIlyp399qb3lyphF_Wg=', 'true'),
 	(DEFAULT, 'Lentes Ciervo', 'Los lentes Ciervo entregan elegancia a los hombres que les gusta darle un toque especial a sus atuendos diarios, tienen factor uv para cuidarlos del sol y el color de los vidrios no interfiere con la visión.', 6880, 7 , 2, 'https://media.istockphoto.com/id/1347515586/photo/reindeer-head-with-wrapped-christmas-lights.jpg?s=612x612&w=0&k=20&c=AmQb1ATqARWiGf9EG81GIX9ZVvFV9iJl-FWyLOipmYU=', 'true'),
 	(DEFAULT, 'Lentes Balón', 'Los lentes balón serán el mejor amigo de los niños que les gusta practicar deportes, tienen factor uv para cuidarlos del sol y el color de los vidrios no interfiere con su visión.', 5730, 9 , 3, 'https://media.istockphoto.com/id/1324184549/photo/minimal-beach-ball.jpg?s=612x612&w=0&k=20&c=Kk4eqEO3yUsVJzwK_X9axcEier71XOZEKj4jxuA9utc=', 'true'),
 	(DEFAULT, 'Lentes Calavera', 'Los lentes Calavera son especialmente diseñados para aquellos hombres que van más allá en sus actividades de fin de semana, tienen factor uv para cuidarlos del sol y el color de los vidrios no interfiere con la visión.', 7320, 8 , 3, 'https://media.istockphoto.com/id/1340869164/photo/skull-with-sunglasses.jpg?s=612x612&w=0&k=20&c=iukmoCm4NtFJ6P-waeqtiicjdsL987sYSeMzHop_2TA=', 'true');

SELECT * FROM productos;

CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY, 
    nombre VARCHAR(255) NOT NULL, 
    correo VARCHAR(255) UNIQUE NOT NULL, 
    contraseña VARCHAR(255) NOT NULL,
    direccion VARCHAR(255),
    telefono VARCHAR(255),
    rol VARCHAR(20) CHECK (rol IN ('cliente', 'administrador')) DEFAULT 'cliente'
);

SELECT * FROM usuarios;

CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre_categoria VARCHAR(255) NOT NULL,
    descripcion TEXT
);

INSERT INTO categorias (nombre_categoria, descripcion)
VALUES
    ('infantes', 'Categoría para productos dirigidos a infantes'),
    ('mujeres', 'Categoría para productos dirigidos a mujeres'),
    ('hombres', 'Categoría para productos dirigidos a hombres');


SELECT * FROM categorias;

CREATE TABLE pedidos (
    id_pedido SERIAL PRIMARY KEY,
    id_usuario INT,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) CHECK (estado IN ('pendiente', 'procesando', 'enviando', 'entregado', 'cancelado')) DEFAULT 'pendiente',
    direccion_envio VARCHAR(255),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);


SELECT * FROM pedidos;

CREATE TABLE detalle_pedido (
    id_detalle SERIAL PRIMARY KEY,
    id_pedido INT,
    id_producto INT,
    cantidad INT NOT NULL,
    FOREIGN KEY (id_pedido) REFERENCES pedidos(id_pedido),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);


SELECT * FROM detalle_pedido;