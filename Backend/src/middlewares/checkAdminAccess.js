const checkAdminAccess = (req, res, next) => {
    // Si el usuario es un administrador, permite el acceso a cualquier perfil
    if (req.user.rol === 'administrador') {
      return next(); // Continúa con la solicitud
    }
  
    // Si el usuario no es administrador, verifica si está pidiendo su propio perfil
    const { id } = req.params; // ID del usuario al que se está accediendo
  
    // Si el ID del usuario autenticado es diferente al ID en la URL, se bloquea el acceso
    if (req.user.id_usuario !== parseInt(id)) {
      return res.status(403).json({ message: "Acceso denegado. No tienes permiso para ver este perfil." });
    }
  
    // Si todo está bien, permite continuar
    next();
  };
  
  module.exports = checkAdminAccess;
  