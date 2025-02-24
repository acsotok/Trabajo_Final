const lentesServices = require('../services/lentesServices');

// Middleware para validar que el ID de producto sea un número
const validateId = (req, res, next) => {
    const { id } = req.params;
    if (isNaN(id)) {
        return res.status(400).json({ message: 'El ID debe ser un número válido' });
    }
    next();
};

// Middleware para verificar si el producto existe antes de realizar una operación (como actualizar o eliminar)
const productExists = async (req, res, next) => {
    const { id } = req.params;
    try {
        const producto = await lentesServices.getLenteById(id);
        if (!producto) {
            return res.status(404).json({ message: `Producto con ID ${id} no encontrado` });
        }
        next();
    } catch (error) {
        console.error('Error al verificar el producto:', error);
        return res.status(500).json({ message: 'Error al verificar el producto' });
    }
};

// Middleware para validar los datos del producto (usado en `addLente` y `updateLente`)
const validateProductData = (req, res, next) => {
    const { nombre, descripcion, precio, stock, id_categoria, imagen, habilitado } = req.body;
    if (!nombre || !descripcion || !precio || !stock || !id_categoria || !imagen || habilitado === undefined) {
        return res.status(400).json({ message: 'Faltan datos para crear o actualizar el producto' });
    }
    next();
};

module.exports = {
    validateId,
    productExists,
    validateProductData
};
