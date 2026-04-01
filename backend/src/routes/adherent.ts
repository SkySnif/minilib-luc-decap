// backend/src/routes/adherents.js
import express, { Router } from 'express';
import asyncWrapper from '../middleware/asyncWrapper.js';
import * as controller from '../controllers/adherentsController.js';

const router: Router = express.Router();

router.get( '/', asyncWrapper( controller.getAdherents));
router.get( '/:id', asyncWrapper( controller.getAdherentById));
router.post( '/', asyncWrapper( controller.createAdherent));
router.delete( '/:id', asyncWrapper( controller.desactiverAdherent));

export default router;