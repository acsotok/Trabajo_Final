
import { useCart } from '../context/CartContext'; 
import ProductCard from '../components/ProductCard'; 
import './MySales.css';

const MySales = () => {
  const { cart, removeFromCart } = useCart(); // Usamos el carrito (si es que las ventas están asociadas al carrito)

  const handleSaleDetails = () => {
    alert('Detalles de la venta');
  };

  return (
    <div className="container mt-5">
      <h2>Mis Ventas</h2>
      {cart.length === 0 ? (
        <p>No has realizado ventas aún.</p>
      ) : (
        <div className="row">
          {/* Mostrar las "ventas" (productos vendidos) en tarjetas */}
          {cart.map((sale) => (
            <div key={sale.id} className="col-12 col-md-4 mb-4">
              <ProductCard
                name={sale.name}
                description={sale.description}
                price={sale.price}
                image={sale.image}
                onAddToCart={() => removeFromCart(sale.id)} // Función para eliminar del carrito
              />
              <div className="d-flex justify-content-between">
                <button className="btn btn-danger" onClick={() => removeFromCart(sale.id)}>
                  Eliminar Venta
                </button>
                <button className="btn btn-primary" onClick={handleSaleDetails}>
                  Ver detalles de la venta
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySales;
