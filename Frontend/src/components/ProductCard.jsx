/* eslint-disable react/prop-types */

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addProductToCart } from '../services/ordersService';
import './ProductCard.css';

const ProductCard = ({
  id,
  name,
  description,
  price,
  image,
  showRemoveButton,
  onRemove,
  quantity
}) => {
  const { user } = useAuth();  // Usuario autenticado (o null si no está logueado)
  const navigate = useNavigate();

  /**
   * Maneja el click en "Agregar 🛒":
   * - Si el usuario no está logueado, alerta y redirige a /login.
   * - Si está logueado, llama a la función del servicio que envía la solicitud al backend.
   */
  const handleAddToCart = async () => {
    if (!user) {
      alert('Debes estar logeado para agregar productos al carrito');
      navigate('/login'); // Redirige a la página de login
    } else {
      try {
        // Llama al servicio, asumiendo que el backend espera {id_usuario, id_producto, cantidad, precio}
        // Ajusta la cantidad
        const response = await addProductToCart(user.id, id, quantity ?? 1, price);
        console.log('Respuesta del backend:', response);
        alert('Producto agregado al carrito');
      } catch (error) {
        console.error(error);
        alert('Ocurrió un error al agregar el producto al carrito');
      }
    }
  };

  return (
    <div className="card">
      <img src={image} alt={name} className="card-img-top" />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text">{description}</p>
        <p className="card-text">${price}</p>

        {/* Muestra la cantidad si existe */}
        {quantity && <p className="card-text">Cantidad: {quantity}</p>}

        <div className="d-flex justify-content-between">
          <button className="btn btn-primary" onClick={handleAddToCart}>
            Agregar 🛒
          </button>

          <Link to={`/product/${id}`} className="btn btn-secondary">
            Ver más
          </Link>

          {showRemoveButton && onRemove && (
            <button className="btn btn-danger" onClick={onRemove}>
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
