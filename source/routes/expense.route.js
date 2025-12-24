import express from 'express';
import { addExpense, settleDues } from '../controllers/expense.controller.js'; // Note .js

const router = express.Router();
router.post('/addExpense', addExpense);
router.post('/settleExpense', settleDues);

export default router;