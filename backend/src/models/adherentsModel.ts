// backend/src/models/adherentsModel.js
/**
* Accès aux données adhérents via PostgreSQL.
* @module adherentsModel
*/
import pool from '../config/database.js';
import { QueryResult } from '../types/queryResult.js';

import { Adherent, CreateAdherentDto } from '../types/adherent.js';

// ───────────────────────────────────────────────────────────────
// ──── Private function ─ not exposed to route ───────────────────────
// ───────────────────────────────────────────────────────────────

/**
* Génère un numéro adhérent unique au format ADH-XXX.
* @async
* @returns {Promise<string>} Numéro adhérent
*/
const genererNumeroAdherent = async (): Promise<string> => 
{
    const result = await pool.query( 'SELECT COUNT(*) FROM adherents');
    const count = parseInt( result.rows[0].count) + 1;

    return `ADH-${String(count).padStart(3, '0')}`; // ADH-001, ADH-042...
};

// ───────────────────────────────────────────────────────────────
// ──── Export function ─ exposed to route ───────────────────────
// ───────────────────────────────────────────────────────────────

/** @async @returns {Promise<Array>} Tous les adhérents actifs */
export const findAll = async ()  : Promise<Adherent[]> => 
{
    const result: QueryResult<Adherent> = await pool.query<Adherent>( 
        `SELECT 
            * 
        FROM 
            adherents 
        WHERE 
            actif = true 
        ORDER BY 
            nom,
            prenom`
    );

    return result.rows;
};

/** @async @param {number} id @returns {Promise<Object|null>} */
export const findById = async ( id: number) => 
{
    const result: QueryResult<Adherent> = await pool.query<Adherent>( 
        `SELECT 
            * 
        FROM 
            adherents 
        WHERE 
            id = $1`, 
        [id]
    );

    return result.rows[0] || null;
};

/**
* Create a new adherent with a unique adherent number 
* @async
* @param {Object} data - { nom, prenom, email }
* @returns {Promise<Object>} Adhérent créé
*/
export const create = async (data: CreateAdherentDto): Promise<Adherent> => 
{
    const numero: string = await genererNumeroAdherent();

    // Retrieve the list of the CreateLivreDto's fields 
    // TODO: Check details of this instruction
    const entries:[keyof CreateAdherentDto, string | number | boolean][] = Object.entries(data).filter(
        ([, v]) => v !== undefined
        ) as [keyof CreateAdherentDto, string | number | boolean][];

    const champs: (string | number | boolean )[] = entries.map(([k]) => k);
    const valeurs:(string | number | boolean )[] = entries.map(([, v]) => v);

    // Add numero_adherent in insert at the beginning of champs/valeur tab
    champs.unshift('numero_adherent');
    valeurs.unshift( numero);

    // Build values string for SQL
    const SQLqueryvalue: string = champs.map((_, i) => `$${i + 1}`).join(', ');
    const SQLField: string = champs.join(', ');

    const result: QueryResult<Adherent> = await pool.query<Adherent>( 
        `INSERT INTO 
            adherents 
                (${SQLField}) 
        VALUES 
            (${SQLField}) 
        RETURNING 
            *`,
        valeurs
    );

    return result.rows[0];
};

/**
* Disabled an adherent (soft delete — we are never deleting line in the BDD).
* @async
* @param {number} id
* @returns {Promise<Object|null>} Adhérent mis à jour
*/
export const desactiver = async (id: number) : Promise<Adherent> => 
{
    const result: QueryResult<Adherent> = await pool.query<Adherent>( 
        `UPDATE 
            adherents 
        SET
            actif = false 
        WHERE 
            id = $1 
        RETURNING 
            *`, 
        [id]
    );

    return result.rows[0] || null;
};