
import { Router } from 'express';
import { activeNetworkService } from '../context';

const router = Router();

router.get('/metrics', (req, res) => {
  const metrics = activeNetworkService.getMetrics();
  res.json(metrics);
});

export default router;
