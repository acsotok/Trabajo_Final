const userServices = require('../services/userServices');

const userControllers = {

    // Controlador para obtener todos los usuarios (solo accesible para administradores)
    getUser: async (req, res) => {
        try {
            const users = await userServices.getAllUsers()
            res.status(200).json({ users });
        } catch (error) {
            console.error('Error al obtener los usuarios:', error.message);
            res.status(500).json({ message: 'Error al obtener los usuarios' });
        }
    },

    // Controlador para obtener un usuario por su ID
    getUserById: async (req, res) => {
        const { id } = req.params;
        try {
            const user = await userServices.getUserById(id);
            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('Error al obtener el usuario:', error.message);
            res.status(500).json({ message: 'Error al obtener el usuario' });
        }
    },

    // Controlador para crear un nuevo usuario
    addUser: async (req, res) => {
        const { nombre, correo, contraseña, direccion, telefono, rol } = req.body;

        // Verifica si los campos requeridos están presentes
        if (!nombre || !correo || !contraseña || !direccion || !telefono || !rol) {
            return res.status(400).json({ message: 'Faltan datos' });
        }

        try {
            // Llama al servicio para agregar el nuevo usuario
            const nuevoUsuario = await userServices.addUser(
                nombre, correo, contraseña, direccion, telefono, rol
            );
            res.status(201).json({ user: nuevoUsuario, message: 'Usuario creado correctamente' });
        } catch (error) {
            console.error('Error al crear el usuario:', error.message);
            res.status(500).json({ message: error.message });
        }
    },

    // Controlador para actualizar un usuario
    updateUser: async (req, res) => {
        const { id } = req.params;
        const { nombre, correo, contraseña, direccion, telefono, rol } = req.body;

        // Verifica si los campos requeridos están presentes
        if (!nombre || !correo || !contraseña || !direccion || !telefono || !rol) {
            return res.status(400).json({ message: 'Faltan datos' });
        }

        try {
            // Llama al servicio para actualizar el usuario
            const usuarioActualizado = await userServices.updateUser(
                nombre, correo, contraseña, direccion, telefono, rol, id
            );
            if (!usuarioActualizado) {
                return res.status(404).json({ message: `No se encontró el usuario con id ${id}` });
            }
            res.status(200).json({ user: usuarioActualizado, message: 'Usuario actualizado correctamente' });
        } catch (error) {
            console.error('Error al actualizar el usuario:', error.message);
            res.status(500).json({ message: error.message });
        }
    },

    // Controlador para eliminar un usuario
    deleteUser: async (req, res) => {
        const { id } = req.params;  // El ID del usuario que vamos a eliminar
        if (isNaN(id)) {
            return res.status(400).json({ message: 'El ID debe ser un número válido' });
        }
    
        try {
            // Llama al servicio para eliminar el usuario
            const usuarioEliminado = await userServices.deleteUser(id);  // Llamar al servicio con el ID
            if (!usuarioEliminado) {
                return res.status(404).json({ message: `No se encontró el usuario con el id ${id}` });
            }
            res.status(200).json({ user: usuarioEliminado, message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error al eliminar el usuario:', error.message);
            res.status(500).json({ message: error.message });
        }
    },
  // Función para registrar un nuevo usuario
  register: async (req, res) => {
    console.log(req.body); // Esto mostrará lo que se está recibiendo en el servidor

    const { nombre, correo, contraseña, direccion, telefono, rol } = req.body;

    if (!nombre || !correo || !contraseña || !direccion || !telefono || !rol) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    try {
      const newUser = await userServices.addUser(nombre, correo, contraseña, direccion, telefono, rol);
      res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el usuario: ' + error.message });
    }
  },

  // Función para iniciar sesión
    login: async (req, res) => {
    try {
        const { correo, contraseña } = req.body;
        // Verifica si el correo y la contraseña son válidos
        const token = await userServices.loginUser(correo, contraseña);
        res.status(200).json({
            message: 'Autenticación exitosa',
            token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al iniciar sesión: ' + error.message
        });
    }
    }
}

module.exports = userControllers