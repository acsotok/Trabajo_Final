const validatePedidoData = (req, res, next) => {
    const { id_usuario, direccion_envio, estado } = req.body;
    if (!id_usuario || !direccion_envio || !estado) {
        return res.status(400).json({ message: 'Faltan datos en el pedido.' });
    }
    next();
};

const validarActualizacionPedido = (req, res, next) => {
    const { estado, direccion_envio } = req.body;
  
    // Verificar que al menos uno de los campos esté presente
    if (!estado && !direccion_envio) {
      return res.status(400).json({ message: "Faltan datos en el pedido." });
    }
  
    next();
};

module.exports = { validatePedidoData, validarActualizacionPedido };
