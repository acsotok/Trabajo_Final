// src/pages/MyOrders.jsx
import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import {
  obtenerOrdenPendiente,
  removeItemFromCart,
  realizarCheckout
} from '../services/ordersService';  // Ajusta la ruta según tu proyecto
import './MyOrders.css';

const MyOrders = () => {
  // Ejemplo: ID de usuario “simulado”. En un proyecto real, lo obtendrías
  // de tu sistema de login (por ej. JWT, Context, Redux, etc.).
  const [idUsuario] = useState(1);

  // Lista local de productos (items) del pedido pendiente
  const [cart, setCart] = useState([]);

  // Mensaje de retroalimentación (errores, confirmaciones, etc.)
  const [message, setMessage] = useState('');

  // Al montar el componente, cargamos la orden pendiente
  useEffect(() => {
    cargarOrdenPendiente();
    // eslint-disable-next-line
  }, []);

  /**
   * Llama al backend para obtener la orden pendiente (estado "pendiente"),
   * y ajusta el 'cart' local con los productos que vengan de la respuesta.
   */
  
  const cargarOrdenPendiente = async () => {
    try {
      const data = await obtenerOrdenPendiente(idUsuario);
      // Suponiendo que 'data' devuelve algo como:
      // { id_pedido, estado, detalles: [ { id_producto, cantidad, precio, ... }, ... ] }
      if (data && data.detalles) {
        // Mapear 'detalles' a la forma en que tu 'ProductCard' los usa:
        const mappedCart = data.detalles.map((item) => ({
          id_detalle: item.id_detalle,
          id: item.id_producto,
          name: item.nombre_producto,
          price: item.precio,
          quantity: item.cantidad,
          desc: item.descripcion_producto,  
          img: item.imagen_producto       
        }));
        setCart(mappedCart);
        setMessage('');
      } else {
        setCart([]);
        setMessage('No hay una orden pendiente para este usuario.');
      }
    } catch (error) {
      console.error(error);
      setMessage('No se pudo cargar la orden pendiente.');
    }
  };

  /**
   * Elimina un producto del carrito. Si tienes un endpoint en backend,
   * llámalo antes de actualizar el estado local (ejemplo `POST /eliminarcarrito`).
   */
  const removeFromCart = async (id_detalle) => {
    try {
      // 1) Llamas al backend para eliminar
      const response = await removeItemFromCart(id_detalle);
      if (response.success) {
        // 2) Si todo ok, actualizas el estado local
        setCart(cart.filter((item) => item.id_detalle !== id_detalle));
        setMessage('Producto eliminado del carrito (DB).');
      } else {
        setMessage(response.message || 'No se pudo eliminar el producto');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al eliminar el producto de la DB');
    }
  };

  /**
   * Cambia el estado de la orden pendiente a “comprado”
   */
  const handleCheckout = async () => {
    try {
      const data = await realizarCheckout(idUsuario);
      if (data && data.pedido) {
        setMessage(`Pedido #${data.pedido.id_pedido} fue comprado con éxito.`);
        setCart([]); // Limpia el carrito local
      } else {
        setMessage('No se encontró orden pendiente para comprar.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error al procesar la compra.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Mis Pedidos</h2>

      {/* Mensaje de feedback (errores, confirmaciones, etc.) */}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      {cart.length === 0 ? (
        <p>No tienes productos en tu pedido.</p>
      ) : (
        <>
          <div className="row">
            {cart.map((producto) => (
              <div key={producto.id} className="col-12 col-md-4 mb-4">
                {/* Tu componente ProductCard recibe la info para pintar el producto */}
                <ProductCard
                  id={producto.id}
                  name={producto.name}
                  description={producto.desc}
                  price={producto.price}
                  image={producto.img}
                  showRemoveButton={true}
                />
                {/* Sección de cantidad y botón Eliminar */}
                <div className="d-flex justify-content-between mt-2">
                  <span>Cantidad: {producto.quantity}</span>
                  <button
                    className="btn btn-danger"
                    onClick={() => removeFromCart(producto.id_detalle)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* Botón para finalizar la compra (checkout) */}
          <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-success" onClick={handleCheckout}>
              Proceder con la compra
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyOrders;
