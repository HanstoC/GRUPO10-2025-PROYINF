const { Pool } = require('pg');

const db = new Pool({
  user: process.env.DB_USER || 'user',
  host: process.env.DB_HOST || 'postgres_db',
  database: process.env.DB_NAME || 'mydb',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

(async () => {
  try {
    await db.query('SET search_path TO "public"');
    console.log('PostgreSQL Pool y search_path configurados correctamente.');
  } catch (err) {
    console.error('ERROR CRÍTICO: Falló la configuración inicial del Pool.', err);
  }
})();

module.exports = db; 