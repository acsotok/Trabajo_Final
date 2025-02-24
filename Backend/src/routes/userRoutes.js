const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
const userMiddleware = require('../middlewares/userMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware')
const checkAdminAccess = require('../middlewares/checkAdminAccess')

// Ruta para crear un nuevo usuario (solo puede hacerlo un administrador)
router.post('/register', userMiddleware.validateUserData, userControllers.register);

// Ruta para autenticar un usuario (login)
router.post('/login', userControllers.login)

// Ruta para obtener un usuario por su ID (requiere autenticación)
router.get('/:id', userMiddleware.verifyToken, checkAdminAccess, userControllers.getUserById)

// Ruta para actualizar los datos de un usuario (requiere autenticación)
router.put('/:id', userMiddleware.verifyToken, userMiddleware.validateUserData, userControllers.updateUser);

// Ruta para eliminar un usuario (requiere autenticación y solo un administrador puede hacerlo)
router.delete('/:id', userMiddleware.verifyToken, adminMiddleware.verifyAdmin, userControllers.deleteUser);

// Agregar otras rutas que solo los administradores puedan acceder
router.get('/admin/usuarios', userMiddleware.verifyToken, adminMiddleware.verifyAdmin, userControllers.getUser);

module.exports = router;
