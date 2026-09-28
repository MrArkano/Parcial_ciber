import { Router } from 'express';
import { TeamController } from '../controllers/TeamController';
const router = Router();
router.post('/submit', TeamController.submit);
router.get('/scoreboard', TeamController.scoreboard);
export default router;
