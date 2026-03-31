// backend/src/routes/emprunt.js
import express from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import * as controller from '../controllers/enprumptsController.js';

const router = express.Router();

router.get( '/', asyncWrapper( controller.getEmprunt));
router.get( '/:id', asyncWrapper( controller.getAdherentById));
router.post( '/', asyncWrapper( controller.createAdherent));
router.delete( '/:id', asyncWrapper( controller.desactiverAdherent));

export default router;