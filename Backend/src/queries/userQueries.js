const userQueries = {
    getUser: "SELECT * FROM usuarios WHERE correo = $1",
    getUserById: "SELECT * FROM usuarios WHERE id_usuario = $1",
    addUser: "INSERT INTO usuarios (nombre, correo, contraseña, direccion, telefono, rol) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    updateUser: "UPDATE usuarios SET nombre = $1, correo = $2, contraseña = $3, direccion = $4, telefono = $5, rol = $6 WHERE id = $7 RETURNING *",
    deleteUser: "DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *"
}

module.exports = userQueries