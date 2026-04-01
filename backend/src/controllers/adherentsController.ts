// backend/src/controllers/adherentsController.js
import { Request, Response } from 'express';

import ApiError from "../utils/ApiError.js";
import { Adherent, CreateAdherentDto } from '../types/adherent.js';

import * as adherentsModel from '../models/adherentsModel.js';

/** GET /api/v1/adherents */
export const getAdherents = async ( 
    req: Request<{}, Adherent[], {}, {}>,
    res: Response) : Promise<void> => 
{
    const adherents: Adherent[] = await adherentsModel.findAll();

    // TODO: Add criteria like livres
    if (adherents.length === 0)
        throw new ApiError(404, "No adherents find with these criteria")

    res.json( adherents);
};

/** GET /api/v1/adherents/:id */
export const getAdherentById = async ( 
    req: Request<{id: string}, Adherent, {}, {}>,
    res: Response) : Promise<void> => 
{
   const id: number = Number(req.params.id)
    if (isNaN(id))
        throw ApiError.badRequest('Id invalide');

    const adherent: Adherent = await adherentsModel.findById( id);

    if ( !adherent)
        throw new ApiError(404, 'Adhérent id:${req.params.id} introuvable');

    res.json(adherent);
};

/** POST /api/v1/adherents */
export const createAdherent = async ( 
    req: Request<{}, Adherent, CreateAdherentDto, {}>,
    res: Response) : Promise<void> => 
{
    const champsObligatoires: (keyof CreateAdherentDto)[] = ['nom','prenom','email'];
    const manquants = champsObligatoires.filter( k => !req.body[k]);

    if ( manquants.length > 0)
        throw new ApiError(404, 'Champs manquants', { champs: manquants } );

    const nouveau: Adherent = await adherentsModel.create( req.body);

    res.status(201).json( nouveau);
};

/** DELETE /api/v1/adherents/:id — soft delete */
export const desactiverAdherent = async ( req, res) => 
{
    const adherent = await adherentsModel.desactiver( req.params.id);

    if ( !adherent)
        return res.status(404).json(
            { 
                erreur: `Adhérent id:${req.params.id} introuvable` 
            }
        );

    res.json( adherent);
};