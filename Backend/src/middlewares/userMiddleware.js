const jwt = require('jsonwebtoken');


// Middleware para verificar que los datos del usuario sean válidos
const validateUserData = (req, res, next) => {
    const { nombre, correo, contraseña, direccion, telefono, rol } = req.body;
    if (!nombre || !correo || !contraseña || !direccion || !telefono || !rol) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    next();
};

const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Guardamos el usuario decodificado en `req.user`
      next();
    } catch (error) {
      res.status(400).json({ message: 'Token inválido o expirado.' });
    }
};

module.exports = {
    validateUserData,
    verifyToken
};
