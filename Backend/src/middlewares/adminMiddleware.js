// Middleware para verificar si el usuario es administrador
const verifyAdmin = (req, res, next) => {
    const { rol } = req.user;  // El rol se agrega al `req.user` al verificar el token

    if (rol !== 'administrador') {
        return res.status(403).json({ message: 'Acceso denegado. Se requiere ser administrador.' });
    }

    next();  // Si el rol es administrador, se permite el acceso
};

module.exports = {
    verifyAdmin
};
