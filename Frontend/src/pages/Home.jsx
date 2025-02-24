import { useEffect, useState } from 'react';
import axios from 'axios';             
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import Banner from '../components/Banner'; 
import './Home.css';

const Home = () => {
  const { addToCart } = useCart();

  // Estado local para los productos
  const [productsData, setProductsData] = useState([]);

  // useEffect para cargar los productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Función que llama al backend (GET /productos)
  const fetchProducts = async () => {
    try {
      // Ajusta la URL según el servidor
      const response = await axios.get('http://localhost:3000/productos');
      setProductsData(response.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  return (
    <div className="home-container">
      <Banner /> 
      
      <div className="container product-section">
        <h1 className="text-center">Bienvenido a Lentes AP!</h1>
        <p className="text-center">Explora nuestros lentes y rockea tu verano.</p>
        
        <div className="row">
          {productsData.map((product) => (
            <div key={product.id_producto} className="col-12 col-md-4 mb-4">
              <ProductCard
                // Ajusta los campos según la tabla 'productos'
                id={product.id_producto}
                name={product.nombre}
                description={product.descripcion}
                price={product.precio}
                image={product.imagen}
                onAddToCart={() => addToCart(product)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
