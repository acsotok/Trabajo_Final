import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfileClient = () => {
  const { user } = useAuth(); // Obtenemos el usuario del contexto de autenticacion
  const navigate = useNavigate();
  
  // Si no hay usuario autenticado mostramos un mensaje para que inicie sesion
  if (!user) {
    return <div>Por favor, inicia sesión para ver tu perfil.</div>;
  }

  // Funcion para manejar la edicion de perfil
  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  return (
    <div className="container mt-5">
      <h2>Perfil de Cliente</h2>
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

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-primary" onClick={handleEditProfile}>
          Editar Perfil
        </button>
      </div>
    </div>
  );
};

export default ProfileClient;
