import express from 'express';

const router = express.Router();

/**
 * Rota responsável por verificar se o microserviço está liveness.
 */

router.get('/api/configs/liveness', (req, res) => {
  res.send('[config] liveness');
});

export { router as livenessRouter };
