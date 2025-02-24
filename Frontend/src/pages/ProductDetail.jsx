
import { useParams } from 'react-router-dom';
import products from '../data/product';
import './ProductDetail.css';


const ProductDetail = () => {
  const { productId } = useParams(); // Obtenemos el id del producto desde la URL

  // Buscanos el producto en la lista de productos
  const product = products.find(product => product.id === Number(productId));


  // Si no se encuentra el producto, mostramos un mensaje
  if (!product) {
    return <div>Producto no encontrado. Sigue buscando, tenemos otras alternativas para ti </div>;
  }

  return (
    <div className="product-detail-card">
      <img src={product.img} alt={product.name} className="product-image" />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p>{product.desc}</p>
        <p>${product.price}</p>
      </div>
    </div>
  );
};

export default ProductDetail;

