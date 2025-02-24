const { deleteLente } = require('../queries/lentesQueries');
const lentesServices = require('../services/lentesServices')

const lentesControllers = {
    // Controlador para obtener todos los lentes
    getLentes : async (req, res) => {
        try {
            const productos = await lentesServices.getLentes();
            res.status(200).json(productos);
        } catch (error) {
            console.error('Error al obtener los lentes:', error.message);
            res.status(500).json({ message: 'Error al obtener los lentes' });
        }
    },

    getLenteById : async (req, res) => {
        const { id } = req.params; // Extrae correctamente el ID de los parámetros de la URL
        try {
            const producto = await lentesServices.getLenteById(id); // Llamar al servicio para obtener el producto por ID
            if (producto) {
                res.json(producto); // Retornar el producto encontrado
            } else {
                res.status(404).json({ message: 'Producto no encontrado' }); // Si no se encuentra el producto
            }
        } catch (error) {
            console.error('Error al obtener el producto:', error.message);
            res.status(500).json({ message: 'Error al obtener el producto' }); // Manejo de error
        }
    },

    addLente: async (req, res) => {
        const { nombre, descripcion, precio, stock, id_categoria, imagen, habilitado } = req.body;
        if (!nombre || !descripcion || !precio || !stock || !id_categoria || !imagen || habilitado === undefined) {
            return res.status(400).json({ message: 'Faltan datos' })
        }
        try {
            const productoCreado = await lentesServices.addLente(
                nombre, descripcion, precio, stock, id_categoria, imagen, habilitado
            )
            res.status(201).json({ product: productoCreado, message: 'Producto creado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message })
        }
    },

    updateLente: async (req, res) => {
        const { id } = req.params
        const { nombre, descripcion, precio, stock, id_categoria, imagen, habilitado } = req.body;

        if (!nombre || !descripcion || !precio || !stock || !id_categoria || !imagen || habilitado === undefined) {
            return res.status(400).json({ message: 'Faltan datos' });
        }
        try {
            const productUpdated = await lentesServices.updateLente(
                nombre, descripcion, precio, stock, id_categoria, imagen, habilitado, id
            )
            // Verifica si se encontró el producto para actualizar
            if (!productUpdated) {
                return res
                    .status(404)
                    .json({ message: `No se encontró el producto con id ${id}` });
            }
            // Envia respuesta con el producto actualizado
            res
                .status(200)
                .json({ product: productUpdated, message: 'Producto actualizado' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    },
    
    deleteLente: async (req, res) => {
        const { id } = req.params;
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID debe ser un número válido' });
        }
    
        try {
            const productDeleted = await lentesServices.deleteLente(id);
            if (!productDeleted) {
                return res.status(404).json({ message: `No se encontró el producto con el id: ${id}` });
            }
            res.status(200).json({ product: productDeleted, message: 'Producto eliminado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = lentesControllers