import express from 'express';
import { addExpense } from '../controllers/expense.controller.js'; // Note .js

const router = express.Router();
router.post('/expenses', addExpense);

export default router;