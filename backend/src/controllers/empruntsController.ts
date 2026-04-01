// backend/src/controllers/empruntsController.js
import * as empruntsModel from '../models/empruntsModel.js';

/** GET /api/v1/emprunts */
export const getEmprunts = async ( req, res) => 
{
    try 
    {
        const emprunts = await empruntsModel.findAll();

        res.json( emprunts);
    }
    catch (error) 
    {
        res.status(500).json(
            { 
                erreur: 'Erreur when retrieving emprunt' 
            }
        );
    }
};

/** GET /api/v1/emprunts/:id */
export const getEmpruntById = async ( req, res) => 
{
    const emprunt = await empruntsModel.findById( req.params.id);

    if ( !emprunt)
        return res.status(404).json(
            { 
                erreur: `Adhérent id:${req.params.id} introuvable` 
            }
        );

    res.json(emprunt);
};

/** POST /api/v1/emprunts */
export const createEmprunt = async ( req, res) => 
{
    const { nom, prenom, email } = req.body;
    const manquants = ['nom','prenom','email'].filter( k => !req.body[k]);

    if ( manquants.length > 0)
        return res.status(400).json(
            { 
                erreur: 'Champs manquants', 
                champs:manquants 
            }
        );

    const nouveau = await empruntsModel.create(
        { 
            nom, 
            prenom, 
            email 
        }
    );

    res.status(201).json( nouveau);
};

/** DELETE /api/v1/emprunts/:id — soft delete */
export const desactiverEmprunt = async ( req, res) => 
{
    const emprunt = await empruntsModel.desactiver( req.params.id);

    if ( !emprunt)
        return res.status(404).json(
            { 
                erreur: `Adhérent id:${req.params.id} introuvable` 
            }
        );

    res.json( emprunt);
};