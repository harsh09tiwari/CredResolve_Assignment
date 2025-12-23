import express from 'express';
import { createGroup, getGroupBalance } from '../controllers/group.controller.js'; // Note .js

const router = express.Router();
router.post('/groups', createGroup);
router.get('/groups/:groupId/balance', getGroupBalance);

export default router;