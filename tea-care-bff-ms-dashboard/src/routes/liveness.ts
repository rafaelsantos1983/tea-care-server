import express from 'express';

const router = express.Router();

/**
 * Rota responsável por verificar se o microserviço está liveness.
 */

router.get('/api/dashboard/liveness', (req, res) => {
  res.send('[dashboard] liveness');
});

export { router as livenessRouter };
