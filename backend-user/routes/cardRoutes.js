import express from 'express';
import {
  getUserCards,
  addCard,
  deleteCard,
  setDefaultCard
} from '../controllers/cardController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// 모든 라우트는 인증 필요
router.use(protect);

router.get('/', getUserCards);
router.post('/', addCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/default', setDefaultCard);

export default router;

