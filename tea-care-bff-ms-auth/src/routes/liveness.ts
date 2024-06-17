import { logger } from '@teacare/tea-care-bfb-ms-common';
import express from 'express';

const router = express.Router();

/**
 * Rota responsável por verificar se o microserviço está liveness.
 */

router.get('/api/auth/liveness', (req, res) => {
  logger.debug('[auth] liveness');
  res.send('[auth] liveness');
});

export { router as livenessRouter };
