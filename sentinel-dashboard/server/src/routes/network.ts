
import { Router } from 'express';
import { chainSimulator } from '../context';

const router = Router();

router.get('/metrics', (req, res) => {
  const metrics = chainSimulator.getMetrics();
  res.json(metrics);
});

export default router;
