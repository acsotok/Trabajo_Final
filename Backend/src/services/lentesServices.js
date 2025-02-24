const pool = require('../config/db')
const lentesQueries = require('../queries/lentesQueries')

const lentesServices = {
    getLentes: async () => {
      try{
        const { rows } = await pool.query(lentesQueries.getLentes)
        return rows
      } catch(error){
        console.error(error);
        throw new Error('Error al buscar todos los productos: ', error);
      }
     },

    getLenteById: async (id) => {
        try {
          const { rows } = await pool.query(lentesQueries.getLenteById, [id,])
          return rows[0];
        } catch (error) {
          throw new Error(`Error al buscar el producto con el id: ${id} `, error);
        }
    },

    addLente: async (nombre, descripcion, precio, stock, id_categoria, imagen, habilitado) => {
        try {
            const { rows } = await pool.query(lentesQueries.addLente, [
                nombre, 
                descripcion, 
                precio, 
                stock, 
                id_categoria, 
                imagen, 
                habilitado
            ]);
            return rows[0]
        } catch (error) {
            throw new Error('Error al guardar el producto en la DB: ' + error.message);
        }
    },

    updateLente: async (nombre, descripcion, precio, stock, id_categoria, imagen, habilitado, id_producto) => {
        try {
            // Ejecutar la consulta para actualizar el producto
            const { rows } = await pool.query(lentesQueries.updateLente, [
                nombre, 
                descripcion, 
                precio, 
                stock, 
                id_categoria, 
                imagen, 
                habilitado,
                id_producto
            ])
            return rows[0]
        } catch (error) {
            throw new Error(`Error al editar el producto en la DB: ${error.message}`);
        }
    },

    deleteLente: async (id) => {
        try {
          const { rows } = await pool.query(lentesQueries.deleteLente, [id]);
          return rows[0];
        } catch (error) {
          throw new Error('Error al eliminar el producto de la DB', error);
        }
    }
}

module.exports = lentesServices