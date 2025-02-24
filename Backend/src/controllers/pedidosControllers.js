const pedidosServices = require('../services/pedidosServices');

const pedidosControllers = {
    // 1. Agregar producto al carrito (crear/usar pedido pendiente)
    addProductToCart: async (req, res) => {
        try {
            const { id_usuario, id_producto, cantidad, precio } = req.body;

            // Validar datos mínimos
            if (!id_usuario || !id_producto || !cantidad) {
                return res.status(400).json({ message: 'Faltan datos para agregar producto al carrito' });
            }

            // Llama al service que maneja la lógica de crear/encontrar el pedido pendiente
            const pedidoPendiente = await pedidosServices.addProductToCart({
                id_usuario,
                id_producto,
                cantidad,
                precio
            });

            return res.status(200).json({
                message: 'Producto agregado al carrito correctamente',
                pedido: pedidoPendiente
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error al agregar producto al carrito: ' + error.message
            });
        }
    },

    // 2. Consulta si el usuario tiene un pedido pendiente y cargar los productos
    getPendingOrder: async (req, res) => {
        try {
            const { id_usuario } = req.body;
            if (!id_usuario) {
                return res.status(400).json({ message: 'Falta id_usuario para obtener pedido pendiente' });
            }

            const pedidoPendiente = await pedidosServices.getPendingOrder(id_usuario);
            if (!pedidoPendiente) {
                return res.status(404).json({ message: 'No hay pedido pendiente para este usuario' });
            }

            return res.status(200).json(pedidoPendiente);
        } catch (error) {
            return res.status(500).json({
                message: 'Error al consultar pedido pendiente: ' + error.message
            });
        }
    },

    // 3. Al proceder a la compra, el pedido pendiente pasa a estado "comprado"
    proceedToPurchase: async (req, res) => {
        try {
            const { id_usuario } = req.body;
            if (!id_usuario) {
                return res.status(400).json({ message: 'Falta id_usuario para completar la compra' });
            }

            const pedidoComprado = await pedidosServices.proceedToPurchase(id_usuario);
            if (!pedidoComprado) {
                return res.status(404).json({ message: 'No existe un pedido pendiente para este usuario' });
            }

            return res.status(200).json({
                message: 'Compra realizada con éxito',
                pedido: pedidoComprado
            });
        } catch (error) {
            return res.status(500).json({
                message: 'Error al completar la compra: ' + error.message
            });
        }
    },

    getAllPedidos: async (req, res) => {
        try {
            const pedidos = await pedidosServices.getAllPedidos();
            res.status(200).json(pedidos);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los pedidos: ' + error.message });
        }
    },

    getPedidoById: async (req, res) => {
        const { id } = req.params;
        try {
            const pedido = await pedidosServices.getPedidoById(id);
            if (pedido) {
                res.status(200).json(pedido);
            } else {
                res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el pedido: ' + error.message });
        }
    },

    createPedido: async (req, res) => {
        const { id_usuario, direccion_envio, estado = 'pendiente' } = req.body;
        if (!id_usuario || !direccion_envio) {
            return res.status(400).json({ message: 'Faltan datos para crear el pedido' });
        }
        try {
            const nuevoPedido = await pedidosServices.createPedido(id_usuario, direccion_envio, estado);
            res.status(201).json({ message: 'Pedido creado exitosamente', pedido: nuevoPedido });
        } catch (error) {
            res.status(500).json({ message: 'Error al crear el pedido: ' + error.message });
        }
    },

    updatePedido: async (req, res) => {
        const { id } = req.params;
        const { estado, direccion_envio } = req.body;

        if (!estado && !direccion_envio) {
            return res.status(400).json({ message: 'No se proporcionaron datos para actualizar' });
        }

        try {
            const pedidoActualizado = await pedidosServices.updatePedido(id, estado, direccion_envio);
            if (pedidoActualizado) {
                res.status(200).json({ message: 'Pedido actualizado', pedido: pedidoActualizado });
            } else {
                res.status(404).json({ message: 'Pedido no encontrado' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el pedido: ' + error.message });
        }
    },

    deletePedido: async (req, res) => {
        const { id_detalle } = req.params;
        try {
          const deletedItem = await pedidosServices.removeItemFromCart(id_detalle);
      
          if (!deletedItem) {
            return res.status(404).json({
              success: false,
              message: 'Detalle no encontrado'
            });
          }
      
          return res.status(200).json({
            success: true,
            message: 'Detalle eliminado correctamente',
            deletedDetail: deletedItem
          });
        } catch (error) {
          console.error(error);
          return res.status(500).json({
            success: false,
            message: 'Error al eliminar el detalle: ' + error.message
          });
        }
    }

};

module.exports = pedidosControllers;
