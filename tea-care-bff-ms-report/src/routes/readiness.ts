import express from 'express';

import { readinessController } from '../controllers/readiness-controller';

const router = express.Router();

/**
 * Rota responsável por verificar se o microserviço está readiness.
 */

router.get('/api/reports/readiness', readinessController);

export { router as readinessRouter };
