import express from 'express';

const router = express.Router();

/**
 * Rota responsável por verificar se o microserviço está liveness.
 */

router.get('/api/therapeutic-activity/liveness', (req, res) => {
  res.send('[therapeutic-activity] liveness');
});

export { router as livenessRouter };
