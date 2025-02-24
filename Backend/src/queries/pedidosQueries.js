const pedidosQueries = {
    getAllPedidos: 'SELECT * FROM pedidos;',
    getPedidoById: 'SELECT * FROM pedidos WHERE id_pedido = $1;',
    createPedido: `
        INSERT INTO pedidos (id_usuario, direccion_envio, estado) 
        VALUES ($1, $2, $3) 
        RETURNING *;
    `,
    updatePedido: `
        UPDATE pedidos 
        SET estado = $1, direccion_envio = $2 
        WHERE id_pedido = $3 
        RETURNING *;
    `,
    deletePedido: 'DELETE FROM pedidos WHERE id_pedido = $1 RETURNING *;',
};

module.exports = pedidosQueries;
