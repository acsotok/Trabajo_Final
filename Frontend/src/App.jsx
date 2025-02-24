
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; 
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProfileClient from './pages/ProfileClient';
import ProfileAdmin from './pages/ProfileAdmin';
import MyOrders from './pages/MyOrders';
import MySales from './pages/MySales'; 
import PrivateRoute from './components/PrivateRoute'; 
import ProductDetail from './pages/ProductDetail';

function App() {
  return (
    <div>
      {/* Navbar siempre va a estar visible porque tiene los botones para navegar */}
      <Navbar />

      <Routes>
        {/* Ruta pública */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:productId" element={<ProductDetail />} />

        {/* Rutas protegidas */}
        <Route 
          path="/profile-client" 
          element={
            <PrivateRoute element={<ProfileClient />} roleRequired="client" />
          } 
        />
        <Route 
          path="/profile-admin" 
          element={
            <PrivateRoute element={<ProfileAdmin />} roleRequired="admin" />
          } 
        />

        {/* Ruta de Mis Pedidos */}
        <Route path="/my-orders" element={<MyOrders />} />

        {/* Ruta de Mis Ventas (solo admin) */}
        <Route path="/my-sales" element={<PrivateRoute element={<MySales />} roleRequired="admin" />} />
      </Routes>
    </div>
  );
}

export default App;
