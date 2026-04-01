// backend/src/controllers/empruntsController.js
import { Request, Response } from 'express';

import ApiError from "../utils/ApiError.js";

import { Emprunt } from '../types/emprunt.js';
import * as empruntsModel from '../models/empruntsModel.js';

/** GET /api/v1/emprunts */
export const getEmprunts = async ( 
    req: Request<{}, Emprunt[], {}, {}>,
    res: Response) : Promise<void> => 
{
    const emprunts = await empruntsModel.findAll();

    // TODO: Add criteria like livres
    if (emprunts.length === 0)
        throw new ApiError(404, "No emprunts find with these criteria")

    res.json( emprunts);
};
