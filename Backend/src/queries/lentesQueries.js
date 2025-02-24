const lentesQueries = {
    // Obtener todos los productos
    getLentes: "SELECT * FROM productos ", 

    // Obtener un producto por su ID
    getLenteById: "SELECT * FROM productos WHERE id_producto = $1", 

    // Insertar un nuevo producto
    addLente: `INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria, imagen, habilitado)
               VALUES ($1, $2, $3, $4, $5, $6, $7) 
               RETURNING *`, // Utilizamos RETURNING * para devolver el producto insertado
    
    // Actualizar un producto existente
    updateLente: `UPDATE productos 
                 SET nombre = $1, descripcion = $2, precio = $3, stock = $4, id_categoria = $5, imagen = $6, habilitado = $7 
                 WHERE id_producto = $8 
                 RETURNING *`, // Usamos RETURNING * para devolver el producto actualizado

    // Eliminar un producto
    deleteLente: "DELETE FROM productos WHERE id_producto = $1 RETURNING *" // Devolvemos el producto eliminado
};

module.exports = lentesQueries;

