// ─── backend/src/controllers/livresController.js ──────────────────────
// Controller pour les livres — logique métier entre les routes et les données

import { Request, Response } from 'express';

import ApiError from "../utils/ApiError.js";

import { Livre, FiltresLivre } from '../types/livre.js';
import * as livresModel from '../models/livresModel.js';

/**
* Récupère tous les livres avec filtres optionnels via query params.
* GET /api/v1/livres?genre=Informatique&disponible=true&recherche=clean
*
* @param {import('express').Request} req - Requête Express
* @param {import('express').Response} res - Réponse Express
*/
export const getLivres = async( 
    req: Request<{}, Livre[], {}, FiltresLivre>,
    res: Response<Livre[]>
) : Promise<void> => 
{
        // req.query contient les paramètres de l'URL (?genre=...&disponible=...)
        const livres: Livre[] = await livresModel.findAll( req.body);

        if (livres.length === 0)
            throw new ApiError(404, "No book find with these criteria")

        res.json( livres);
};

/**
* Récupère un livre par son id.
* GET /api/v1/livres/:id
*
* @param {import('express').Request} req
* @param {import('express').Response} res
*/
export const getLivreById = async( 
    req: Request<{ id: string }, Livre, {}, {}>,
    res: Response<Livre>
) : Promise<void> =>
{
    const id: number = Number(req.params.id)
    if (isNaN(id))
        throw ApiError.badRequest('Id invalide');

    const livre: Livre|null = await livresModel.findById( id);

   if (!livre)
        throw new ApiError(404, `Livre id:${req.params.id} non trouvé`);

    res.json( livre);
};

/**
* Crée un nouveau livre.* POST /api/v1/livres
* Body JSON attendu : { isbn, titre, auteur, annee, genre }
*
* @param {import('express').Request} req
* @param {import('express').Response} res
*/
export const createLivre = async ( 
    req: Request<{}, Livre, Livre, {}>,
    res: Response) : Promise<void> => 
{
    const champsObligatoires: (keyof Livre)[] = ['isbn', 'titre', 'auteur'];
    const manquants = champsObligatoires.filter( k => !req.body[k]);

    if ( manquants.length > 0)
        throw ApiError.badRequest("Champs obligatoires manquants", { champs: manquants });

    const nouveau: Livre = await livresModel.create(req.body);

    // 201 Created — ressource créée avec succès
    res.status(201).json(nouveau);
};

/**
* Met à jour un livre existant.
* PUT /api/v1/livres/:id
*
* @param {import('express').Request} req
* @param {import('express').Response} res
*/
export const updateLivre = async ( 
    req: Request<{id : string}, Livre,  Partial<Livre>, {}>,
    res: Response) : Promise<void> => 
{
   const id: number = Number(req.params.id)
    if (isNaN(id))
        throw ApiError.badRequest('Id invalide');
    
    const misAJour = await livresModel.update( id, req.body);

    if ( !misAJour) 
        throw new ApiError(404, `Livre id:${req.params.id} non trouvé`);

    res.json( misAJour);
};

/**
* Supprime un livre.
* DELETE /api/v1/livres/:id
*
* @param {import('express').Request} req
* @param {import('express').Response} res
*/
export const deleteLivre = async ( 
    req: Request<{id : string}, {},  {}, {}>,
    res: Response) : Promise<void> => 
{
    const id: number = Number(req.params.id)
    if (isNaN(id))
        throw ApiError.badRequest('Id invalide');

    const supprimé: boolean = await livresModel.remove( id);

    if ( !supprimé) 
        throw new ApiError(404, `Livre id:${req.params.id} non trouvé`);

    // 204 No Content — succès sans corps de réponse
    res.status(204).send();
};
