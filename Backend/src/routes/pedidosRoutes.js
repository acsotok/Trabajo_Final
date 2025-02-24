const express = require('express');
const router = express.Router();
const pedidosControllers = require('../controllers/pedidosControllers');
const pedidosMiddleware = require('../middlewares/pedidosMiddleware');

// Ruta para obtener todos los pedidos
router.get('/', pedidosControllers.getAllPedidos);

// Ruta para obtener un pedido por ID
router.get('/:id', pedidosControllers.getPedidoById);

// Ruta para crear un nuevo pedido
router.post('/', pedidosMiddleware.validatePedidoData, pedidosControllers.createPedido);

// Ruta para actualizar un pedido por ID
router.put('/:id', pedidosMiddleware.validarActualizacionPedido, pedidosControllers.updatePedido)

// Ruta para eliminar un pedido por ID
router.delete('/:id', pedidosControllers.deletePedido);

// Rutas específicas para el flujo de carrito y checkout
router.post('/add-to-cart', pedidosControllers.addProductToCart);
router.post('/pending', pedidosControllers.getPendingOrder);
router.post('/checkout', pedidosControllers.proceedToPurchase);
router.delete('/remove-item/:id_detalle', pedidosControllers.deletePedido);


module.exports = router;
