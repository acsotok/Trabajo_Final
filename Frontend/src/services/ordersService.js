// src/services/ordersService.js
import axios from 'axios';

// Ajusta la URL base según donde corre mi servidor
const API_URL = 'http://localhost:3000/pedidos';

/** Obtener el pedido pendiente (orden en estado 'pendiente') */
export const obtenerOrdenPendiente = async (id_usuario) => {
  const response = await axios.post(`${API_URL}/pending`, { id_usuario });
  return response.data; // Aquí vendrá un objeto con la orden y sus detalles
};

/** Eliminar un producto del carrito */
export const eliminarProductoCarrito = async (id_usuario, id_producto) => {
  // Por ejemplo, si en tu backend tienes un endpoint /eliminarcarrito
  // De lo contrario, puedes omitirlo o adaptarlo
  const response = await axios.post(`${API_URL}/eliminarcarrito`, {
    id_usuario,
    id_producto
  });
  return response.data;
};

/** Cambiar estado de la orden a 'comprado' (checkout) */
export const realizarCheckout = async (id_usuario) => {
  const response = await axios.post(`${API_URL}/checkout`, { id_usuario });
  return response.data;
};

export const addProductToCart = async (idUsuario, idProducto, cantidad, precio) => {
  const response = await axios.post(`${API_URL}/add-to-cart`, {
    id_usuario: idUsuario,
    id_producto: idProducto,
    cantidad,
    precio
  });
  return response.data;
};

export const getPendingOrder = async (idUsuario) => {
  const response = await axios.post(`${API_URL}/pending`, { id_usuario: idUsuario });
  return response.data;
};

export const proceedToPurchase = async (idUsuario) => {
  const response = await axios.post(`${API_URL}/checkout`, { id_usuario: idUsuario });
  return response.data;
};

export const removeItemFromCart = async (id_detalle) => {
  // Llamada a DELETE /pedidos/remove-item/:id_detalle
  const response = await axios.delete(`${API_URL}/remove-item/${id_detalle}`);
  return response.data; 
};