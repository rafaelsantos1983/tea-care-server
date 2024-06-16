import express from 'express';

const router = express.Router();

/**
 * Rota responsável por verificar se o microserviço está liveness.
 */

router.get('/api/auth/liveness', (req, res) => {
  res.send('[auth] liveness');
});

export { router as livenessRouter };
