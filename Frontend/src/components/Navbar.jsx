import React from 'react';
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 
import './Navbar.css'; 

const Navbar = () => {
  const { user, logout } = useAuth(); // Obtenr el usuario y la funcion de logout desde el contexto

  return (
    <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body">
      <div className="container-fluid">
        <Link className="navbar-brand text-white" to="/">Lentes AP!</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active text-white" aria-current="page" to="/">Home</Link>
            </li>
            {/* Si el usuario no estaa logueado mostramos Login y Register */}
            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register">Register</Link>
                </li>
              </>
            ) : (
              // Si el usuario esta logueado, mostramos los enlaces correspondientes
              <>
                {/* Si el usuario es un cliente mostramos el perfil de cliente */}
                {user.role === 'client' && (
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/profile-client">Perfil Cliente</Link>
                  </li>
                )}

                {/* Si el usuario es un admin mostramos el perfil de admin */}
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link text-white" to="/profile-admin">Perfil Admin</Link>
                  </li>
                )}

                {/* Boton para hacer logout que aparece cuando el usuario esta logeado*/}
                <li className="nav-item">
                  <button className="btn btn-link text-white" onClick={logout}>Logout</button>
                </li>
              </>
            )}
          </ul>

          {/*el botón Mis Pedidos (este lo ve el cliente) o Mis Ventas (este lo ve el admin) a la derecha */}
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {/* Si el usuario esta logueado, mostramos Mis Pedidos o Mis Ventas a la derecha */}
            {user && (
              <li className="nav-item">
                {user.role === 'admin' ? (
                  <Link className="nav-link text-white" to="/my-sales">Mis Ventas</Link>
                ) : (
                  <Link className="nav-link text-white" to="/my-orders">Mis Pedidos</Link>
                )}
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
