// backend/src/models/empruntModel.js
/**
* Accès aux données adhérents via PostgreSQL.
* @module empruntModel
*/

import pool from '../config/database.js';
import { QueryResult } from '../types/queryResult.js';

import { Emprunt } from '../types/emprunt.js';

// ───────────────────────────────────────────────────────────────
// ──── Export function ─ exposed to route ───────────────────────
// ───────────────────────────────────────────────────────────────

/** @async @returns {Promise<Array>} Tous les adhérents actifs */
export const findAll = async () : Promise<Emprunt[]>=> 
{
    const result:QueryResult<Emprunt> = await pool.query( 
        `SELECT 
            * 
        FROM 
            emprunt 
        WHERE 
            actif = true 
        ORDER BY 
            nom, 
            prenom`
    );

    return result.rows;
};

