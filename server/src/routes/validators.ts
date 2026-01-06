import { Router } from 'express';
import { activeNetworkService } from '../context';

const router = Router();

router.get('/', (req, res) => {
  const validators = activeNetworkService.getValidators();
  res.json(validators);
});

router.get('/:id', (req, res) => {
  const validators = activeNetworkService.getValidators();
  const validator = validators.find((v: any) => v.id === req.params.id);
  if (!validator) {
    return res.status(404).json({ error: "Validator not found" });
  }
  res.json(validator);
});

export default router;
