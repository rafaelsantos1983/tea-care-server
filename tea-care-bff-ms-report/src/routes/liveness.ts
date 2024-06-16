import express from 'express';

const router = express.Router();

/**
 * Rota responsável por verificar se o microserviço está liveness.
 */

router.get('/api/reports/liveness', (req, res) => {
  res.send('[reports] liveness');
});

export { router as livenessRouter };
