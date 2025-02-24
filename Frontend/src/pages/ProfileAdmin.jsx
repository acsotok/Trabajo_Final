import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mockData from '../mockdata.js'; 

const ProfileAdmin = () => {
  const [user, setUser] = useState(null);
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    image: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Verificamos si el usuario ests en el localStorage
    const storedUser = JSON.parse(localStorage.getItem('user')); // se carga el usuario desde el localStorage
    if (!storedUser) {
      navigate('/login'); // Si no hay usuario redirigimos al login
    } else {
      setUser(storedUser); // Si hay usuario lo configuramos en el estado
    }
  }, [navigate]);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmitProduct = (e) => {
    e.preventDefault();

    if (product.name && product.price && product.stock) {
      alert('Producto creado (simulado)!');
      setProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: '',
      });
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="container mt-5">
      <h2>Perfil de Administrador</h2>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Correo electrónico</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={user.email}
          disabled
        />
      </div>
      <div className="mb-3">
        <label htmlFor="name" className="form-label">Nombre</label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={user.name}
          disabled
        />
      </div>
      <div className="mb-3">
        <label htmlFor="address" className="form-label">Dirección</label>
        <input
          type="text"
          className="form-control"
          id="address"
          value={user.address}
          disabled
        />
      </div>
      <div className="mb-3">
        <label htmlFor="phone" className="form-label">Teléfono</label>
        <input
          type="text"
          className="form-control"
          id="phone"
          value={user.phone}
          disabled
        />
      </div>

      <h3>Crear un nuevo producto</h3>
      <form onSubmit={handleSubmitProduct}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre del Producto</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={product.name}
            onChange={handleProductChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={product.description}
            onChange={handleProductChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">Precio</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={product.price}
            onChange={handleProductChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">Categoría</label>
          <input
            type="text"
            className="form-control"
            id="category"
            name="category"
            value={product.category}
            onChange={handleProductChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="stock" className="form-label">Stock</label>
          <input
            type="number"
            className="form-control"
            id="stock"
            name="stock"
            value={product.stock}
            onChange={handleProductChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Imagen URL</label>
          <input
            type="text"
            className="form-control"
            id="image"
            name="image"
            value={product.image}
            onChange={handleProductChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success">Crear Producto</button>
      </form>

      <button
        className="btn btn-secondary mt-3"
        onClick={() => navigate('/')}>
        Volver al Inicio
      </button>
    </div>
  );
};

export default ProfileAdmin;
