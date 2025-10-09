
const session = require('express-session');

const sessionOptions = {
    // Usamos una variable de entorno para el secreto de producción
    secret: process.env.SESSION_SECRET || "secreto-sesión-no-tan-secreto",
    resave: false, // Evita guardar la sesión si no se modifica
    saveUninitialized: false, // Evita crear sesiones vacías
    cookie: {
        secure: process.env.NODE_ENV === 'production', // true solo en HTTPS (producción)
        httpOnly: true, // Protege contra XSS
        maxAge: 86400000, // 1 día
    }

};

module.exports = session(sessionOptions);