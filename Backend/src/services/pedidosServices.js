const pool = require('../config/db');
const pedidosQueries = require('../queries/pedidosQueries');

const pedidosServices = {
    
    getAllPedidos: async () => {
        try {
            const { rows } = await pool.query(pedidosQueries.getAllPedidos);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener los pedidos: ' + error.message);
        }
    },

    getPedidoById: async (id) => {
        try {
            const { rows } = await pool.query(pedidosQueries.getPedidoById, [id]);
            return rows[0];
        } catch (error) {
            throw new Error('Error al obtener el pedido: ' + error.message);
        }
    },

    createPedido: async (id_usuario, direccion_envio, estado) => {
        try {
            const { rows } = await pool.query(pedidosQueries.createPedido, [id_usuario, direccion_envio, estado]);
            return rows[0];
        } catch (error) {
            throw new Error('Error al crear el pedido: ' + error.message);
        }
    },

    updatePedido: async (id, estado, direccion_envio) => {
        try {
            const { rows } = await pool.query(pedidosQueries.updatePedido, [estado, direccion_envio, id]);
            return rows[0];
        } catch (error) {
            throw new Error('Error al actualizar el pedido: ' + error.message);
        }
    },

    deletePedido: async (id) => {
        try {
            const { rows } = await pool.query(pedidosQueries.deletePedido, [id]);
            return rows[0];
        } catch (error) {
            throw new Error('Error al eliminar el pedido: ' + error.message);
        }
    },

    /**
     * 1. Agregar producto al carrito:
     *    - Verifica si el usuario tiene un pedido "pendiente".
     *    - Si no lo tiene, crea uno.
     *    - Luego inserta/actualiza la línea en "detalle_pedido".
     */
    addProductToCart: async ({ id_usuario, id_producto, cantidad, precio }) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1) Buscar si existe un pedido pendiente para ese usuario
            const queryBuscarPedidoPendiente = `
                SELECT * 
                FROM pedidos 
                WHERE id_usuario = $1 
                  AND estado = 'pendiente'
                LIMIT 1
            `;
            const resultPedido = await client.query(queryBuscarPedidoPendiente, [id_usuario]);
            let pedidoPendiente = resultPedido.rows[0];

            // 2) Si no existe pedido pendiente, crearlo
            if (!pedidoPendiente) {
                const queryCrearPedidoPendiente = `
                    INSERT INTO pedidos (id_usuario, direccion_envio, estado)
                    VALUES ($1, '', 'pendiente')
                    RETURNING *
                `;
                const resultNuevoPedido = await client.query(queryCrearPedidoPendiente, [id_usuario]);
                pedidoPendiente = resultNuevoPedido.rows[0];
            }

            // 3) Insertar o actualizar detalle_pedido
            //    Primero, verificamos si ya existe ese producto en el pedido
            const queryBuscarDetalle = `
                SELECT * 
                FROM detalle_pedido
                WHERE id_pedido = $1 
                  AND id_producto = $2
            `;
            const resultDetalle = await client.query(queryBuscarDetalle, [
                pedidoPendiente.id_pedido,
                id_producto
            ]);
            let detalleExistente = resultDetalle.rows[0];

            if (detalleExistente) {
                // Actualizar la cantidad (sumar la cantidad actual)
                const queryActualizarDetalle = `
                    UPDATE detalle_pedido
                    SET cantidad = cantidad + $1,
                        precio = $2
                    WHERE id_detalle = $3
                    RETURNING *
                `;
                await client.query(queryActualizarDetalle, [
                    cantidad,
                    precio, // podrías controlar la lógica de precio como gustes
                    detalleExistente.id_detalle
                ]);
            } else {
                // Insertar nuevo detalle
                const queryInsertarDetalle = `
                    INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio)
                    VALUES ($1, $2, $3, $4)
                `;
                await client.query(queryInsertarDetalle, [
                    pedidoPendiente.id_pedido,
                    id_producto,
                    cantidad,
                    precio
                ]);
            }

            await client.query('COMMIT');
            return pedidoPendiente; // Retorna el pedido pendiente que se utilizó
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error('Error al agregar producto al carrito: ' + error.message);
        } finally {
            client.release();
        }
    },

    /**
     * 2. Obtener pedido pendiente de un usuario (con detalles)
     */
    getPendingOrder: async (id_usuario) => {
        const client = await pool.connect();
        try {
          // 1. Buscar pedido en estado 'pendiente'
          const pedidoResult = await client.query(`
            SELECT * 
            FROM pedidos
            WHERE id_usuario = $1
              AND estado = 'pendiente'
            LIMIT 1
          `, [id_usuario]);
      
          const pedido = pedidoResult.rows[0];
          if (!pedido) {
            return null; // no hay pedido pendiente
          }
      
          // 2. JOIN detalle_pedido y productos
          const detallesResult = await client.query(`
            SELECT 
              dp.id_detalle,
              dp.id_pedido,
              dp.id_producto,
              dp.cantidad,
              dp.precio,
              p.nombre AS nombre_producto,
              p.descripcion AS descripcion_producto,
              p.imagen AS imagen_producto
            FROM detalle_pedido dp
            JOIN productos p ON dp.id_producto = p.id_producto
            WHERE dp.id_pedido = $1
          `, [pedido.id_pedido]);
      
          // Adjuntamos los detalles al objeto pedido
          pedido.detalles = detallesResult.rows; 
          return pedido;
      
        } finally {
          client.release();
        }
      },
      

    /**
     * 3. Proceder a la compra: cambiar estado de 'pendiente' a 'comprado'
     */
    proceedToPurchase: async (id_usuario) => {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // Buscar el pedido pendiente
            const queryPedidoPendiente = `
                SELECT * 
                FROM pedidos
                WHERE id_usuario = $1
                  AND estado = 'pendiente'
                LIMIT 1
            `;
            const pedidoResult = await client.query(queryPedidoPendiente, [id_usuario]);
            const pedidoPendiente = pedidoResult.rows[0];

            if (!pedidoPendiente) {
                await client.query('ROLLBACK');
                return null; // No hay pedido pendiente para comprar
            }

            // Actualizar el estado a "comprado"
            const queryActualizarEstado = `
                UPDATE pedidos
                SET estado = 'comprado'
                WHERE id_pedido = $1
                RETURNING *
            `;
            const updateResult = await client.query(queryActualizarEstado, [pedidoPendiente.id_pedido]);

            await client.query('COMMIT');
            return updateResult.rows[0]; // Pedido ya en estado "comprado"
        } catch (error) {
            await client.query('ROLLBACK');
            throw new Error('Error al proceder con la compra: ' + error.message);
        } finally {
            client.release();
        }
    },
    removeItemFromCart: async (id_detalle) => {
        const client = await pool.connect();
        try {
          await client.query('BEGIN');
      
          // Verificamos si el registro (detalle) existe
          const checkQuery = `
            SELECT * 
            FROM detalle_pedido
            WHERE id_detalle = $1
            LIMIT 1
          `;
          const resultCheck = await client.query(checkQuery, [id_detalle]);
          const detalle = resultCheck.rows[0];
      
          if (!detalle) {
            // Si no existe, hacemos rollback y retornamos null (o la lógica que desees)
            await client.query('ROLLBACK');
            return null;
          }
      
          // Eliminamos el detalle
          const deleteQuery = `
            DELETE FROM detalle_pedido
            WHERE id_detalle = $1
            RETURNING *
          `;
          const deleteResult = await client.query(deleteQuery, [id_detalle]);
      
          // Si quisieras realizar más operaciones relacionadas, podrías hacerlas antes del COMMIT
          await client.query('COMMIT');
      
          // Retornamos el registro eliminado
          return deleteResult.rows[0];
        } catch (error) {
          await client.query('ROLLBACK');
          throw new Error('Error al eliminar el item del carrito: ' + error.message);
        } finally {
          client.release();
        }
      },
};

module.exports = pedidosServices;
