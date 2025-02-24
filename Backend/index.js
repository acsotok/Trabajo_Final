const express = require('express')
const cors = require('cors')
const app = express()
const pool = require('./src/config/db')
require ('dotenv').config()
const lenteRoutes = require('./src/routes/lenteRoutes')
const userRoutes = require('./src/routes/userRoutes')
const pedidosRoutes = require('./src/routes/pedidosRoutes')

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a la base de datos
pool.connect().then(() => {
    console.log('Conexión a la base de datos exitosa');
  })


// Rutas
app.use('/productos', lenteRoutes) // Ruta para las operaciones de los lentes
app.use('/usuarios', userRoutes)
app.use('/pedidos', pedidosRoutes)

// Configuración del puerto
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`)
})