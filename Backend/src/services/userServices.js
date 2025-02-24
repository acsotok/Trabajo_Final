const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const userQueries = require('../queries/userQueries');

const userServices = {
    // Servicio para obtener un usuario por su correo
    getUser: async (correo) => {
        try {
            const { rows } = await pool.query(userQueries.getUser, [correo]);
            return rows[0];  // Retorna el primer usuario encontrado
        } catch (error) {
            throw new Error(`Error al obtener el usuario: ${error.message}`);
        }
    },

    // Servicio para obtener un usuario por su ID
    getUserById: async (id_usuario) => {
        try {
            const { rows } = await pool.query(userQueries.getUserById, [id_usuario]);
            return rows[0];  // Retorna el usuario encontrado
        } catch (error) {
            throw new Error(`Error al obtener el usuario con id ${id_usuario}: ${error.message}`);
        }
    },

    // Servicio para agregar un nuevo usuario
    addUser: async (nombre, correo, contraseña, direccion, telefono, rol = 'cliente') => {
        // Verifica si ya existe un usuario con ese correo
        const existingUser = await userServices.getUser(correo);
        if (existingUser) {
            throw new Error('El correo electrónico ya está registrado');
        }
        // Encriptamos la contraseña
        const hashedPassword = await bcrypt.hash(contraseña, 10);
    
        try {
            const { rows } = await pool.query(userQueries.addUser, [
                nombre,
                correo,
                hashedPassword,
                direccion,
                telefono,
                rol
            ]);
            return rows[0];  // Retorna el usuario creado
        } catch (error) {
            throw new Error(`Error al crear el usuario: ${error.message}`);
        }
    },

    // Servicio para actualizar un usuario
    updateUser: async (nombre, correo, contraseña, direccion, telefono, rol, id_usuario) => {
        // Encriptamos la nueva contraseña si se proporciona
        const hashedPassword = contraseña ? await bcrypt.hash(contraseña, 10) : null;

        try {
            const { rows } = await pool.query(userQueries.updateUser, [
                nombre,
                correo,
                hashedPassword || '',  // Si no hay nueva contraseña, se pasa un valor vacío
                direccion,
                telefono,
                rol,
                id_usuario
            ]);
            return rows[0];  // Retorna el usuario actualizado
        } catch (error) {
            throw new Error(`Error al actualizar el usuario: ${error.message}`);
        }
    },

    // Servicio para eliminar un usuario
    deleteUser: async (id_usuario) => {
        try {
            // Ejecutamos la consulta para eliminar el usuario con el ID proporcionado
            const { rows } = await pool.query(userQueries.deleteUser, [id_usuario]);
    
            // Si la eliminación no afecta ninguna fila, significa que el usuario no fue encontrado
            if (rows.length === 0) {
                return null;
            }
    
            return rows[0];  // Retorna el usuario eliminado
        } catch (error) {
            throw new Error(`Error al eliminar el usuario: ${error.message}`);
        }
    },

    loginUser: async (correo, contraseña) => {
        try {
            // Obtener usuario por correo
            const { rows } = await pool.query(userQueries.getUser, [correo]);
            const user = rows[0];

            if (!user) {
                throw new Error('Correo o contraseña incorrectos');
            }

            // Verificar si la contraseña es correcta
            const isMatch = await bcrypt.compare(contraseña, user.contraseña);

            if (!isMatch) {
                throw new Error('Correo o contraseña incorrectos');
            }

            // Generar un JWT
            const token = jwt.sign(
                { id_usuario: user.id_usuario, correo: user.correo, rol: user.rol },
                process.env.JWT_SECRET,  // Asegúrate de tener tu clave secreta en .env
                { expiresIn: '1h' }
            );

            return token;  // Retorna el token generado
        } catch (error) {
            throw new Error('Error al autenticar al usuario: ' + error.message);
        }
    },

    // Servicio para verificar la contraseña de un usuario
    verifyPassword: async (password, hashedPassword) => {
        try {
            const isMatch = await bcrypt.compare(password, hashedPassword);
            return isMatch;  // Devuelve true si la contraseña es correcta
        } catch (error) {
            throw new Error(`Error al verificar la contraseña: ${error.message}`);
        }
    },

    // Servicio para generar un JWT de autenticación
    generateToken: (user) => {
        // Puedes incluir los datos que quieras en el JWT, por ejemplo, el ID del usuario y el rol
        const payload = {
            id_usuario: user.id_usuario,
            correo: user.correo,
            rol: user.rol
        };

        // Se genera el token utilizando el secreto configurado
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token;
    }
};

module.exports = userServices;
