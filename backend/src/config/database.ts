// backend/src/config/database.js
/**
* Pool de connexions PostgreSQL partagé dans toute l'application.
* Chargé via Node 24 : node --env-file=.env src/app.js
* @module database
*/
import { Pool } from 'pg';

const pool: Pool = new Pool(
    {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        database: process.env.DB_NAME || 'minilib',
        user: process.env.DB_USER || 'minilib_user',
        password: process.env.DB_PASSWORD,
        max: 10,
        idleTimeoutMillis: 30000,
    }
);

pool.on('connect', () => console.log( '[DB] Pool PostgreSQL connecté'));
pool.on('error', (err: Error) => console.error( '[DB] Erreur pool:', err.message,  err.stack));

export default pool;